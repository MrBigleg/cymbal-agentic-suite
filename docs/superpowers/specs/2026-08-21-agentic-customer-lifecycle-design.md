# Design Spec: Agentic Customer Lifecycle & Revenue Recovery Suite

**Document Status:** Approved Design / Architectural Specification  
**Version:** 1.0.0  
**Date:** 2026-08-21  
**Target System:** Google ADK 2.5 Long Horizon Harness + Cymbal Tyres + AP2 v0.2 / A2A / UCP  
**Workspace:** `c:\Users\craig\01_Projects\001_Kaggle\ATA-hackathon`

---

## 1. Executive Summary & Architectural Boundaries

The **Agentic Customer Lifecycle & Revenue Recovery Suite** transforms post-purchase reputation management, cart abandonment, and out-of-stock recovery into autonomous, protocol-driven loops for multi-location enterprise brands.

The system enforces strict layer boundaries:

| System Layer | Technology / Surface | Core Role & Responsibility |
| :--- | :--- | :--- |
| **Agent Reasoning** | Google ADK 2.5 + Gemini (Long Horizon) | Long-horizon workflow planning, qualitative interpretation, and escalation synthesis. |
| **Context & Evidence** | Google Workspace OKF, Places Insights, Maps Grounding, BigQuery | Enterprise knowledge, quantitative local market data, qualitative review context, and corporate analytics. |
| **Business Truth** | Cloud SQL (PostgreSQL) | Canonical database records (locations, catalog, orders, survey responses, purchase intents). |
| **Event Bus** | Cloud Pub/Sub & Webhook Ingest | Real-time event notifications (`customer.survey.submitted`, `commerce.checkout.stalled`, `inventory.replenished`). |
| **Commerce State** | Universal Commerce Protocol (UCP) | Session management, item definitions, pricing calculation, and checkout revisions. |
| **Commercial Rules** | Deterministic Commerce Policy Engine | Code-enforced margin bounds, discount ceilings, frequency limiters, and stock matchers. |
| **Agent Communication** | Agent-to-Agent (A2A) Protocol | Structured JSON-RPC 2.0 message envelopes exchanging application-level commerce tasks. |
| **Authority & Evidence** | Autonomous Payment Protocol (AP2 v0.2) | Cryptographically verifiable Open/Closed Checkout Mandates and Payment Mandates. |
| **Operational UI** | Google Chat App (with In-place Card Updates) | Immediate human-in-the-loop action surface for store managers. |
| **Investigation UI** | Cymbal Manager Portal (Next.js 15) | Deep-dive incident analysis, location trends, and immutable audit trails. |
| **Developer Console** | Long Horizon Vite UI | Developer and eval environment for inspecting session graphs and memory states. |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 EVIDENCE                                    │
│  Places Insights ───── quantitative local market benchmarks                 │
│  Places / Maps ─────── qualitative public context (via Maps Grounding)      │
│  BigQuery ──────────── corporate analytics & regional NPS anomaly metrics   │
│  Workspace OKF ─────── enterprise knowledge (SOPs, brand rules, directories)│
│  Memory Bank ───────── agent experience & cross-session recall               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LONG HORIZON AGENT HARNESS (ADK 2.5)                     │
│               Reasoning · 3-Tier System Prompt · Guardrail Chain            │
└──────────────┬───────────────────────┬───────────────────────┬──────────────┘
               │                       │                       │
               ▼                       ▼                       ▼
┌────────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐
│  DETERMINISTIC POLICY  │  │    GOOGLE CHAT     │  │   A2A / AP2 PROTOCOL   │
│ • RecoveryOfferPolicy  │  │ Immediate Manager  │  │ • A2A App Messages     │
│ • PurchaseIntentMatch  │  │ Actionable Cards   │  │ • Signed Checkout JWT  │
│ • AP2 Role Verifier    │  │ (In-place updates) │  │ • Closed Mandate Check │
└──────────────┬─────────┘  └──────────┬─────────┘  └──────────┬─────────────┘
               │                       │                       │
               ▼                       ▼                       ▼
