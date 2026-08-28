# ☁️ Google Cloud Run Preparation & Deployment Guide

> **Cymbal Agentic Customer Lifecycle & Revenue Recovery Suite**  
> Complete production guide for containerizing, configuring, securing, and deploying the multi-service suite to **Google Cloud Run**.

---

## 🏛️ Deployment Topology & Architecture

The Cymbal Agentic Suite consists of microservices designed to run serverlessly on Google Cloud Run:

```text
                                       ┌────────────────────────┐
                                       │     INTERNET / CDN     │
                                       └───────────┬────────────┘
                                                   │
                                                   ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                      CYMBAL STOREFRONT                      │
                    │        Next.js 15 (App Router) • Ingress: Public           │
                    │      Port 8080 • Min: 0-1 • Memory: 1-2Gi • CPU: 1-2        │
                    └──────────────────────────────┬──────────────────────────────┘
                                                   │ (Authenticated A2A JSON-RPC)
                                                   ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                   LONG HORIZON AGENT                        │
                    │    Python 3.12 + Google ADK 2.5 • Ingress: Internal / IAM   │
                    │      Port 8080 • Min: 0-1 • Memory: 2-4Gi • CPU: 2-4        │
                    └──────────────┬──────────────────────────────┬───────────────┘
                                   │                              │
                                   ▼                              ▼
                    ┌──────────────────────────────┐ ┌────────────────────────────┐
                    │     SECRET MANAGER / GCP     │ │      GEMINI 3.7 FLASH      │
                    │    GEMINI_API_KEY / IAM SA   │ │   Vertex AI / Studio API   │
                    └──────────────────────────────┘ └────────────────────────────┘
```

---

## 📋 1. Prerequisites & GCP Project Setup

### 1.1 Set Environment Variables
```bash
export PROJECT_ID="your-gcp-project-id"
export REGION="us-central1"
export REPO_NAME="cymbal-repo"

gcloud config set project ${PROJECT_ID}
```

### 1.2 Enable Required Google Cloud APIs
Enable the necessary services for Cloud Run, container builds, and secret storage:
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com
```

### 1.3 Create Artifact Registry Repository
```bash
gcloud artifacts repositories create ${REPO_NAME} \
  --repository-format=docker \
  --location=${REGION} \
  --description="Docker repository for Cymbal Agentic Suite"
```

### 1.4 Dedicated Runtime Service Account & IAM Roles
Create a dedicated service account to enforce least-privilege access:
```bash
# Create service account
gcloud iam service-accounts create cymbal-run-sa \
  --display-name="Cymbal Cloud Run Service Account"

export SA_EMAIL="cymbal-run-sa@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Secret Manager Access
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

# Grant Vertex AI / Gemini access (if using Vertex AI endpoint)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user"
```

---

## 🔐 2. Secret Management Setup

Do **not** bake API keys or secrets into container images or plaintext environment variables. Store them in Google Cloud Secret Manager:

```bash
# 1. Store Gemini API Key
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --replication-policy="automatic"

# 2. Store Webhook / Internal Keys
echo -n "cymbal_demo_ucp_secret_2026" | gcloud secrets create UCP_WEBHOOK_SECRET \
  --data-file=- \
  --replication-policy="automatic"

echo -n "cymbal_internal_event_key_2026" | gcloud secrets create INTERNAL_EVENT_API_KEY \
  --data-file=- \
  --replication-policy="automatic"
```

---

## 📦 3. Container Contracts & Requirements

Cloud Run imposes key runtime contracts that each service adheres to:

1. **Dynamic Port Binding (`PORT` env var)**:
   - Cloud Run dynamically injects `PORT=8080`.
   - The application web server (Uvicorn, Next.js standalone) must listen on `0.0.0.0:${PORT}`.
2. **Statelessness & Volatile Disk**:
   - Local filesystem changes (`/tmp`) are stored in volatile RAM.
   - Long-term memory or session storage uses external stores (BigQuery, Cloud Storage, or Firestore).
3. **Graceful Termination (`SIGTERM`)**:
   - Cloud Run sends `SIGTERM` before terminating instances (default 10s grace period).
   - Python FastAPI / Uvicorn uses `--timeout-graceful-shutdown 4` to cleanly complete in-flight transactions.
4. **Security & Non-Root Execution**:
   - Container processes run under non-root users (`appuser` / `nextjs`).

---

## 🚀 4. Service-by-Service Deployment

### Service 1: `long-horizon-agent` (FastAPI / ADK 2.5)

#### Option A: Direct Build & Deploy via Google Cloud Build
```bash
gcloud run deploy long-horizon-agent \
  --source ./services/long-horizon-agent \
  --region ${REGION} \
  --service-account ${SA_EMAIL} \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --set-env-vars "LHA_MODEL=gemini-3.7-flash,PORT=8080" \
  --cpu 2 \
  --memory 2Gi \
  --concurrency 80 \
  --timeout 300 \
  --min-instances 0 \
  --max-instances 10 \
  --allow-unauthenticated
