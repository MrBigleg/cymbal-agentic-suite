# Cymbal Agentic Suite: Security Evaluation, Vulnerability Assessment & Hardening Architecture

> **Submission Scope:** Autonomous Agentic Customer Lifecycle & Revenue Recovery Suite  
> **Core Frameworks:** Google ADK 2.5, Gemini 3.7 Flash, AP2 v0.2 Protocol, Next.js 15, FastAPI, Cloud Run, Cloud SQL, Vertex AI, A2A & UCP.  
> **Author / Project:** Cymbal Agentic Suite  
> **Evaluation Date:** 2026-08-22  

---

## 1. Executive Summary & Security Philosophy

The **Cymbal Agentic Suite** implements an autonomous, multi-agent commerce and customer recovery architecture. In agentic systems where autonomous models can invoke tools, orchestrate workflows, and handle commercial transactions, security cannot be an afterthought or limited to traditional perimeter defenses.

Our security philosophy follows **Defense-in-Depth** and **Strict Isolation**:
1. **Agentic Boundary Isolation:** Untrusted customer inputs must never control tool execution parameters without deterministic policy verification.
2. **Cryptographic Non-Repudiation:** Commercial and payment mandates (AP2 v0.2) must be cryptographically signed and verified using asymmetric key pairs (RSA/ECDSA) rather than relying on unauthenticated string assertions.
3. **Least Privilege & Secret Isolation:** Zero hardcoded credentials in the codebase; mandatory use of Google Cloud Secret Manager at runtime; strict IAM role scoping.
4. **Input Sanitization & Injection Defense:** Structural XML delimiter containment to prevent LLM direct/indirect prompt injection; HTML escaping on all outgoing notifications (Google Chat cards).
5. **Secure Supply Chain & Containers:** Dependency locking, reproducible builds, and non-root container execution.

---

## 2. Threat Model & Attack Surface Analysis

```
  +----------------------------------------------------------------------------------------------------+
  |                                        EXTERNAL ATTACK VECTORS                                     |
  |  - Malicious User Prompts (Prompt Injection / Jailbreaks)                                          |
  |  - Forged Inbound Webhooks (UCP / Google Chat Webhook Spoofing)                                    |
  |  - Tampered Payment Mandates (AP2 Mandate Hash / Signature Forgery)                                |
  |  - Supply Chain & Dependency CVEs                                                                  |
  +----------------------------------------------------------------------------------------------------+
                                                    |
                                                    v
  +----------------------------------------------------------------------------------------------------+
  |                                  FRONTEND / EDGE LAYER (Next.js 15)                                |
  |  [Security Headers: HSTS, CSP, nosniff, SAMEORIGIN]                                                |
  |                                                                                                    |
  |  - /api/assistant/consult  --> Input Sanitizer & Length Cap -> <untrusted_user_input> Wrapping     |
  |  - /api/ucp/webhook        --> HMAC-SHA256 Timing-Safe Signature Verification                      |
  |  - /api/gchat/webhook      --> Bearer Token & Action Context Validation                            |
  |  - lib/gchat/cardBuilder   --> HTML Entity Escaping (Anti-XSS / Formatting Injection)              |
  +----------------------------------------------------------------------------------------------------+
                                                    |
                                                    v
  +----------------------------------------------------------------------------------------------------+
  |                           DETERMINISTIC VERIFICATION & PROTOCOL LAYER                              |
  |  - @cymbal/deterministic-policy: Business Bounds Verifier (Cooldown, Discount Cap, TTL)           |
  |  - @cymbal/commerce-protocol: AP2 v0.2 Mandate Verification (SHA-256 Hash + RSA/ECDSA Signature)  |
  +----------------------------------------------------------------------------------------------------+
                                                    |
                                                    v
  +----------------------------------------------------------------------------------------------------+
  |                            AGENTIC BACKEND (FastAPI / ADK 2.5 / Vertex AI)                         |
  |  - IdentityMiddleware (IAP / OAuth Bearer / Dev Auth Isolation)                                    |
  |  - Guardrails Chain: exfil_guard -> policies_guard -> permission_guard                             |
  |  - Google Cloud Secret Manager for all credentials & per-user secrets                              |
  |  - Non-Root Container Execution (appuser)                                                          |
  +----------------------------------------------------------------------------------------------------+
```

---

## 3. Vulnerability Findings & Remediation Matrix

### 3.1 Secrets & Credential Management

| ID | Issue | Severity | Status | Mitigation Description |
|---|---|---|---|---|
| **SEC-01** | Missing Credential Exclusions in `.gitignore` | **MEDIUM** | **FIXED** | Expanded root `.gitignore` to comprehensively exclude `*service_account*.json`, `*credentials*.json`, `client_secret*.json`, `*.pem`, `*.p12`, `*.tfvars`, and all `.env*` variants. |
| **SEC-02** | Plaintext Environment Variable Transmission | **BEST PRACTICE** | **HARDENED** | Standardized runtime secrets on Google Cloud Secret Manager (`cloud_run.tf` and `secrets.tf`). In local dev, variables are parsed strictly from gitignored `.env`. |

---

### 3.2 Protocol & Cryptographic Integrity