┌────────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐
│   UCP COMMERCE STATE   │  │   CYMBAL PORTAL    │  │   CONSUMER SHOPPING    │
│  Checkout Revisions    │  │ Deep Investigation │  │         AGENT          │
└────────────────────────┘  └────────────────────┘  └────────────────────────┘
```

---

## 2. Knowledge & Evidence Architecture

Data sources are strictly segregated by ownership and lifecycle:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1. Agent Platform Memory Bank (What the Agent Remembers)                     │
│    • Cross-session user interaction history and negotiation context.         │
│    • Prefetched via PreloadMemoryTool; flushed post-turn via auto-capture.   │
├──────────────────────────────────────────────────────────────────────────────┤
│ 2. Google Workspace OKF (What the Organisation Knows)                        │
│    • Brand guidelines, store location profiles, manager escalation trees.    │
│    • Structured Markdown/JSON in enterprise Drive/Workspace repository.      │
├──────────────────────────────────────────────────────────────────────────────┤
│ 3. External Analytics & Local Market Evidence Stack                          │
│    • BigQuery: Corporate sales data, historical NPS, regional anomaly alerts.│
│    • Places Insights: Quantitative place data (ratings, review counts, geo). │
│    • Places / Maps Grounding: Qualitative review summaries and context.      │
└──────────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Feedback Request Neutrality**: Market and competitor intelligence gathered from BigQuery and Places Insights is strictly used for internal business actions and manager escalations. Customer-facing communications always present a neutral, unmanipulated request for honest feedback.

---

## 3. Detailed Module Workflows

### Module 1: Post-Purchase Engagement & Closed-Loop Escalation

#### Workflow Sequence
1. **Trigger**: An order completes or a customer submits feedback (`customer.survey.submitted`).
2. **Review Opportunity**: All eligible customers receive an un-gated, neutral opportunity to leave public feedback via a direct Google Business Profile link.
3. **Internal Triage**:
   - If survey rating $\ge 7/10$: The event is logged to the customer profile in Cloud SQL and the store quality ledger.
   - If survey rating $\le 6/10$ (Detractor) or a regional anomaly is flagged in BigQuery:
     - Long Horizon generates an internal incident dossier, drawing context from Workspace OKF (manager directory, escalation SOP) and Places Grounding (local customer sentiment).
     - Long Horizon posts an interactive card to the store manager's **Google Chat** space using Google Chat App Authentication.
4. **Google Chat In-Place Card Lifecycle**:
   - The card renders with action buttons: `[⚡ Open Investigation]`, `[👤 Assign]`, `[✕ Dismiss]`.
   - Upon manager click, the Chat App updates the message in-place to display active assignment status and a `[🔍 View Full Investigation in Cymbal Portal]` deep link.

---

### Module 2: Agent-Era Abandoned Cart Recovery

#### Workflow Sequence
1. **Session Stalling Detection**: A UCP checkout session (`dev.ucp.shopping.checkout`) stalls without payment for 15 minutes, triggering `commerce.checkout.stalled`.
2. **Deterministic Policy Check (`RecoveryOfferPolicy`)**:
   - Check customer 30-day frequency ceiling ($1\text{ offer} / 30\text{ days}$).
   - Calculate offer: Default **5% discount**, subject to an absolute **10% ceiling** and **£35 maximum value**.
3. **Commerce State Update**:
   - Merchant creates a revised UCP Checkout containing the recovery incentive.
   - Offer expires automatically after **2 hours**.
4. **A2A Negotiation**:
   - Merchant Agent dispatches an application-level A2A message `commerce.recovery.offer` to the buyer's Shopping Agent over the standard A2A task envelope.
5. **Consumer Presentation & AP2 Authorization**:
   - Shopping Agent renders an A2UI prompt to the customer.
   - Upon acceptance, the transaction moves into the standard AP2 checkout and payment mandate authorization flow.

---

### Module 3: Agent-Era Out-of-Stock (OOS) Inventory Recovery

#### Protocol Roles (AP2 v0.2 Conformance)
- **Merchant Side**: Owns catalog availability, validates purchasing constraints, produces final UCP Checkouts, and supplies the merchant-signed `Checkout JWT`.
- **Buyer / Shopping Agent Side**: Holds the user's pre-authorized `Open Checkout Mandate` and `Payment Mandate` constraints. Constructs and presents the `Closed Checkout Mandate` (bound to `checkout_hash`) and `Closed Payment Mandate`.

```
Customer / Shopping Agent
  "I authorise purchase of 4 tyres from an allowed merchant under £500 within 14 days."
          │
          ▼
  Cymbal Cloud SQL (Application Layer)
  PurchaseIntent record stored (SKU, Depot, Target Price, Expiry)
          +
  AP2 Authorisation Context (Buyer Side)
  Open Checkout Mandate & Open Payment Mandate held
          │
          ▼
  Depot Stock Replenished (inventory.replenished event)
          │
          ▼
  Deterministic PurchaseIntentMatcher
  Validates: SKU ✓  Store ✓  Quantity ✓  Price Cap ✓  Expiry ✓
          │
          ▼
  A2A Application Message: inventory.intent.ready
          │
          ▼
  Shopping Agent requests final checkout
          │
          ▼
  Merchant UCP Engine
  Creates final Checkout object + merchant-signed Checkout JWT
          │
          ▼
  Shopping Agent
  Constructs Closed Checkout Mandate (bound to checkout_hash)
  Constructs Closed Payment Mandate
          │
          ▼
  Deterministic AP2Verifier (Merchant Code)
  Validates: Signatures, checkout_hash, Open→Closed constraint bounds, Expiry
          │
          ▼
  Settlement & Order Fulfillment
