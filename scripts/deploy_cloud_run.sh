#!/usr/bin/env bash
# ==============================================================================
# Cymbal Agentic Suite - Google Cloud Run Automated Deployment Script
# ==============================================================================
# Deploys long-horizon-agent and storefront microservices to Google Cloud Run.
#
# Usage:
#   ./scripts/deploy_cloud_run.sh [OPTIONS]
#
# Options:
#   --project-id  <GCP_PROJECT_ID>   (Default: current gcloud active project)
#   --region      <GCP_REGION>       (Default: us-central1)
#   --repo-name   <REPO_NAME>        (Default: cymbal-repo)
#   --target      <all|agent|store>  (Default: all)
#   --help                           Show this help message
# ==============================================================================

set -euo pipefail

# Default configuration
REGION="us-central1"
REPO_NAME="cymbal-repo"
TARGET="all"
PROJECT_ID="$(gcloud config get-value project 2>/dev/null || true)"

# Parse CLI arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-id)
      PROJECT_ID="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --repo-name)
      REPO_NAME="$2"
      shift 2
      ;;
    --target)
      TARGET="$2"
      shift 2
      ;;
    --help)
      grep '^# ' "$0" | cut -c 3-
      exit 0
      ;;
    *)
      echo "❌ Unknown argument: $1"
      exit 1
      ;;
  esac
done

if [[ -z "${PROJECT_ID}" ]]; then
  echo "❌ Error: Google Cloud Project ID is not set. Specify via --project-id <PROJECT_ID> or run 'gcloud config set project <PROJECT_ID>'"
  exit 1
fi

echo "================================================================================"
echo "🚀 Cymbal Agentic Suite Deployment to Google Cloud Run"
echo "================================================================================"
echo "Project ID : ${PROJECT_ID}"
echo "Region     : ${REGION}"
echo "Repository : ${REPO_NAME}"
echo "Target     : ${TARGET}"
echo "================================================================================"

# 1. Enable Required GCP APIs
echo "📦 [1/6] Enabling required Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  --project "${PROJECT_ID}"

# 2. Ensure Artifact Registry Repository Exists
echo "📦 [2/6] Checking Artifact Registry repository..."
if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  echo "Creating Artifact Registry repository '${REPO_NAME}'..."
  gcloud artifacts repositories create "${REPO_NAME}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Docker repository for Cymbal Agentic Suite" \
    --project="${PROJECT_ID}"
else
  echo "Artifact Registry repository '${REPO_NAME}' exists."
fi

# 3. Create / Verify Service Account
echo "🔐 [3/6] Configuring runtime Service Account..."
SA_NAME="cymbal-run-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe "${SA_EMAIL}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  echo "Creating service account '${SA_NAME}'..."
  gcloud iam service-accounts create "${SA_NAME}" \
    --display-name="Cymbal Cloud Run Service Account" \
    --project="${PROJECT_ID}"
fi

# Grant Secret Manager Secret Accessor
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None >/dev/null 2>&1 || true

# 4. Verify Secret Manager Secrets
echo "🔐 [4/6] Verifying Secret Manager secrets..."
if ! gcloud secrets describe "GEMINI_API_KEY" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  if [[ -n "${GEMINI_API_KEY:-}" ]]; then
    echo "Creating Secret 'GEMINI_API_KEY' from environment..."
    echo -n "${GEMINI_API_KEY}" | gcloud secrets create "GEMINI_API_KEY" --data-file=- --project="${PROJECT_ID}"
  else
    echo "⚠️ Warning: Secret 'GEMINI_API_KEY' does not exist in Secret Manager."
    echo "Create it using: echo -n 'YOUR_API_KEY' | gcloud secrets create GEMINI_API_KEY --data-file=-"
  fi
fi

# 5. Deploy Long Horizon Agent
AGENT_URL=""
if [[ "${TARGET}" == "all" || "${TARGET}" == "agent" ]]; then
  echo "🤖 [5/6] Building & Deploying 'long-horizon-agent' to Cloud Run..."
  AGENT_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/long-horizon-agent:latest"

  gcloud builds submit ./services/long-horizon-agent \
    --tag "${AGENT_IMAGE}" \
    --project "${PROJECT_ID}"

  gcloud run deploy long-horizon-agent \
    --image "${AGENT_IMAGE}" \
    --region "${REGION}" \
    --project "${PROJECT_ID}" \
    --service-account "${SA_EMAIL}" \
    --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" \
    --set-env-vars "LHA_MODEL=gemini-3.7-flash,PORT=8080" \
    --cpu 2 \
    --memory 2Gi \
    --concurrency 80 \
    --timeout 300 \
    --min-instances 0 \
    --max-instances 10 \
    --allow-unauthenticated

  AGENT_URL=$(gcloud run services describe long-horizon-agent --region "${REGION}" --project "${PROJECT_ID}" --format 'value(status.url)')
  echo "✅ Long Horizon Agent deployed at: ${AGENT_URL}"
fi

# 6. Deploy Storefront
STOREFRONT_URL=""
if [[ "${TARGET}" == "all" || "${TARGET}" == "store" ]]; then
  echo "🌐 [6/6] Building & Deploying 'cymbal-storefront' to Cloud Run..."

  if [[ -z "${AGENT_URL}" ]]; then
    AGENT_URL=$(gcloud run services describe long-horizon-agent --region "${REGION}" --project "${PROJECT_ID}" --format 'value(status.url)' 2>/dev/null || true)
  fi

  STOREFRONT_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/cymbal-storefront:latest"

  # Build root monorepo container targeting storefront Dockerfile
  gcloud builds submit . \
    --config=<(cat <<EOF
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-f', 'apps/storefront/Dockerfile', '-t', '${STOREFRONT_IMAGE}', '.']
images:
- '${STOREFRONT_IMAGE}'
EOF
) \
    --project "${PROJECT_ID}"

  gcloud run deploy cymbal-storefront \
    --image "${STOREFRONT_IMAGE}" \
    --region "${REGION}" \
    --project "${PROJECT_ID}" \
    --service-account "${SA_EMAIL}" \
    --set-env-vars "AGENT_A2A_URL=${AGENT_URL}/a2a,NODE_ENV=production,PORT=8080" \
    --cpu 1 \
    --memory 1Gi \
    --concurrency 80 \
    --min-instances 0 \
    --max-instances 10 \
    --allow-unauthenticated

  STOREFRONT_URL=$(gcloud run services describe cymbal-storefront --region "${REGION}" --project "${PROJECT_ID}" --format 'value(status.url)')
  echo "✅ Cymbal Storefront deployed at: ${STOREFRONT_URL}"
fi

echo "================================================================================"
echo "🎉 Deployment Complete!"
echo "================================================================================"
if [[ -n "${AGENT_URL}" ]]; then
  echo "🤖 Long Horizon Agent : ${AGENT_URL}/a2a"
  echo "   Health Check        : ${AGENT_URL}/healthz"
fi
if [[ -n "${STOREFRONT_URL}" ]]; then
  echo "🌐 Cymbal Storefront   : ${STOREFRONT_URL}"
  echo "   Demo Simulator      : ${STOREFRONT_URL}/demo-controls"
fi
echo "================================================================================"
