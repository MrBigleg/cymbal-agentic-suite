# 🏎️ Cymbal Agentic Suite

> **Agentic Customer Lifecycle & Revenue Recovery Suite**  
> Built for the Kaggle & Google Agentic AI Hackathon.

An enterprise agentic architecture powering post-purchase reputation management, autonomous cart recovery, and out-of-stock conditional buying over Google's open agentic stack: **Google ADK 2.5**, **Gemini 3.7 Flash**, **Autonomous Payment Protocol (AP2 v0.2)**, **Agent-to-Agent (A2A)**, and **Universal Commerce Protocol (UCP)**.

---

## 🏛️ System Architecture

```text
cymbal-agentic-suite/
├── apps/
│   ├── storefront/             # Next.js 15: Customer Shop, Vehicle Fitment, Stalled Checkout, A2UI Cards
│   └── manager-portal/         # Next.js 15: Manager Incident Dossier, BigQuery Regional Anomaly Graphs
├── services/
│   └── long-horizon-agent/     # Python 3.11: Google ADK 2.5 + Gemini 3.7 Flash + FastAPI A2A Handler
├── packages/
│   ├── commerce-protocol/      # Shared AP2 v0.2, UCP, and A2A schema definitions (JSON Schema / TS)
│   └── deterministic-policy/   # Pure deterministic logic (RecoveryOfferPolicy, PurchaseIntentMatcher, AP2Verifier)
├── docs/
│   ├── superpowers/specs/      # Full Architectural Specifications
│   └── superpowers/plans/      # Step-by-Step Implementation Plans
└── docker-compose.yml          # 1-command reproducible spin-up for judges
```

---

## 🚀 Quickstart (Judge 60-Second Evaluation)

### 1. Run with Docker Compose
```bash
# Set your Gemini API Key
export GEMINI_API_KEY="your-api-key"

# Launch all services
docker compose up --build
```
- **Customer Storefront**: `http://localhost:3000`
- **Manager Escalation Portal**: `http://localhost:3001`
- **Long Horizon Agent A2A Endpoint**: `http://localhost:8000/a2a`

---

## 📋 The 3 Core Agentic Loops

1. **Post-Purchase Review Generation & Closed-Loop Feedback**:
   - Dispatches un-gated, neutral Google review links to all eligible customers.
   - Detractor reviews ($\le 6/10$) trigger real-time, in-place actionable cards in **Google Chat** with instant escalation and deep links to the Cymbal Manager Portal.
2. **Agent-Era Abandoned Cart Recovery**:
   - Detects stalled UCP sessions and dispatches an A2A `commerce.recovery.offer` to the buyer agent.
   - Bound by deterministic policy (5% default, 10% cap, £35 max, 2-hour TTL).
3. **Agent-Era Out-of-Stock (OOS) Inventory Recovery**:
   - Evaluates pre-authorized `OpenCheckoutMandate` criteria upon stock replenishment.
   - Merchant signs the checkout JWT; buyer's shopping agent provides `ClosedCheckoutMandate` bound to `checkout_hash` for instant settlement.