| ID | Issue | Severity | Status | Mitigation Description |
|---|---|---|---|---|
| **SEC-03** | Dummy Boolean Signature Checks in Mandate Verifiers | **HIGH** | **FIXED** | In `packages/deterministic-policy/src/verifier.ts`, implemented `verifyCryptographicSignature()` using Node.js `crypto.createVerify("SHA256")`. Mandates require cryptographic verification against authorized public keys. |
| **SEC-04** | Deterministic Bounds Bypass on Tool Execution | **HIGH** | **FIXED** | In `apps/storefront/agent/tools_definition.ts`, connected `CymbalAgentToolDispatcher` directly to `evaluateRecoveryOffer` so discount caps, customer cooldowns, and quantity bounds are enforced before state updates. |

---

### 3.3 Application Security & Input Validation (OWASP Top 10)

| ID | Issue | Severity | Status | Mitigation Description |
|---|---|---|---|---|
| **SEC-05** | Unauthenticated Inbound UCP Webhooks | **HIGH** | **FIXED** | Implemented HMAC-SHA256 signature verification (`x-ucp-signature`) with `crypto.timingSafeEqual()` in `apps/storefront/app/api/ucp/webhook/route.ts`. |
| **SEC-06** | Direct LLM Prompt Injection via User Query | **HIGH** | **FIXED** | Wrapped user parameters in `<untrusted_user_input>` structural tags in `apps/storefront/app/api/assistant/consult/route.ts` and added explicit system prompt steering to prevent instruction overrides. |
| **SEC-07** | HTML Formatting Injection in Google Chat Cards | **MEDIUM** | **FIXED** | Added `escapeHtml()` in `apps/storefront/lib/gchat/cardBuilder.ts` to sanitize customer survey text before embedding into Google Chat cards. |
| **SEC-08** | Unauthenticated Telemetry Event Bus Ingestion | **MEDIUM** | **FIXED** | Added authorization header verification to `apps/storefront/app/api/events/route.ts` to prevent rogue event injection. |

---

### 3.4 Infrastructure, Cloud & Container Security

| ID | Issue | Severity | Status | Mitigation Description |
|---|---|---|---|---|
| **SEC-09** | Missing HTTP Security Headers in Next.js Storefront | **LOW** | **FIXED** | Configured `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy` in `apps/storefront/next.config.ts`. |
| **SEC-10** | Backend Container Runs as Root | **BEST PRACTICE** | **FIXED** | Updated `services/long-horizon-agent/Dockerfile` to create an unprivileged user (`appuser`) and declare `USER appuser`. |
| **SEC-11** | Cloud Run Self-Token-Creator IAM Role | **MEDIUM** | **DOCUMENTED / ARCHITECTED** | Documented least-privilege separation between Cloud Run runtime SA and sandbox caller SA in `terraform/iam.tf`. |
| **SEC-12** | Cloud SQL Public IPv4 Exposure | **MEDIUM** | **DOCUMENTED / ARCHITECTED** | Documented Private Service Connect / VPC Peering configuration for production database deployments. |

---

## 4. Competition & Evaluation Disclosures: What is Fixed vs. Adapted

To ensure full reproducibility for competition judges while demonstrating production-grade architecture, the following adaptations were explicitly designed:

| Component | Production Architecture | Hackathon / Evaluation Mode | Rationale |
|---|---|---|---|
| **Gemini API Key** | Google Cloud Secret Manager / Cloud Run IAM | Injected via `.env` or AI Studio Runtime Secrets | Enables judges to run the application locally or in sandbox without configuring multi-project Secret Manager IAM. |
| **AP2 Key Infrastructure** | Cloud KMS / Hardware Security Module (HSM) | Asymmetric PEM Keys & Dynamic Crypto Test Pairs | Demonstrates real SHA-256 digital signature verification without requiring external cloud KMS connectivity during offline tests. |
| **UCP Webhook Secret** | Secret Manager with Automatic Key Rotation | Environment Variable (`UCP_WEBHOOK_SECRET`) with Test Fallback | Allows automated test suites and mock webhooks to run seamlessly. |
| **Persistence Store** | Cloud SQL PostgreSQL with Private VPC Peering | In-Memory / SQLite Local Storage with asyncpg Fallback | Allows zero-friction local development while providing full Terraform scripts for production GCP deployment. |

---

## 5. Verification & Test Suite

The security controls implemented in this codebase are verified using automated unit and integration tests:

1. **Cryptographic Mandate Verification:**  
   `pnpm --filter @cymbal/deterministic-policy test`  
   *Validates SHA-256 hash matching, asymmetric digital signature verification, expiry enforcement, and tampering detection.*

2. **A2A Protocol & Message Envelope Security:**  
   `pnpm --filter @cymbal/commerce-protocol test`  
   *Validates JSON-RPC 2.0 message schemas, payload structure, and rejection of invalid envelopes.*

3. **Google Chat Cards & Sanitization:**  
   `pnpm --filter @cymbal/storefront test`  
   *Validates HTML escaping and card structure integrity.*

4. **Agent Guardrails & Exfiltration Defenses:**  
   `cd services/long-horizon-agent && uv run pytest tests/unit`  
   *Validates `exfil_guard`, `policies_guard`, `permission_guard`, and secret redaction callbacks.*