```

#### Option B: Build via Artifact Registry & Deploy
```bash
export AGENT_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/long-horizon-agent:latest"

# 1. Build and push image
gcloud builds submit ./services/long-horizon-agent \
  --tag ${AGENT_IMAGE}

# 2. Deploy container image
gcloud run deploy long-horizon-agent \
  --image ${AGENT_IMAGE} \
  --region ${REGION} \
  --service-account ${SA_EMAIL} \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --set-env-vars "LHA_MODEL=gemini-3.7-flash,PORT=8080" \
  --cpu 2 \
  --memory 2Gi \
  --allow-unauthenticated
```

---

### Service 2: `storefront` (Next.js 15)

#### 1. Retrieve the Deployed Agent URL
```bash
export AGENT_URL=$(gcloud run services describe long-horizon-agent \
  --region ${REGION} \
  --format 'value(status.url)')
echo "Agent deployed at: ${AGENT_URL}"
```

#### 2. Deploy Storefront
```bash
gcloud run deploy cymbal-storefront \
  --source . \
  --region ${REGION} \
  --service-account ${SA_EMAIL} \
  --set-secrets "UCP_WEBHOOK_SECRET=UCP_WEBHOOK_SECRET:latest,INTERNAL_EVENT_API_KEY=INTERNAL_EVENT_API_KEY:latest" \
  --set-env-vars "AGENT_A2A_URL=${AGENT_URL}/a2a,NODE_ENV=production,PORT=8080" \
  --cpu 1 \
  --memory 1Gi \
  --min-instances 0 \
  --max-instances 10 \
  --allow-unauthenticated
```

---

## 🔒 5. Inter-Service Security & Private A2A Communication

For maximum production security, make `long-horizon-agent` private and authenticate calls from `storefront`:

### 5.1 Restrict Ingress to Authenticated Invokers
Deploy or update the agent service with `--no-allow-unauthenticated`:
```bash
gcloud run services remove-iam-policy-binding long-horizon-agent \
  --region ${REGION} \
  --member="allUsers" \
  --role="roles/run.invoker"

gcloud run services add-iam-policy-binding long-horizon-agent \
  --region ${REGION} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.invoker"
```

### 5.2 Server-to-Server Token Header
In Next.js API routes or Node backends, fetch an OpenID Connect (OIDC) ID token from the GCP Metadata Server:
```typescript
// Fetch Google OIDC identity token in Cloud Run
async function getCloudRunIdToken(targetAudience: string): Promise<string> {
  const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(targetAudience)}`;
  const res = await fetch(metadataUrl, {
    headers: { 'Metadata-Flavor': 'Google' }
  });
  return res.text();
}
```

---

## 📊 6. Scaling, Performance & Cost Optimization

| Parameter | Recommended Dev/Hackathon | Recommended Production | Rationale |
| :--- | :--- | :--- | :--- |
| `--min-instances` | `0` | `1` | `0` allows scale-to-zero ($0 idle cost); `1` eliminates cold start latency. |
| `--max-instances` | `5` | `20+` | Caps maximum horizontal concurrency to prevent runaway costs. |
| `--concurrency` | `80` | `80` | Allows up to 80 concurrent HTTP requests per container instance. |
| `--cpu` / `--memory` | `2 CPU` / `2Gi` (Agent)<br>`1 CPU` / `1Gi` (Store) | `2-4 CPU` / `4Gi` (Agent)<br>`2 CPU` / `2Gi` (Store) | Accommodates ADK 2.5 agent orchestration, JSON schema validation, and Next.js SSR. |
| `--timeout` | `300s` | `300s` | Multi-step agentic reasoning / tool execution may take several seconds. |

---

## 🔍 7. Verification & Operational Troubleshooting

### 7.1 Verify Health & Service Status
```bash
# Check service description & active revision
gcloud run services describe long-horizon-agent --region ${REGION}

# Check real-time logs
gcloud run services logs tail long-horizon-agent --region ${REGION}
```

### 7.2 Run Remote Smoke Tests
Use the project smoke testing suite against your Cloud Run deployment:
```bash
# Test remote agent service
python scripts/smoke_test.py --target agent --host ${AGENT_URL}

# Test remote storefront service
python scripts/smoke_test.py --target storefront --host https://your-storefront-url.a.run.app
```

---

## 📝 Pre-Deployment Checklist

- [ ] GCP Project selected and billing confirmed.
- [ ] Required APIs enabled (`run`, `artifactregistry`, `cloudbuild`, `secretmanager`).
- [ ] Secret `GEMINI_API_KEY` created in Google Secret Manager.
- [ ] Runtime Service Account created with `roles/secretmanager.secretAccessor`.
- [ ] Docker container builds cleanly locally or via `gcloud builds submit`.
- [ ] Port binding configured to listen on `0.0.0.0:${PORT}` (default `8080`).
- [ ] Inter-service `AGENT_A2A_URL` mapped correctly in Storefront environment variables.
- [ ] Smoke tests run and pass against the deployed endpoints.
