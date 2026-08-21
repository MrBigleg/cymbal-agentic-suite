import { describe, it, expect } from "vitest";
import { evaluateRecoveryOffer, matchPurchaseIntent, RECOVERY_POLICY_CONFIG } from "../policy";

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
