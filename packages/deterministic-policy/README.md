# 🛡️ @cymbal/deterministic-policy

Pure deterministic business logic, recovery discount bounds, OOS constraint matchers, and AP2 v0.2 cryptographic verifiers.

---

## 📋 Core Modules

1. **`RecoveryOfferPolicy`**:
   - `defaultDiscountPercent`: 5%
   - `maxDiscountCeilingPercent`: 10%
   - `maxValueCapGbp`: £35
   - `cooldownDays`: 30 days
   - `offerTtlHours`: 2 hours
2. **`PurchaseIntentMatcher`**:
   - Matches replenishment against stored intents across SKU, Depot ID, Quantity, Price Ceiling, and Expiration Date.
3. **`AP2Verifier`**:
   - Calculates deterministic `checkout_hash` from merchant-signed checkout payloads.
   - Verifies `ClosedCheckoutMandate` signatures and constraints against `OpenCheckoutMandate` limits.
   - Verifies `PaymentMandate` binding to `checkout_hash`.

---

## 🧪 Testing

```bash
pnpm --filter @cymbal/deterministic-policy test
```