```

---

## 4. Deterministic Engines vs. Safety Layers

### 1. Deterministic Commerce Policy Engine (Code-Enforced)

```typescript
// 1. Recovery Offer Rules
export interface RecoveryOfferPolicy {
  defaultDiscountPercent: 5;
  maxDiscountCeilingPercent: 10;
  maxValueCapGbp: 35;
  cooldownDaysPerCustomer: 30;
  offerTtlHours: 2;
}

// 2. OOS Intent Matcher
export interface PurchaseIntentMatcher {
  matchProduct(intentSku: string, replenishmentSku: string): boolean;
  matchStore(intentStoreId: string, replenishmentStoreId: string): boolean;
  verifyQuantity(requestedQty: number, availableQty: number): boolean;
  verifyPriceCap(currentPrice: number, maxPriceCap: number): boolean;
  verifyExpiry(expiresAt: Date, now: Date): boolean;
}

// 3. AP2 Role Verifier
export interface AP2Verifier {
  verifyMerchantJwtSignature(jwt: string): boolean;
  verifyCheckoutHash(checkoutObject: UcpCheckout, checkoutHash: string): boolean;
  verifyMandateConstraints(openMandate: OpenCheckoutMandate, closedMandate: ClosedCheckoutMandate): boolean;
  verifyPaymentMandateSignature(paymentMandate: PaymentMandate): boolean;
  verifyNoReplay(mandateId: string): boolean;
}
```

### 2. Communication Safety & Output Governance
- **Neutral Feedback Policy**: Strict template validation ensuring review invitations contain no inducements, leading sentiment, or gating conditions.
- **Model Armor / NeMo Guardrails**: Post-generation filtering for prompt injection defense, PII masking, and brand voice adherence.

---

## 5. User Interface & Presentation Surfaces

| Surface | Target Persona | Primary Interaction |
| :--- | :--- | :--- |
| **Google Chat** | Store Manager | Receives actionable cards for survey detractors; performs 1-click in-place resolution (`Approve`, `Assign`, `Dismiss`). |
| **Cymbal Manager Portal** | Store & Regional Manager | Multi-location dashboard, NPS trendlines, BigQuery anomaly visualizations, deep-dive incident dossiers. |
| **Cymbal Storefront** | Consumer | Automotive e-commerce catalog, tyre search by vehicle registration/size, cart checkout, back-in-stock intent enrollment. |
| **A2UI Consumer Surface** | Consumer (via Agent) | Interactive notification cards rendered by the consumer's buyer agent for cart recovery incentives and back-in-stock confirmations. |
| **Long Horizon Developer Console** | Developer / Judge | Vite-based session inspector, real-time agent trajectory viewer, prompt cache monitor, and tool call auditor. |

---

## 6. Implementation Sequence & Milestones

1. **Milestone 1: Deterministic Policy & Protocol Contracts**
   - Implement `RecoveryOfferPolicy`, `PurchaseIntentMatcher`, and `AP2Verifier` modules.
   - Define TypeScript & Python Pydantic schemas for A2A application messages (`commerce.recovery.offer`, `inventory.intent.ready`).
2. **Milestone 2: Long Horizon Agent Harness Sub-Agents**
   - Configure ADK 2.5 `ExperienceReputationAgent`, `CheckoutRecoveryAgent`, and `InventoryIntentAgent`.
   - Wire 3-Tier System Prompt and `PreloadMemoryTool` adapters.
3. **Milestone 3: Google Chat App Integration**
   - Implement Google Chat webhook/app endpoint with in-place card update capabilities.
   - Wire detractor survey triggers and manager deep links to Cymbal Manager Portal.
4. **Milestone 4: Cymbal-Tyres Storefront & Manager Portal Enhancement**
   - Build out incident investigation pages, NPS trend displays, and A2UI card renderer.
   - Implement interactive Demo Event Simulator for live hackathon presentation.
5. **Milestone 5: Verification & Evals**
   - Execute deterministic unit tests for AP2 verification and discount policy caps.
   - Run Long Horizon eval suite (`agents-cli eval run`) validating agent decision paths.
