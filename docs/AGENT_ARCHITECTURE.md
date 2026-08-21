# Agent Architecture: Long Horizon Harness & Gemini 3.7 Flash

This document details the agent runtime architecture, system prompt hierarchy, guardrail pipelines, and subagent structure used in the **Cymbal Agentic Suite**.

---

## 🤖 Agent Hierarchy

```text
                               ┌────────────────────────────────┐
                               │   Master Orchestrator Agent    │
                               │        (ADK 2.5 Engine)        │
                               └───────────────┬────────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               │                               │                               │
               ▼                               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐
│ Experience & Reputation Agt │ │   Checkout Recovery Agent   │ │  Inventory & AP2 Intent Agt │
│  (Review Nudges & Escalation)│ │(Stalled Cart & 5% Discount) │ │ (OOS Intent Match & AP2 Pay)│
└─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
```

---

## 🧠 3-Tier System Prompt Assembly

The agent prompt is constructed using Long Horizon's byte-stable 3-tier architecture to maximize prefix cache hit rates in Gemini:

1. **Tier 1: Static Instruction (Stable Prefix)**
   - Pure, constant instruction string containing the agent's core role, tool contracts, and behavioral boundaries.
   - Cached at the infrastructure layer by ADK / Vertex AI.

2. **Tier 2: Context Tier (Per-Session / Per-Store Context)**
   - Dynamically injected per session via `before_model_callback`.
   - Ingests store depot location profiles, regional manager directories from **Google Workspace OKF**, and active commercial promotions.

3. **Tier 3: Volatile Tail (Turn Reminders & Ephemeral State)**
   - Injected in trailing `<system-reminder>` blocks.
   - Contains turn counter, step limits, current timestamp, and active mandate execution deadlines.

---

## 🛡️ Tool Guardrail Chain (Deterministic Policy vs LLM Judgement)

All tool invocations pass through an ordered `before_tool` callback chain:

```text
Model Tool Call
      │
      ▼
[1. Policy Guard] ────► Enforces 5% discount default, 10% ceiling, £35 cap, 30-day frequency.
      │
      ▼
[2. Exfil Guard] ─────► Prevents leaking PII or internal credentials across external A2A messages.
      │
      ▼
[3. Mandate Guard] ───► Deterministically verifies AP2 checkout_hash before submitting payment.
      │
      ▼
Execution / External Dispatch
```

---

## 📦 Specialized Sub-Agents

### 1. `ExperienceReputationAgent`
- **Model**: `gemini-3.7-flash` (via `google-genai` SDK)
- **Role**: Synthesizes customer survey submissions (`customer.survey.submitted`) with quantitative Places Insights and qualitative Maps Grounding.
- **Rules**:
  - Un-gated policy: Always sends a direct, neutral Google review opportunity to all customers.
  - On detractor score ($\le 6/10$): Generates an incident dossier and posts an interactive card to **Google Chat**.

### 2. `CheckoutRecoveryAgent`
- **Model**: `gemini-3.7-flash`
- **Role**: Evaluates stalled cart events (`commerce.checkout.stalled`) against `RecoveryOfferPolicy`.
- **Rules**:
  - Emits A2A application message `commerce.recovery.offer`.
  - Sets strict 2-hour TTL on the revised UCP checkout object.

### 3. `InventoryIntentAgent`
- **Model**: `gemini-3.7-flash`
- **Role**: Ingests `inventory.replenished` events and matches pending `PurchaseIntent` records.
- **Rules**:
  - Validates SKU, store ID, target quantity, and price cap $\le \text{maxPriceCapGbp}$.
  - Prepares the merchant-signed checkout JWT and validates the buyer agent's `ClosedCheckoutMandate` (`checkout_hash`) before settlement.
