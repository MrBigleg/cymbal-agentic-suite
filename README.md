# 🏎️ Cymbal Agentic Customer Lifecycle & Revenue Recovery Suite

> **Built for the Google & Kaggle Agentic AI Hackathon**  
> An autonomous, protocol-driven commerce and reputation suite powered by **Google ADK 2.5**, **Gemini 3.7 Flash**, **AP2 v0.2 (Autonomous Payment Protocol)**, **Agent-to-Agent (A2A)**, and **Universal Commerce Protocol (UCP)**.

---

## 🏛️ System Architecture

```text
                                        ┌──────────────────────────────────────┐
                                        │          EVIDENCE SOURCES            │
                                        │  Places Insights (Quantitative)      │
                                        │  Maps Grounding (Qualitative)        │
                                        │  BigQuery (Regional NPS Anomalies)   │
                                        │  Workspace OKF (Brand SOPs)          │
                                        │  Memory Bank (Agent Recall)          │
                                        └──────────────────┬───────────────────┘
                                                           │
                                                           ▼
                                        ┌──────────────────────────────────────┐
                                        │      LONG HORIZON AGENT (ADK 2.5)    │
                                        │     FastAPI + Gemini 3.7 Flash       │
                                        └──────┬───────────┬────────────┬──────┘
                                               │           │            │
                                               ▼           ▼            ▼
┌──────────────────────────────────────┐ ┌─────────────┐ ┌────────────────────┐ ┌────────────────────────┐
│        DETERMINISTIC ENGINES         │ │ GOOGLE CHAT │ │    A2A PROTOCOL    │ │   CYMBAL STOREFRONT    │
│  RecoveryOfferPolicy (5% cap, 2h TTL)│ │ Immediate   │ │  A2A JSON-RPC 2.0  │ │  Next.js 15 App Router │
│  PurchaseIntentMatcher (SKU/Price)   │ │ In-Place    │ │  commerce.recovery │ │  Vehicle Fitment Search│
│  AP2Verifier (checkout_hash / SD-JWT)│ │ Action Card │ │  inventory.intent  │ │  A2UI Card Renderer    │
└──────────────────────────────────────┘ └─────────────┘ └────────────────────┘ └────────────────────────┘
```

---

## 📁 Repository Structure

```text
cymbal-agentic-suite/
├── apps/
│   ├── storefront/             # Next.js 15: Customer Shop, Vehicle Fitment, Stalled Cart, A2UI Cards
│   └── manager-portal/         # Next.js 15: Manager Incident Dossier & BigQuery Anomaly Center
├── services/
│   └── long-horizon-agent/     # Python 3.11: Google ADK 2.5 + Gemini 3.7 Flash + FastAPI A2A Handler
├── packages/
│   ├── commerce-protocol/      # Shared AP2 v0.2 (checkout_hash), UCP, and A2A schemas
│   └── deterministic-policy/   # Pure deterministic logic (RecoveryOfferPolicy, PurchaseIntentMatcher, AP2Verifier)
├── docs/
│   ├── AGENT_ARCHITECTURE.md   # Long Horizon hierarchy, 3-tier system prompts, guardrails
│   ├── PROTOCOL_SPEC.md        # AP2 v0.2 checkout_hash, SD-JWT-VC, and A2A message contracts
│   ├── GOOGLE_CHAT_GUIDE.md    # In-place interactive card life-cycle & app authentication
│   └── superpowers/specs/      # Approved Architectural Specifications & Plans
└── docker-compose.yml          # 1-command reproducible spin-up for judges
```

---

## 🚀 Quickstart (60-Second Evaluation)

### 1. Launch via Docker Compose
```bash
# Set your Gemini API Key
export GEMINI_API_KEY="your-gemini-api-key"

# Build and start all services
docker compose up --build
```

### 2. Available Ports & Services
| Surface | Local URL | Description |
| :--- | :--- | :--- |
| **Storefront & Demo Simulator** | `http://localhost:3000/demo-controls` | Interactive event generator for all 3 agent loops |
| **Customer Store** | `http://localhost:3000` | Tyre e-commerce catalog and checkout flow |
| **Manager Incident Center** | `http://localhost:3000/manager/incidents/inc_001` | Escalation dossier with BigQuery & Places Insights evidence |
| **Long Horizon Agent API** | `http://localhost:8000/a2a` | Python ADK 2.5 Agent-to-Agent JSON-RPC endpoint |

---

## 🔄 The 3 Core Autonomous Loops

### 1. Post-Purchase Review Generation & Closed-Loop Escalation
- **Customer Facing**: Every customer receives an un-gated, neutral link to leave honest feedback on Google Business Profile.
- **Internal Action**: Detractor feedback ($\le 6/10$) triggers Long Horizon to generate an incident dossier combining BigQuery regional anomaly data and Places Insights competitive benchmarks.
- **Google Chat Operational Surface**: An interactive card is posted to the local store manager's Google Chat space, allowing 1-click in-place resolution (`[⚡ Open Investigation]`, `[👤 Assign]`, `[✕ Dismiss]`).

### 2. Agent-Era Abandoned Cart Recovery
- **Trigger**: Stalled UCP checkout session (15m inactivity).
- **Deterministic Policy**: `RecoveryOfferPolicy` calculates a bounded recovery offer (5% default discount, £35 max cap, 1/30 days frequency, 2-hour TTL).
- **A2A Negotiation**: Dispatches `commerce.recovery.offer` to the consumer buyer agent, which renders an A2UI prompt on the user's screen.

### 3. Agent-Era Out-of-Stock (OOS) Inventory Recovery
- **Trigger**: Stock arrives at a local depot (`inventory.replenished`).
- **Deterministic Matcher**: `PurchaseIntentMatcher` matches SKU, store ID, quantity, and price caps against pre-authorized `OpenCheckoutMandate` criteria.
- **AP2 v0.2 Cryptographic Settlement**: Merchant creates the final UCP Checkout and signs the checkout JWT. Buyer's shopping agent provides the `ClosedCheckoutMandate` bound to `checkout_hash` and `PaymentMandate` for instant, autonomous settlement.

---

## 🧪 Running Automated Tests

```bash
# Run deterministic commerce policy & AP2 verifier test suite
pnpm --filter @cymbal/deterministic-policy test

# Run A2A protocol schema tests
pnpm --filter @cymbal/commerce-protocol test

# Run Long Horizon agent sub-agent tests (Python)
cd services/long-horizon-agent && pytest
```

---

## 📜 Documentation Directory

- 📖 [**Agent Architecture Deep-Dive**](docs/AGENT_ARCHITECTURE.md)
- 🔒 [**AP2 v0.2 & A2A Protocol Specifications**](docs/PROTOCOL_SPEC.md)
- 💬 [**Google Chat In-Place Card Integration**](docs/GOOGLE_CHAT_GUIDE.md)
- 📋 [**Design Specification (Specs)**](docs/superpowers/specs/2026-08-21-agentic-customer-lifecycle-design.md)
- 📝 [**Implementation Plan**](docs/superpowers/plans/2026-08-21-agentic-customer-lifecycle.md)
