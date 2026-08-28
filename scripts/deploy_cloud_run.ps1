# ==============================================================================
# Cymbal Agentic Suite - Google Cloud Run Automated Deployment Script (PowerShell)
# ==============================================================================
# Deploys long-horizon-agent and storefront microservices to Google Cloud Run.
#
# Usage:
#   .\scripts\deploy_cloud_run.ps1 [-ProjectId <string>] [-Region <string>] [-Target <string>]
# ==============================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$ProjectId = "",

    [Parameter(Mandatory = $false)]
    [string]$Region = "us-central1",

    [Parameter(Mandatory = $false)]
    [string]$RepoName = "cymbal-repo",

    [Parameter(Mandatory = $false)]
    [ValidateSet("all", "agent", "store")]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"

if (-not $ProjectId) {
    $ProjectId = (gcloud config get-value project 2>$null).Trim()
}

if (-not $ProjectId) {
    Write-Error "❌ Error: Google Cloud Project ID is not set. Specify via -ProjectId <id> or run 'gcloud config set project <id>'"
    exit 1
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "🚀 Cymbal Agentic Suite Deployment to Google Cloud Run" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "Project ID : $ProjectId"
Write-Host "Region     : $Region"
Write-Host "Repository : $RepoName"
Write-Host "Target     : $Target"
Write-Host "================================================================================"

# 1. Enable Required GCP APIs
Write-Host "📦 [1/6] Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    secretmanager.googleapis.com `
    iam.googleapis.com `
    --project $ProjectId

# 2. Check / Create Artifact Registry Repository
Write-Host "📦 [2/6] Checking Artifact Registry repository..." -ForegroundColor Yellow
$repoExists = gcloud artifacts repositories describe $RepoName --location=$Region --project=$ProjectId 2>$null
if (-not $repoExists) {
    Write-Host "Creating Artifact Registry repository '$RepoName'..."
    gcloud artifacts repositories create $RepoName `
        --repository-format=docker `
        --location=$Region `
        --description="Docker repository for Cymbal Agentic Suite" `
        --project=$ProjectId
} else {
    Write-Host "Artifact Registry repository '$RepoName' exists."
}

# 3. Create / Verify Service Account
Write-Host "🔐 [3/6] Configuring runtime Service Account..." -ForegroundColor Yellow
$saName = "cymbal-run-sa"
$saEmail = "${saName}@${ProjectId}.iam.gserviceaccount.com"

$saExists = gcloud iam service-accounts describe $saEmail --project=$ProjectId 2>$null
if (-not $saExists) {
    Write-Host "Creating service account '$saName'..."
    gcloud iam service-accounts create $saName `
        --display-name="Cymbal Cloud Run Service Account" `
        --project=$ProjectId
}

gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$saEmail" `
    --role="roles/secretmanager.secretAccessor" 2>$null | Out-Null

# 4. Check Secret Manager
Write-Host "🔐 [4/6] Verifying Secret Manager secrets..." -ForegroundColor Yellow
$secretExists = gcloud secrets describe "GEMINI_API_KEY" --project=$ProjectId 2>$null
if (-not $secretExists) {
    if ($env:GEMINI_API_KEY) {
        Write-Host "Creating Secret 'GEMINI_API_KEY' from environment..."
        $env:GEMINI_API_KEY | gcloud secrets create "GEMINI_API_KEY" --data-file=- --project=$ProjectId
    } else {
        Write-Warning "Secret 'GEMINI_API_KEY' does not exist in Secret Manager."
        Write-Host "Create it using: echo -n 'YOUR_API_KEY' | gcloud secrets create GEMINI_API_KEY --data-file=-"
    }
}

# 5. Deploy Long Horizon Agent
$agentUrl = ""
if ($Target -eq "all" -or $Target -eq "agent") {
    Write-Host "🤖 [5/6] Building & Deploying 'long-horizon-agent' to Cloud Run..." -ForegroundColor Green
    $agentImage = "${Region}-docker.pkg.dev/${ProjectId}/${RepoName}/long-horizon-agent:latest"

    gcloud builds submit ./services/long-horizon-agent `
        --tag $agentImage `
        --project $ProjectId

    gcloud run deploy long-horizon-agent `
        --image $agentImage `
        --region $Region `
        --project $ProjectId `
        --service-account $saEmail `
        --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" `
        --set-env-vars "LHA_MODEL=gemini-3.7-flash,PORT=8080" `
        --cpu 2 `
        --memory 2Gi `
        --concurrency 80 `
        --timeout 300 `
        --min-instances 0 `
        --max-instances 10 `
        --allow-unauthenticated

    $agentUrl = (gcloud run services describe long-horizon-agent --region $Region --project $ProjectId --format 'value(status.url)').Trim()
    Write-Host "✅ Long Horizon Agent deployed at: $agentUrl" -ForegroundColor Green
}

# 6. Deploy Storefront
$storefrontUrl = ""
if ($Target -eq "all" -or $Target -eq "store") {
    Write-Host "🌐 [6/6] Building & Deploying 'cymbal-storefront' to Cloud Run..." -ForegroundColor Green

    if (-not $agentUrl) {
        $agentUrl = (gcloud run services describe long-horizon-agent --region $Region --project $ProjectId --format 'value(status.url)' 2>$null).Trim()
    }

    $storefrontImage = "${Region}-docker.pkg.dev/${ProjectId}/${RepoName}/cymbal-storefront:latest"

    # Temporary cloudbuild yaml for multi-stage storefront build
    $cloudBuildConfig = @"
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-f', 'apps/storefront/Dockerfile', '-t', '$storefrontImage', '.']
images:
- '$storefrontImage'
"@
    $tempConfigFile = [System.IO.Path]::GetTempFileName() + ".yaml"
    Set-Content -Path $tempConfigFile -Value $cloudBuildConfig

    try {
        gcloud builds submit . `
            --config=$tempConfigFile `
            --project $ProjectId
    } finally {
        Remove-Item -Path $tempConfigFile -Force -ErrorAction SilentlyContinue
    }

    gcloud run deploy cymbal-storefront `
        --image $storefrontImage `
        --region $Region `
        --project $ProjectId `
        --service-account $saEmail `
        --set-env-vars "AGENT_A2A_URL=${agentUrl}/a2a,NODE_ENV=production,PORT=8080" `
        --cpu 1 `
        --memory 1Gi `
        --concurrency 80 `
        --min-instances 0 `
        --max-instances 10 `
        --allow-unauthenticated

    $storefrontUrl = (gcloud run services describe cymbal-storefront --region $Region --project $ProjectId --format 'value(status.url)').Trim()
    Write-Host "✅ Cymbal Storefront deployed at: $storefrontUrl" -ForegroundColor Green
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
if ($agentUrl) {
    Write-Host "🤖 Long Horizon Agent : ${agentUrl}/a2a"
    Write-Host "   Health Check        : ${agentUrl}/healthz"
}
if ($storefrontUrl) {
    Write-Host "🌐 Cymbal Storefront   : ${storefrontUrl}"
    Write-Host "   Demo Simulator      : ${storefrontUrl}/demo-controls"
}
Write-Host "================================================================================"
