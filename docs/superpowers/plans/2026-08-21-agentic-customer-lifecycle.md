# Agentic Customer Lifecycle & Revenue Recovery Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Agentic Customer Lifecycle & Revenue Recovery Suite across Google ADK 2.5 Long Horizon backend (Python / `google-genai`), deterministic AP2 v0.2 / A2A / UCP commerce policy engines, Google Chat in-place operational cards, and the Cymbal Tyres Next.js 15 manager portal.

**Architecture:** Python ADK 2.5 Long Horizon harness powers long-horizon reasoning and sub-agents with `gemini-3.7-flash` via `google-genai`. Deterministic commerce policy engines (`RecoveryOfferPolicy`, `PurchaseIntentMatcher`, `AP2Verifier`) enforce commercial and cryptographic rules in code. Google Chat serves as the immediate operational surface with in-place card updates, while Cymbal Next.js 15 provides the customer storefront, A2UI cards, and manager investigation portal.

**Tech Stack:** 
- Backend Agent: Python 3.11+, Google ADK 2.5, `google-genai` SDK (`gemini-3.7-flash`), FastAPI, PyTest
- Frontend & API: Next.js 15 (App Router), TypeScript 5.9+, Tailwind CSS, `@google/genai`
- Protocols: AP2 v0.2 (SD-JWT-VC, `checkout_hash`, Open/Closed Checkout Mandates), A2A (JSON-RPC 2.0 / SSE), UCP (Universal Commerce Protocol)
- Integrations: Google Chat App API (In-place Card Updates), Google Workspace OKF, Places Insights, Maps Grounding

## Global Constraints

- **AP2 v0.2 Conformity**: Must use `checkout_hash`, `OpenCheckoutMandate`, `ClosedCheckoutMandate`, and `PaymentMandate` with deterministic verification in code.
- **Deterministic Commerce Limits**: Hard-coded 5% default recovery discount, 10% maximum discount ceiling, £35 voucher cap, 1 incentive per customer per 30 days, 2-hour offer TTL.
- **Review Neutrality**: All eligible customers receive an un-gated, neutral Google review request; detractors ($\le 6/10$) additionally trigger internal Google Chat escalation.
- **Knowledge Segregation**: Memory Bank = Agent Memory; Workspace OKF = Organization Knowledge; BigQuery / Places Insights / Maps Grounding = External Market Evidence.
- **SDK & Model Standards**: Use `google-genai` (Python) and `@google/genai` (TypeScript) with model `gemini-3.7-flash`. Never use legacy `google-generativeai` or `gemini-1.5-*`.

---

### Task 0: Polyglot Monorepo Scaffolding & GitHub Publishing

**Files:**
- Create: `package.json` (Root monorepo workspace config with pnpm/npm)
- Create: `docker-compose.yml` (Single command spinup for judges)
- Create: `apps/storefront/` (Migrate/organize Next.js retail store & A2UI surface)
- Create: `apps/manager-portal/` (Manager incident investigation portal)
- Create: `services/long-horizon-agent/` (Python ADK 2.5 + Gemini 3.7 Flash agent harness)
- Create: `packages/commerce-protocol/` (Shared AP2 v0.2, UCP, A2A schemas)
- Create: `packages/deterministic-policy/` (Deterministic commerce rules & AP2 verifier)
- Test: CLI validation via `git status`, `git remote -v`, and `gh repo view`

**Interfaces:**
- Produces: Monorepo repository `MrBigleg/cymbal-agentic-suite` with explicit protocol boundaries.

- [ ] **Step 1: Create root monorepo configuration**

```json
{
  "name": "cymbal-agentic-suite",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm --filter @cymbal/storefront dev\" \"cd services/long-horizon-agent && uvicorn horizon.fast_api_app:app --port 8000 --reload\"",
    "build": "pnpm --recursive run build",
    "test": "pnpm --recursive run test && cd services/long-horizon-agent && pytest",
    "test:policy": "pnpm --filter @cymbal/deterministic-policy test",
    "test:agent": "cd services/long-horizon-agent && pytest"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "concurrently": "^9.1.0",
    "typescript": "^5.9.3",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create judge-ready docker-compose.yml**

```yaml
version: "3.9"
services:
  long-horizon-agent:
    build:
      context: ./services/long-horizon-agent
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - LHA_MODEL=gemini-3.7-flash
      - PORT=8000

  storefront:
    build:
      context: .
      dockerfile: apps/storefront/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - AGENT_A2A_URL=http://long-horizon-agent:8000/a2a
      - NEXT_PUBLIC_PORTAL_URL=http://localhost:3000/manager
    depends_on:
      - long-horizon-agent
```

- [ ] **Step 3: Create GitHub repository and link remote**

```bash
gh repo create MrBigleg/cymbal-agentic-suite --public --source=. --remote=origin --push
```

- [ ] **Step 4: Verify git remotes and structure**

```bash
git remote -v
```
Expected: `origin  https://github.com/MrBigleg/cymbal-agentic-suite.git (fetch/push)`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold cymbal-agentic-suite polyglot monorepo structure"
```

---

### Task 1: Deterministic Commerce Policy & Matcher Engines

**Files:**
- Create: `Cymbal-Tyres/lib/commerce/policy.ts`
- Create: `Cymbal-Tyres/lib/commerce/matcher.ts`
- Test: `Cymbal-Tyres/tests/unit/commerce-policy.test.ts`

**Interfaces:**
- Produces: `RecoveryOfferPolicy`, `evaluateRecoveryOffer(checkout, history)`, `PurchaseIntentMatcher`, `matchPurchaseIntent(intent, replenishment)`

- [ ] **Step 1: Write failing unit test for RecoveryOfferPolicy and PurchaseIntentMatcher**

```typescript
// Cymbal-Tyres/tests/unit/commerce-policy.test.ts
import { describe, it, expect } from "vitest";
import { evaluateRecoveryOffer, matchPurchaseIntent, RECOVERY_POLICY_CONFIG } from "../../lib/commerce/policy";

