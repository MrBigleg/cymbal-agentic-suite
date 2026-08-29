# 🧪 Local Testing & Programmatic Verification Guide

> **Cymbal Agentic Customer Lifecycle & Revenue Recovery Suite**  
> Comprehensive guide for local test execution, automated smoke testing, and containerized Cloud Run parity verification before GCP deployment.

---

## 🏛️ The Two-Tier Verification Strategy ("The Why")

To ensure robust reliability in hackathon evaluation and production deployment, our test architecture uses a **Two-Tier Verification Strategy**:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TWO-TIER VERIFICATION HARNESS                            │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ 1. Host-Level Verification (Fast Loop)    │ 2. Container-Level Parity (Cloud Run)      │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Speed: Seconds (no container build)     │ • Parity: Exact Linux Cloud Run runtime    │
│ • Scope: Python / Node / TS unit logic    │ • Scope: Multi-stage Dockerfile, non-root  │
│ • Execution: pytest, vitest, smoke_test.py│ • Environment: PORT dynamic binding, OS pkg│
│ • Goal: Fast test-driven development loop │ • Goal: Zero unexpected deployment failures│
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

### Why this 2-step approach works best:
1. **Host-Level Test (Fastest):** Tests Python (Google ADK 2.5) and Node.js (Next.js 15 / TypeScript) logic directly in seconds without build or containerization overhead.
2. **Container-Level Test (Cloud Run Fidelity):** Verifies the exact Docker environment (Debian slim packages, non-root `appuser` permissions, `PORT` variable binding, file paths, and startup probes) so there are no surprises when deploying to Google Cloud Run.

---

## 📋 1. Environment & Dependency Validation

### 1.1 Unified Environment Configuration
Copy the consolidated `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Target Service | Purpose | Required / Default |
| :--- | :--- | :--- | :--- |
| `GOOGLE_CLOUD_PROJECT` | Agent / Storefront | GCP Project ID for Vertex AI & BigQuery | Required for live LLM |
| `GEMINI_API_KEY` | Agent / Storefront | Gemini 3.7 Flash API Key | Required for live LLM |
| `PORT` | Backend / Docker | HTTP listen port for Cloud Run / FastAPI | `8080` (or `8000`) |
| `USE_IN_MEMORY_SESSION` | Long Horizon Agent | Enables hermetic session state in local testing | `true` (dev default) |
| `USE_IN_MEMORY_TASK_STORE` | Long Horizon Agent | Enables hermetic A2A task state in local testing | `true` (dev default) |
| `UCP_WEBHOOK_SECRET` | Storefront | HMAC-SHA256 secret for incoming UCP webhooks | `cymbal_demo_ucp_secret_2026` |
| `INTERNAL_EVENT_API_KEY` | Storefront | Header auth key for telemetry event bus | `cymbal_internal_event_key_2026` |
| `GCHAT_VERIFICATION_TOKEN` | Storefront | Token verification for Google Chat webhooks | `cymbal_gchat_token_2026` |

### 1.2 Clean-Slate Dependency Installation
```bash
# Install Node.js monorepo workspace dependencies
pnpm install

# Approve native builds for pnpm (esbuild, sharp, re2)
pnpm approve-builds --all

# Sync isolated Python virtual environment via uv
cd services/long-horizon-agent && uv sync --frozen && cd ../..
```

---

## 🧪 2. Complete Test Suite Matrix

Run the automated test suites across all packages and services:

```bash
# 1. Deterministic Policy & AP2 Cryptographic Signature Tests
pnpm --filter @cymbal/deterministic-policy test

# 2. Commerce Protocol & A2A Message Envelope Tests
pnpm --filter @cymbal/commerce-protocol test

# 3. Storefront Next.js App & XSS Sanitization Tests
pnpm --filter @cymbal/storefront test

# 4. Long Horizon Agent Guardrails & Exfil Guard (Python)
cd services/long-horizon-agent && uv run pytest tests/unit/test_exfil_guard.py tests/unit/test_guardrails.py

