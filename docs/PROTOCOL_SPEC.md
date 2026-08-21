# Protocol Specification: AP2 v0.2, A2A & UCP

This document defines the cryptographic contracts, message envelopes, and protocol sequence flows governing the **Cymbal Agentic Suite**.

---

## 1. AP2 v0.2 (Autonomous Payment Protocol)

AP2 v0.2 establishes cryptographically verifiable authority for autonomous and human-assisted agent purchases.

### Mandate Taxonomy & State Progression

```text
Customer / Shopping Agent
  "Authorize purchase of 4 tyres under £500 from an allowed merchant within 14 days"
          │
          ▼
  Open Checkout Mandate (Buyer-side Authorization)
  [mandateId: "man_open_01", maxAmount: 50000, currency: "GBP", allowedMerchants: ["cymbal_autocentres"]]
          │
          │ (Stock replenished & matched)
          ▼
  Merchant produces final UCP Checkout
  Merchant signs Checkout JWT (contains: checkoutId, total: 44000, currency: "GBP", merchantId: "cymbal_autocentres")
          │
          ▼
  Deterministic Hash Calculation
  checkout_hash = sha256(canonicalize(CheckoutObject))
          │
          ▼
  Closed Checkout Mandate (Constructed by Shopping Agent)
  [mandateId: "man_closed_01", parentMandateId: "man_open_01", checkout_hash: "sha256:...", finalAmount: 44000]
          │
          ▼
  Payment Mandate (Signed Authorization for Settlement)
  [paymentMandateId: "pay_01", checkout_hash: "sha256:...", signature: "sig_buyer_key"]
          │
          ▼
  Deterministic AP2 Verifier (Merchant Side)
  Validates: Hash equality, signature validity, Open→Closed constraint bounds, no replay.
          │
          ▼
  Settlement Execution
```

---

## 2. Agent-to-Agent (A2A) Application Payloads

Application messages are wrapped in standard JSON-RPC 2.0 task envelopes.

### 2.1 Cart Recovery Offer (`commerce.recovery.offer`)

```json
{
  "jsonrpc": "2.0",
  "id": "msg_1724240000000",
  "method": "a2a.task.dispatch",
  "params": {
    "type": "commerce.recovery.offer",
    "payload": {
      "checkoutId": "chk_8821",
      "offerId": "off_102",
      "discountPercent": 5,
      "discountAmountGbp": 20.0,
      "expiresAt": "2026-08-21T20:00:00Z",
      "checkoutRevisionId": "rev_2"
    }
  }
}
```

### 2.2 Inventory Intent Notification (`inventory.intent.ready`)

```json
{
  "jsonrpc": "2.0",
  "id": "msg_1724240000100",
  "method": "a2a.task.dispatch",
  "params": {
    "type": "inventory.intent.ready",
    "payload": {
      "intentId": "int_001",
      "sku": "TYRE-225-45-R17",
      "storeId": "store_birmingham",
      "unitPriceGbp": 110.0,
      "totalPriceGbp": 440.0,
      "checkoutId": "chk_auto_99",
      "checkoutJwt": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

## 3. Universal Commerce Protocol (UCP) State Flow

UCP manages commercial session lifecycle and line-item revisions:

1. **`dev.ucp.shopping.checkout`**: Initiates cart session and reserves tyre fitting bay.
2. **`dev.ucp.checkout.revision`**: Applies deterministic recovery discounts (5%) and generates revised checkout objects.
3. **`dev.ucp.checkout.settled`**: Confirms transaction completion following cryptographic AP2 verification.