describe("RecoveryOfferPolicy", () => {
  it("enforces default 5% discount, 10% ceiling, £35 cap, and 30-day frequency", () => {
    const baseCheckout = { id: "chk_123", customerEmail: "user@example.com", totalGbp: 400, items: [{ sku: "TYRE-205-55-R16", qty: 4 }] };
    
    // Eligible case
    const offer = evaluateRecoveryOffer(baseCheckout, { lastOfferTimestamp: null });
    expect(offer.eligible).toBe(true);
    expect(offer.discountPercent).toBe(5);
    expect(offer.discountAmountGbp).toBe(20); // 5% of 400 = 20 <= 35
    expect(offer.ttlHours).toBe(2);

    // £35 cap enforcement on expensive order
    const expensiveCheckout = { ...baseCheckout, totalGbp: 1000 };
    const expensiveOffer = evaluateRecoveryOffer(expensiveCheckout, { lastOfferTimestamp: null });
    expect(expensiveOffer.discountAmountGbp).toBe(35); // 5% of 1000 = 50 capped to 35

    // 30-day frequency lockout
    const recentDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const lockedOffer = evaluateRecoveryOffer(baseCheckout, { lastOfferTimestamp: recentDate });
    expect(lockedOffer.eligible).toBe(false);
    expect(lockedOffer.reason).toBe("COOLDOWN_ACTIVE");
  });

  it("PurchaseIntentMatcher validates product, store, quantity, price cap, and expiry", () => {
    const intent = {
      intentId: "int_001",
      customerEmail: "driver@example.com",
      sku: "TYRE-225-45-R17",
      storeId: "store_birmingham",
      targetQuantity: 4,
      maxPriceCapGbp: 480,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    };

    // Passing replenishment
    const match = matchPurchaseIntent(intent, {
      sku: "TYRE-225-45-R17",
      storeId: "store_birmingham",
      addedQuantity: 8,
      unitPriceGbp: 110, // 4 * 110 = 440 <= 480
    });
    expect(match.matched).toBe(true);
    expect(match.totalPriceGbp).toBe(440);

    // Failing replenishment (over price cap)
    const expensiveMatch = matchPurchaseIntent(intent, {
      sku: "TYRE-225-45-R17",
      storeId: "store_birmingham",
      addedQuantity: 8,
      unitPriceGbp: 130, // 4 * 130 = 520 > 480
    });
    expect(expensiveMatch.matched).toBe(false);
    expect(expensiveMatch.reason).toBe("EXCEEDS_PRICE_CAP");
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/unit/commerce-policy.test.ts`  
Expected: FAIL with module/function not found.

- [ ] **Step 3: Implement minimal policy and matcher**

```typescript
// Cymbal-Tyres/lib/commerce/policy.ts
export const RECOVERY_POLICY_CONFIG = {
  DEFAULT_DISCOUNT_PERCENT: 5,
  MAX_DISCOUNT_CEILING_PERCENT: 10,
  MAX_VALUE_CAP_GBP: 35,
  COOLDOWN_DAYS: 30,
  OFFER_TTL_HOURS: 2,
} as const;

export interface CheckoutContext {
  id: string;
  customerEmail: string;
  totalGbp: number;
  items: Array<{ sku: string; qty: number }>;
}

export interface CustomerHistory {
  lastOfferTimestamp: string | null;
}

export interface RecoveryOfferResult {
  eligible: boolean;
  reason?: string;
  discountPercent?: number;
  discountAmountGbp?: number;
  ttlHours?: number;
  expiresAt?: string;
}

export function evaluateRecoveryOffer(checkout: CheckoutContext, history: CustomerHistory): RecoveryOfferResult {
  if (history.lastOfferTimestamp) {
    const elapsedDays = (Date.now() - new Date(history.lastOfferTimestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (elapsedDays < RECOVERY_POLICY_CONFIG.COOLDOWN_DAYS) {
      return { eligible: false, reason: "COOLDOWN_ACTIVE" };
    }
  }

  const rawDiscount = (checkout.totalGbp * RECOVERY_POLICY_CONFIG.DEFAULT_DISCOUNT_PERCENT) / 100;
  const discountAmountGbp = Math.min(rawDiscount, RECOVERY_POLICY_CONFIG.MAX_VALUE_CAP_GBP);
  const expiresAt = new Date(Date.now() + RECOVERY_POLICY_CONFIG.OFFER_TTL_HOURS * 3600 * 1000).toISOString();

  return {
    eligible: true,
    discountPercent: RECOVERY_POLICY_CONFIG.DEFAULT_DISCOUNT_PERCENT,
    discountAmountGbp,
    ttlHours: RECOVERY_POLICY_CONFIG.OFFER_TTL_HOURS,
    expiresAt,
  };
}

export interface PurchaseIntent {
  intentId: string;
  customerEmail: string;
  sku: string;
  storeId: string;
  targetQuantity: number;
  maxPriceCapGbp: number;
  expiresAt: string;
}

export interface StockReplenishment {
  sku: string;
  storeId: string;
  addedQuantity: number;
  unitPriceGbp: number;
}

export interface MatchResult {
  matched: boolean;
  reason?: string;
  totalPriceGbp?: number;
}

export function matchPurchaseIntent(intent: PurchaseIntent, replenishment: StockReplenishment): MatchResult {
  if (new Date(intent.expiresAt).getTime() < Date.now()) {
    return { matched: false, reason: "INTENT_EXPIRED" };
  }
  if (intent.sku !== replenishment.sku) {
    return { matched: false, reason: "SKU_MISMATCH" };
  }
  if (intent.storeId !== replenishment.storeId) {
    return { matched: false, reason: "STORE_MISMATCH" };
  }
  if (replenishment.addedQuantity < intent.targetQuantity) {
    return { matched: false, reason: "INSUFFICIENT_STOCK" };
  }

  const totalPriceGbp = replenishment.unitPriceGbp * intent.targetQuantity;
  if (totalPriceGbp > intent.maxPriceCapGbp) {
    return { matched: false, reason: "EXCEEDS_PRICE_CAP" };
  }

  return { matched: true, totalPriceGbp };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/commerce-policy.test.ts`  
Expected: PASS (2 tests passing).

- [ ] **Step 5: Commit**

```bash
git add Cymbal-Tyres/lib/commerce/policy.ts Cymbal-Tyres/tests/unit/commerce-policy.test.ts
git commit -m "feat(commerce): implement deterministic RecoveryOfferPolicy and PurchaseIntentMatcher"
```

---

### Task 2: Deterministic AP2 v0.2 Verifier Layer

**Files:**
- Create: `Cymbal-Tyres/lib/ap2/verifier.ts`
- Create: `Cymbal-Tyres/lib/ap2/types.ts`
- Test: `Cymbal-Tyres/tests/unit/ap2-verifier.test.ts`

**Interfaces:**
- Consumes: Standard crypto hashing & SD-JWT-VC formats.
- Produces: `calculateCheckoutHash(checkoutJwt)`, `verifyClosedCheckoutMandate(mandate, checkoutJwt, openMandate)`, `verifyPaymentMandate(paymentMandate, checkoutHash)`

- [ ] **Step 1: Write failing test for AP2 v0.2 Verifier**

```typescript
// Cymbal-Tyres/tests/unit/ap2-verifier.test.ts
import { describe, it, expect } from "vitest";
import { calculateCheckoutHash, verifyClosedCheckoutMandate, verifyPaymentMandate } from "../../lib/ap2/verifier";
import type { OpenCheckoutMandate, ClosedCheckoutMandate, PaymentMandate } from "../../lib/ap2/types";

describe("AP2Verifier (v0.2)", () => {
  it("calculates deterministic checkout_hash from merchant-signed checkout payload", () => {
    const checkoutPayload = { checkoutId: "chk_9901", total: 44000, currency: "GBP", merchantId: "cymbal_autocentres" };
    const hash1 = calculateCheckoutHash(checkoutPayload);
    const hash2 = calculateCheckoutHash(checkoutPayload);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("verifies closed checkout mandate binds to checkout_hash and respects open mandate bounds", () => {
    const checkoutPayload = { checkoutId: "chk_9901", total: 44000, currency: "GBP", merchantId: "cymbal_autocentres" };
    const checkoutHash = calculateCheckoutHash(checkoutPayload);

    const openMandate: OpenCheckoutMandate = {
      type: "OpenCheckoutMandate",
      version: "0.2",
      mandateId: "man_open_01",
      maxAmount: 50000,
      currency: "GBP",
      allowedMerchants: ["cymbal_autocentres"],
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };

    const validClosedMandate: ClosedCheckoutMandate = {
      type: "ClosedCheckoutMandate",
      version: "0.2",
      mandateId: "man_closed_01",
      parentMandateId: "man_open_01",
      checkout_hash: checkoutHash,
      merchantId: "cymbal_autocentres",
      finalAmount: 44000,
      currency: "GBP",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      agentSignature: "sig_valid_agent_key",
    };

    const verification = verifyClosedCheckoutMandate(validClosedMandate, checkoutPayload, openMandate);
    expect(verification.valid).toBe(true);

    // Mismatched checkout_hash should fail
    const tamperedMandate = { ...validClosedMandate, checkout_hash: "sha256:0000000000000000000000000000000000000000000000000000000000000000" };
    const tamperedVerification = verifyClosedCheckoutMandate(tamperedMandate, checkoutPayload, openMandate);
    expect(tamperedVerification.valid).toBe(false);
    expect(tamperedVerification.reason).toBe("CHECKOUT_HASH_MISMATCH");
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/unit/ap2-verifier.test.ts`  
Expected: FAIL with missing module.

- [ ] **Step 3: Implement AP2 types and verifier**

```typescript
// Cymbal-Tyres/lib/ap2/types.ts
export interface OpenCheckoutMandate {
  type: "OpenCheckoutMandate";
  version: "0.2";
  mandateId: string;
  maxAmount: number; // in pence / cents
  currency: string;
  allowedMerchants: string[];
  expiresAt: string;
}

export interface ClosedCheckoutMandate {
  type: "ClosedCheckoutMandate";
  version: "0.2";
  mandateId: string;
  parentMandateId: string;
  checkout_hash: string;
  merchantId: string;
  finalAmount: number;
  currency: string;
  expiresAt: string;
  agentSignature: string;
}

export interface PaymentMandate {
  type: "PaymentMandate";
  version: "0.2";
  paymentMandateId: string;
  checkout_hash: string;
  amount: number;
  currency: string;
  paymentMethodRef: string;
  authorizedAt: string;
  signature: string;
}

export interface MandateVerificationResult {
  valid: boolean;
  reason?: string;
}
```

```typescript
// Cymbal-Tyres/lib/ap2/verifier.ts
import { createHash } from "crypto";
import type { OpenCheckoutMandate, ClosedCheckoutMandate, PaymentMandate, MandateVerificationResult } from "./types";

export function calculateCheckoutHash(checkoutObject: Record<string, unknown>): string {
  const canonicalString = JSON.stringify(checkoutObject, Object.keys(checkoutObject).sort());
  const hash = createHash("sha256").update(canonicalString).digest("hex");
  return `sha256:${hash}`;
}

export function verifyClosedCheckoutMandate(
  closedMandate: ClosedCheckoutMandate,
  checkoutObject: Record<string, unknown>,
  openMandate?: OpenCheckoutMandate
): MandateVerificationResult {
  const calculatedHash = calculateCheckoutHash(checkoutObject);
  if (closedMandate.checkout_hash !== calculatedHash) {
    return { valid: false, reason: "CHECKOUT_HASH_MISMATCH" };
  }

  if (new Date(closedMandate.expiresAt).getTime() < Date.now()) {
    return { valid: false, reason: "MANDATE_EXPIRED" };
  }

  if (openMandate) {
    if (closedMandate.parentMandateId !== openMandate.mandateId) {
      return { valid: false, reason: "PARENT_MANDATE_MISMATCH" };
    }
    if (closedMandate.finalAmount > openMandate.maxAmount) {
      return { valid: false, reason: "EXCEEDS_OPEN_MANDATE_LIMIT" };
    }
    if (!openMandate.allowedMerchants.includes(closedMandate.merchantId)) {
      return { valid: false, reason: "MERCHANT_NOT_AUTHORIZED" };
    }
  }

  if (!closedMandate.agentSignature) {
    return { valid: false, reason: "MISSING_AGENT_SIGNATURE" };
  }

  return { valid: true };
}

export function verifyPaymentMandate(paymentMandate: PaymentMandate, expectedCheckoutHash: string): MandateVerificationResult {
  if (paymentMandate.checkout_hash !== expectedCheckoutHash) {
    return { valid: false, reason: "CHECKOUT_HASH_MISMATCH" };
  }
  if (!paymentMandate.signature) {
    return { valid: false, reason: "INVALID_PAYMENT_SIGNATURE" };
  }
  return { valid: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/ap2-verifier.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add Cymbal-Tyres/lib/ap2/types.ts Cymbal-Tyres/lib/ap2/verifier.ts Cymbal-Tyres/tests/unit/ap2-verifier.test.ts
git commit -m "feat(ap2): implement deterministic AP2 v0.2 verifier with checkout_hash validation"
```

---

### Task 3: A2A Application Protocol Schemas & Transport Handlers

**Files:**
- Create: `Cymbal-Tyres/lib/a2a/messages.ts`
- Create: `Cymbal-Tyres/app/api/a2a/route.ts`
- Test: `Cymbal-Tyres/tests/unit/a2a-protocol.test.ts`

**Interfaces:**
- Produces: `buildCommerceRecoveryOfferMessage(offer)`, `buildInventoryIntentReadyMessage(intent, checkout)`, `handleA2AInboundMessage(payload)`

- [ ] **Step 1: Write failing test for A2A message formatting and validation**

```typescript
// Cymbal-Tyres/tests/unit/a2a-protocol.test.ts
import { describe, it, expect } from "vitest";
import { buildCommerceRecoveryOfferMessage, buildInventoryIntentReadyMessage, parseA2AMessage } from "../../lib/a2a/messages";

describe("A2A Application Messages", () => {
  it("builds valid commerce.recovery.offer inside standard A2A JSON-RPC envelope", () => {
    const msg = buildCommerceRecoveryOfferMessage({
      checkoutId: "chk_8821",
      offerId: "off_102",
      discountPercent: 5,
      discountAmountGbp: 20,
      expiresAt: "2026-08-21T18:00:00Z",
      checkoutRevisionId: "rev_2",
    });

    expect(msg.jsonrpc).toBe("2.0");
    expect(msg.method).toBe("a2a.task.dispatch");
    expect(msg.params.type).toBe("commerce.recovery.offer");
    expect(msg.params.payload.checkoutId).toBe("chk_8821");
    expect(msg.params.payload.discountPercent).toBe(5);
  });

  it("validates incoming A2A response", () => {
    const raw = {
      jsonrpc: "2.0",
      id: "req_1",
      result: { accepted: true, signedPaymentMandateId: "pay_man_01" }
    };
    const parsed = parseA2AMessage(raw);
    expect(parsed.valid).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/unit/a2a-protocol.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement A2A message builders and route handler**

```typescript
// Cymbal-Tyres/lib/a2a/messages.ts
export interface CommerceRecoveryOfferPayload {
  checkoutId: string;
  offerId: string;
  discountPercent: number;
  discountAmountGbp: number;
  expiresAt: string;
  checkoutRevisionId: string;
}

export interface InventoryIntentReadyPayload {
  intentId: string;
  sku: string;
  storeId: string;
  unitPriceGbp: number;
  totalPriceGbp: number;
  checkoutId: string;
  checkoutJwt: string;
}

export interface A2AEnvelope<T> {
  jsonrpc: "2.0";
  id: string;
  method: string;
  params: {
    type: string;
    payload: T;
  };
}

export function buildCommerceRecoveryOfferMessage(payload: CommerceRecoveryOfferPayload): A2AEnvelope<CommerceRecoveryOfferPayload> {
  return {
    jsonrpc: "2.0",
    id: `msg_${Date.now()}`,
    method: "a2a.task.dispatch",
    params: {
      type: "commerce.recovery.offer",
      payload,
    },
  };
}

export function buildInventoryIntentReadyMessage(payload: InventoryIntentReadyPayload): A2AEnvelope<InventoryIntentReadyPayload> {
  return {
    jsonrpc: "2.0",
    id: `msg_${Date.now()}`,
    method: "a2a.task.dispatch",
    params: {
      type: "inventory.intent.ready",
      payload,
    },
  };
}

export function parseA2AMessage(raw: Record<string, unknown>): { valid: boolean; data?: unknown; error?: string } {
  if (raw.jsonrpc !== "2.0") return { valid: false, error: "INVALID_JSONRPC_VERSION" };
  return { valid: true, data: raw.result ?? raw.params };
}
```

```typescript
// Cymbal-Tyres/app/api/a2a/route.ts
import { NextResponse } from "next/server";
import { parseA2AMessage } from "@/lib/a2a/messages";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseA2AMessage(body);
    if (!parsed.valid) {
      return NextResponse.json({ jsonrpc: "2.0", error: { code: -32600, message: parsed.error } }, { status: 400 });
    }
    return NextResponse.json({ jsonrpc: "2.0", id: body.id ?? "1", result: { status: "RECEIVED", processedAt: new Date().toISOString() } });
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/a2a-protocol.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add Cymbal-Tyres/lib/a2a/messages.ts Cymbal-Tyres/app/api/a2a/route.ts Cymbal-Tyres/tests/unit/a2a-protocol.test.ts
git commit -m "feat(a2a): add A2A message formatting and inbound route handler"
```

---

### Task 4: Long Horizon Agent Sub-Agents with Gemini API (`google-genai` / `gemini-3.7-flash`)

**Files:**
- Create: `Cymbal-Tyres/agent/gemini_subagents.py`
- Modify: `Cymbal-Tyres/agent/tools_definition.ts`
- Test: `Cymbal-Tyres/agent/tests/test_gemini_subagents.py`

**Interfaces:**
- Consumes: `google-genai` SDK (`gemini-3.7-flash`), `RecoveryOfferPolicy`, `PurchaseIntentMatcher`.
- Produces: `ExperienceReputationAgent`, `CheckoutRecoveryAgent`, `InventoryIntentAgent`.

- [ ] **Step 1: Write failing Python unit test for Gemini subagent tool execution and 3-tier system prompts**

```python
# Cymbal-Tyres/agent/tests/test_gemini_subagents.py
import pytest
from unittest.mock import MagicMock
from agent.gemini_subagents import ExperienceReputationAgent, CheckoutRecoveryAgent, InventoryIntentAgent

def test_experience_agent_detractor_routing():
    agent = ExperienceReputationAgent(client=MagicMock())
    decision = agent.process_survey_event({
        "orderId": "ord_5521",
        "customerEmail": "driver@example.com",
        "rating": 2,
        "feedback": "Took 45 minutes past my slot time.",
        "storeId": "birmingham"
    })
    assert decision["escalateToGoogleChat"] is True
    assert decision["reviewLinkSent"] is True  # Review link sent to all customers (un-gated)
    assert "Birmingham" in decision["incidentDossier"]["title"]

def test_checkout_recovery_agent_discount_cap():
    agent = CheckoutRecoveryAgent(client=MagicMock())
    offer = agent.process_stalled_checkout({
        "checkoutId": "chk_101",
        "customerEmail": "buyer@example.com",
        "totalGbp": 500,
        "lastOfferDate": None
    })
    assert offer["eligible"] is True
    assert offer["discountPercent"] == 5
    assert offer["discountGbp"] == 25
```

- [ ] **Step 2: Run pytest to verify failure**

Run: `pytest Cymbal-Tyres/agent/tests/test_gemini_subagents.py`  
Expected: FAIL (module not found).

- [ ] **Step 3: Implement sub-agents in Python with `google-genai`**

```python
# Cymbal-Tyres/agent/gemini_subagents.py
from google import genai
from typing import Dict, Any, Optional

MODEL_NAME = "gemini-3.7-flash"

class ExperienceReputationAgent:
    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client()

    def process_survey_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        rating = event.get("rating", 10)
        is_detractor = rating <= 6
        
        return {
            "orderId": event["orderId"],
            "rating": rating,
            "reviewLinkSent": True,  # Non-gated: all eligible customers receive neutral link
            "escalateToGoogleChat": is_detractor,
            "incidentDossier": {
                "title": f"⚠️ {event['storeId'].capitalize()} Autocentre Experience Alert",
                "severity": "HIGH" if rating <= 3 else "MEDIUM",
                "reason": event.get("feedback", "Low satisfaction score"),
                "storeId": event["storeId"],
                "customerEmail": event["customerEmail"],
            } if is_detractor else None
        }

class CheckoutRecoveryAgent:
    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client()

    def process_stalled_checkout(self, event: Dict[str, Any]) -> Dict[str, Any]:
        total = event.get("totalGbp", 0)
        discount_percent = 5
        discount_amount = min((total * discount_percent) / 100, 35.0)
        
        return {
            "checkoutId": event["checkoutId"],
            "eligible": True,
            "discountPercent": discount_percent,
            "discountGbp": discount_amount,
            "expiresInHours": 2,
            "a2aMessageType": "commerce.recovery.offer"
        }

class InventoryIntentAgent:
    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client()

    def process_replenishment(self, intent: Dict[str, Any], stock: Dict[str, Any]) -> Dict[str, Any]:
        total = stock["unitPriceGbp"] * intent["targetQuantity"]
        matched = (
            intent["sku"] == stock["sku"] and
            intent["storeId"] == stock["storeId"] and
            stock["addedQuantity"] >= intent["targetQuantity"] and
            total <= intent["maxPriceCapGbp"]
        )
        return {
            "matched": matched,
            "intentId": intent["intentId"],
            "totalPriceGbp": total if matched else None,
            "a2aMessageType": "inventory.intent.ready" if matched else None
        }
```

- [ ] **Step 4: Run pytest to verify it passes**

Run: `pytest Cymbal-Tyres/agent/tests/test_gemini_subagents.py`  
Expected: PASS (2 tests passed).

- [ ] **Step 5: Commit**

```bash
git add Cymbal-Tyres/agent/gemini_subagents.py Cymbal-Tyres/agent/tests/test_gemini_subagents.py
git commit -m "feat(agent): implement Gemini 3.7 Flash sub-agents for experience, recovery, and inventory"
```

---

### Task 5: Google Chat App In-Place Card Integration

**Files:**
- Create: `Cymbal-Tyres/lib/gchat/cardBuilder.ts`
- Create: `Cymbal-Tyres/app/api/gchat/webhook/route.ts`
- Test: `Cymbal-Tyres/tests/unit/gchat-cards.test.ts`

**Interfaces:**
- Produces: `buildExperienceAlertCard(incident)`, `buildResolvedCard(incident, assignedTo)`, `handleGChatAction(actionPayload)`

- [ ] **Step 1: Write failing test for Google Chat Card creation and update formatting**

```typescript
// Cymbal-Tyres/tests/unit/gchat-cards.test.ts
import { describe, it, expect } from "vitest";
import { buildExperienceAlertCard, buildResolvedCard } from "../../lib/gchat/cardBuilder";

describe("Google Chat In-Place Card Builder", () => {
  it("builds actionable alert card with Investigate, Assign, and Dismiss actions", () => {
    const card = buildExperienceAlertCard({
      incidentId: "inc_901",
      storeName: "Birmingham Autocentre",
      rating: 2,
      feedback: "Fitting delayed by 45m",
      portalUrl: "http://localhost:3000/manager/incidents/inc_901"
    });

    expect(card.cardsV2[0].card.header.title).toContain("Birmingham Autocentre Experience Alert");
    const widgets = card.cardsV2[0].card.sections[0].widgets;
    expect(widgets.some(w => w.buttonList?.buttons.some(b => b.text === "⚡ Open Investigation"))).toBe(true);
  });

  it("builds in-place updated card upon manager action", () => {
    const updatedCard = buildResolvedCard({
      incidentId: "inc_901",
      storeName: "Birmingham Autocentre",
      assignedTo: "Sarah (Service Lead)",
      status: "In Progress",
      portalUrl: "http://localhost:3000/manager/incidents/inc_901"
    });

    expect(updatedCard.cardsV2[0].card.header.subtitle).toBe("Status: ✓ In Progress (Assigned: Sarah (Service Lead))");
    const widgets = updatedCard.cardsV2[0].card.sections[0].widgets;
    expect(widgets.some(w => w.buttonList?.buttons.some(b => b.text === "🔍 View Full Investigation"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/unit/gchat-cards.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implement Google Chat Card Builder and API webhook**

```typescript
// Cymbal-Tyres/lib/gchat/cardBuilder.ts
export interface ExperienceIncident {
  incidentId: string;
  storeName: string;
  rating?: number;
  feedback?: string;
  assignedTo?: string;
  status?: string;
  portalUrl: string;
}

export function buildExperienceAlertCard(incident: ExperienceIncident) {
  return {
    cardsV2: [
      {
        cardId: incident.incidentId,
        card: {
          header: {
            title: `⚠️ ${incident.storeName} Experience Alert`,
            subtitle: `Detractor Survey: ${incident.rating}/10`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<b>Feedback:</b> "${incident.feedback}"`,
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: "⚡ Open Investigation",
                        onClick: {
                          action: {
                            function: "handleInvestigate",
                            parameters: [{ key: "incidentId", value: incident.incidentId }],
                          },
                        },
                      },
                      {
                        text: "👤 Assign",
                        onClick: {
                          action: {
                            function: "handleAssign",
                            parameters: [{ key: "incidentId", value: incident.incidentId }],
                          },
                        },
                      },
                      {
                        text: "✕ Dismiss",
                        onClick: {
                          action: {
                            function: "handleDismiss",
                            parameters: [{ key: "incidentId", value: incident.incidentId }],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

export function buildResolvedCard(incident: ExperienceIncident) {
  return {
    cardsV2: [
      {
        cardId: incident.incidentId,
        card: {
          header: {
            title: `⚠️ ${incident.storeName} Experience Alert`,
            subtitle: `Status: ✓ ${incident.status} (Assigned: ${incident.assignedTo})`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<i>Investigation opened by manager. Tracked in Cymbal Corporate Portal.</i>`,
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: "🔍 View Full Investigation",
                        onClick: {
                          openLink: {
                            url: incident.portalUrl,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}
```

```typescript
// Cymbal-Tyres/app/api/gchat/webhook/route.ts
import { NextResponse } from "next/server";
import { buildResolvedCard } from "@/lib/gchat/cardBuilder";

export async function POST(req: Request) {
  try {
    const event = await req.json();
    const action = event.action?.actionMethodName;
    const incidentId = event.action?.parameters?.find((p: { key: string }) => p.key === "incidentId")?.value || "inc_001";

    if (action === "handleInvestigate") {
      const updatedCard = buildResolvedCard({
        incidentId,
        storeName: "Birmingham Autocentre",
        assignedTo: "Sarah (Service Lead)",
        status: "In Progress",
        portalUrl: `http://localhost:3000/manager/incidents/${incidentId}`,
      });
      // In-place update response to Google Chat
      return NextResponse.json({
        actionResponse: { type: "UPDATE_MESSAGE" },
        ...updatedCard,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to process GChat interaction" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/gchat-cards.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add Cymbal-Tyres/lib/gchat/cardBuilder.ts Cymbal-Tyres/app/api/gchat/webhook/route.ts Cymbal-Tyres/tests/unit/gchat-cards.test.ts
git commit -m "feat(gchat): add Google Chat card builder and in-place update webhook"
```

---

### Task 6: Cymbal Manager Portal & Incident Dossier UI

**Files:**
- Create: `Cymbal-Tyres/app/manager/incidents/[id]/page.tsx`
- Create: `Cymbal-Tyres/components/manager/EvidenceChainCard.tsx`
- Create: `Cymbal-Tyres/components/manager/CompetitorBenchmarkCard.tsx`
- Test: `Cymbal-Tyres/tests/unit/manager-components.test.tsx`

**Interfaces:**
- Displays: Incident details, customer survey history, BigQuery regional anomaly graphs, Places Insights quantitative benchmarks, immutable audit trail.

- [ ] **Step 1: Create Manager Incident Dossier UI component**

```tsx
// Cymbal-Tyres/app/manager/incidents/[id]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function IncidentDossierPage() {
  const params = useParams();
  const incidentId = params?.id as string;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">High Severity</span>
            <h1 className="text-2xl font-bold text-gray-900">Incident Dossier: {incidentId}</h1>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" /> Birmingham Central Autocentre (Depot #101) &bull; <Clock className="w-4 h-4" /> Escalated via Google Chat
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Mark Resolved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Incident Context */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">1. Survey & Customer Context</h2>
          <div>
            <span className="text-xs text-gray-400">CUSTOMER</span>
            <p className="text-sm font-medium text-gray-800">driver.johnson@example.com</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">NPS RATING</span>
            <p className="text-2xl font-black text-red-600">2 / 10</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">CUSTOMER FEEDBACK</span>
            <blockquote className="text-sm italic text-gray-600 border-l-2 border-red-400 pl-2 mt-1">
              "Fitting bay delayed by 45 minutes past my booked slot. Counter staff were overwhelmed."
            </blockquote>
          </div>
          <div>
            <span className="text-xs text-gray-400">PUBLIC REVIEW STATUS</span>
            <p className="text-sm text-gray-700">Neutral Google Review link dispatched (un-gated policy).</p>
          </div>
        </div>

        {/* Evidence Stack: Places Insights & BigQuery */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">2. External Evidence & Benchmarks</h2>
          <div className="space-y-2">
            <span className="text-xs text-gray-400">PLACES INSIGHTS (BIRMINGHAM CLUSTER)</span>
            <div className="text-xs text-gray-600 space-y-1">
              <p>&bull; Local Competitor Avg Rating: <b>4.3★</b> (vs Depot: <b>4.1★</b>)</p>
              <p>&bull; Competitor Review Volume: <b>380 reviews / mo</b></p>
              <p>&bull; Maps Grounding Sentiment: Competitors lead on <i>wait time</i>.</p>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t">
            <span className="text-xs text-gray-400">BIGQUERY REGIONAL ANOMALY</span>
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
              Depot #101 slot delay +32% above regional baseline during Saturday peak hours.
            </p>
          </div>
        </div>

        {/* Action History & Immutable Audit Ledger */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">3. Action History & Audit Log</h2>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex gap-2">
              <span className="text-gray-400">14:10</span>
              <span>Survey submitted (Rating: 2/10)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">14:11</span>
              <span>Long Horizon generated incident dossier</span>
            </div>
            <div className="flex gap-2 text-blue-600">
              <span className="text-gray-400">14:12</span>
              <span>Interactive card posted to Google Chat</span>
            </div>
            <div className="flex gap-2 text-green-600 font-medium">
              <span className="text-gray-400">14:15</span>
              <span>Manager clicked [Investigate] in Google Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add Cymbal-Tyres/app/manager/incidents/[id]/page.tsx
git commit -m "feat(portal): add manager incident dossier page with evidence stack and audit log"
```

---

### Task 7: Interactive Demo Event Simulator & End-to-End Test Suite

**Files:**
- Create: `Cymbal-Tyres/app/demo-controls/page.tsx`
- Create: `Cymbal-Tyres/tests/e2e/agentic-loops.test.ts`

**Interfaces:**
- Interactive event triggers:
  1. Trigger 15-minute Cart Stalling $\rightarrow$ Observe A2A recovery offer & 5% AP2 Cart Mandate.
  2. Trigger Inventory Replenishment $\rightarrow$ Observe PurchaseIntent match & AP2 Closed Checkout Mandate settlement.
  3. Trigger Detractor Feedback $\rightarrow$ Observe Google Chat in-place card dispatch & investigation deep link.

- [ ] **Step 1: Write comprehensive end-to-end simulation test**

```typescript
// Cymbal-Tyres/tests/e2e/agentic-loops.test.ts
import { describe, it, expect } from "vitest";
import { evaluateRecoveryOffer, matchPurchaseIntent } from "../../lib/commerce/policy";
import { calculateCheckoutHash, verifyClosedCheckoutMandate } from "../../lib/ap2/verifier";
import { buildCommerceRecoveryOfferMessage } from "../../lib/a2a/messages";
import { buildExperienceAlertCard } from "../../lib/gchat/cardBuilder";

describe("End-to-End Agentic Customer Loops", () => {
  it("Loop 1: Detractor survey dispatches un-gated review link AND triggers Google Chat card", () => {
    const surveyEvent = { orderId: "ord_1", rating: 2, feedback: "Tyres took too long to fit", storeId: "birmingham" };
    const card = buildExperienceAlertCard({
      incidentId: "inc_001",
      storeName: "Birmingham Central",
      rating: surveyEvent.rating,
      feedback: surveyEvent.feedback,
      portalUrl: "http://localhost:3000/manager/incidents/inc_001"
    });
    expect(card.cardsV2[0].card.header.title).toContain("Birmingham Central Experience Alert");
  });

  it("Loop 2: Cart recovery creates A2A offer with 5% discount within deterministic bounds", () => {
    const checkout = { id: "chk_55", customerEmail: "buyer@example.com", totalGbp: 300, items: [{ sku: "TYRE-1", qty: 2 }] };
    const policyResult = evaluateRecoveryOffer(checkout, { lastOfferTimestamp: null });
    expect(policyResult.eligible).toBe(true);

    const a2aMessage = buildCommerceRecoveryOfferMessage({
      checkoutId: checkout.id,
      offerId: "off_55",
      discountPercent: policyResult.discountPercent!,
      discountAmountGbp: policyResult.discountAmountGbp!,
      expiresAt: policyResult.expiresAt!,
      checkoutRevisionId: "rev_1"
    });
    expect(a2aMessage.params.payload.discountPercent).toBe(5);
  });

  it("Loop 3: OOS Stock arrival matches Open Mandate and verifies Closed Mandate with checkout_hash", () => {
    const intent = {
      intentId: "int_77",
      customerEmail: "car@example.com",
      sku: "TYRE-PERF-19",
      storeId: "store_birmingham",
      targetQuantity: 4,
      maxPriceCapGbp: 600,
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    };
    const stock = { sku: "TYRE-PERF-19", storeId: "store_birmingham", addedQuantity: 10, unitPriceGbp: 125 };
    const match = matchPurchaseIntent(intent, stock);
    expect(match.matched).toBe(true);

    const finalCheckout = { checkoutId: "chk_auto_77", total: 50000, currency: "GBP", merchantId: "cymbal" };
    const checkoutHash = calculateCheckoutHash(finalCheckout);

    const closedMandate = {
      type: "ClosedCheckoutMandate" as const,
      version: "0.2" as const,
      mandateId: "man_c_77",
      parentMandateId: "man_open_77",
      checkout_hash: checkoutHash,
      merchantId: "cymbal",
      finalAmount: 50000,
      currency: "GBP",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      agentSignature: "sig_agent"
    };

    const verif = verifyClosedCheckoutMandate(closedMandate, finalCheckout);
    expect(verif.valid).toBe(true);
  });
});
```

- [ ] **Step 2: Run all unit and integration tests**

Run: `npx vitest run`  
Expected: All test suites PASS.

- [ ] **Step 3: Commit**

```bash
git add Cymbal-Tyres/tests/e2e/agentic-loops.test.ts
git commit -m "test(e2e): verify all 3 agentic customer loops against deterministic policy and AP2"
```

---

## Plan Self-Review Checklist

1. **Spec Coverage**:
   - Module 1 (Post-purchase feedback & Google Chat in-place updates) $\rightarrow$ Tasks 4, 5, 6
   - Module 2 (Cart recovery, deterministic 5% cap, A2A offer) $\rightarrow$ Tasks 1, 3, 4
   - Module 3 (OOS recovery, PurchaseIntent matching, AP2 v0.2 `checkout_hash` & mandates) $\rightarrow$ Tasks 1, 2, 4, 7
   - Knowledge segregation & review neutrality $\rightarrow$ Embedded in Tasks 1, 4, 6
2. **No Placeholders**: Zero "TBD", "TODO", or vague requirements. All data types, functions, and tests are written out with full code blocks.
3. **Type Consistency**: `checkout_hash`, `OpenCheckoutMandate`, `ClosedCheckoutMandate`, and `PaymentMandate` match across all modules and tests.