# 5. Long Horizon Agent Identity & Policies Guard (Python)
cd services/long-horizon-agent && uv run pytest tests/unit/test_policies_guard.py tests/unit/test_identity.py tests/unit/test_permission_guard_wired.py
```

### Verified Test Results Summary:
- **`@cymbal/deterministic-policy`**: 11 / 11 tests passing (including AP2 asymmetric RSA/ECDSA digital signatures, checkout hashes, recovery policies, and intent matching).
- **`@cymbal/commerce-protocol`**: 3 / 3 tests passing (A2A message envelopes, payload validation).
- **`@cymbal/storefront`**: 3 / 3 tests passing (Google Chat interactive card lifecycle, HTML escaping anti-XSS).
- **`services/long-horizon-agent`**: 191 / 191 unit tests passing (Multi-tier guardrails, identity middleware, policies guard, permission verification).

---

## 🚀 3. Automated Local Smoke Test Harness

We provide a zero-dependency programmatic smoke test harness in [`scripts/smoke_test.py`](../scripts/smoke_test.py) and a PowerShell runner in [`scripts/smoke_test.ps1`](../scripts/smoke_test.ps1).

### 3.1 What the Smoke Test Harness Validates:
1. **Server Process Lifecycle:** Starts the server in a clean background subprocess with test environment variables on an isolated test port (`PORT=8080` or custom).
2. **Readiness Polling:** Polls `http://127.0.0.1:{PORT}/healthz` with exponential backoff until the server is fully ready.
3. **Health & Readiness Probes:**
   - `GET /healthz` -> Asserts `200 OK` with JSON `{ "status": "ok" }`.
   - `GET /ready` -> Asserts `200 OK`.
4. **Core Endpoint Contracts:**
   - `GET /lha/state?context_id=...` -> Asserts valid response structure.
   - `POST /a2a` -> Asserts JSON-RPC message handling.
   - `POST /api/events` & `POST /api/ucp/webhook` -> Asserts domain event ingestion.
5. **Graceful Error Handling (Negative Testing):**
   - Sends malformed JSON and missing parameters -> Asserts graceful `400 Bad Request` or `422 Unprocessable Entity` responses with zero unhandled 500 crashes.
6. **Graceful Termination:**
   - Sends termination signal (`SIGTERM` / process tree terminate), waits for clean connection drain, and asserts exit code `0`.

### 3.2 Running the Smoke Test Harness:

```bash
# Test the Python Long-Horizon-Agent backend:
python scripts/smoke_test.py --target agent --port 8080

# Windows PowerShell 1-Click execution:
.\scripts\smoke_test.ps1 -Target agent -Port 8080

# Test against a pre-running container or deployed service URL:
python scripts/smoke_test.py --target container --url http://127.0.0.1:8080

# Test live Google Cloud Run deployments:
python scripts/smoke_test.py --target remote-storefront --url https://cymbal-storefront-r6vqjlotga-uc.a.run.app
python scripts/smoke_test.py --target remote-agent --url https://long-horizon-agent-r6vqjlotga-uc.a.run.app
```

---

## 🐳 4. Local Docker Container Verification (Cloud Run Parity)

Before deploying to GCP Cloud Run, verify the container locally using Docker:

### 4.1 Build the Production Container Image:
```bash
docker build -t cymbal-agent-cloudrun ./services/long-horizon-agent
```

### 4.2 Run Container Locally Simulating Cloud Run:
```bash
docker run --rm -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e USE_IN_MEMORY_SESSION=true \
  -e USE_IN_MEMORY_TASK_STORE=true \
  -e GEMINI_API_KEY="your_gemini_api_key" \
  --name cymbal-agent-container \
  cymbal-agent-cloudrun
```

### 4.3 Run Automated Smoke Tests Against the Container:
```bash
python scripts/smoke_test.py --target container --url http://127.0.0.1:8080
```

### 4.4 Verify Logs & Non-Root Execution:
```bash
# View container startup logs
docker logs cymbal-agent-container

# Verify that the process runs under unprivileged 'appuser' (non-root)
docker exec cymbal-agent-container whoami
# Expected output: appuser
```

### 4.5 Stop and Clean Up Test Container:
```bash
docker stop cymbal-agent-container
```

---

## ☁️ 5. Google Cloud Run Deployment Readiness Checklist
 
> For the complete step-by-step deployment guide, IAM policies, and Secret Manager configuration, see [**docs/CLOUD_RUN_DEPLOYMENT_GUIDE.md**](CLOUD_RUN_DEPLOYMENT_GUIDE.md).
 
| Category | Verification Item | Status | Hardening Reference |
| :--- | :--- | :--- | :--- |
| **Port Binding** | Application listens on dynamic `$PORT` environment variable | ✅ Verified | Configured in FastAPI & Dockerfile |
| **Health Checks** | Responds to `/healthz` and `/ready` with `200 OK` | ✅ Verified | Added in `horizon/fast_api_app.py` |
| **Container Security** | Runs as non-root unprivileged `appuser` | ✅ Verified | Added in `Dockerfile` (L19-L28) |
| **Public Auth Bypasses** | `/healthz`, `/ready`, and `/.well-known` bypass IAP auth | ✅ Verified | Added in `horizon/auth/identity.py` |
| **Graceful Shutdown** | Handles `SIGTERM` with clean socket & routine drain | ✅ Verified | Configured with Uvicorn graceful timeout |
| **Secret Management** | Credentials read from environment / Secret Manager | ✅ Verified | Covered in `docs/SECURITY_EVALUATION_AND_HARDENING.md` |
