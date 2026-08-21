import { describe, it, expect } from "vitest";
import { buildCommerceRecoveryOfferMessage, buildInventoryIntentReadyMessage, parseA2AMessage } from "../a2a/messages";

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

  it("builds valid inventory.intent.ready inside standard A2A envelope", () => {
    const msg = buildInventoryIntentReadyMessage({
      intentId: "int_001",
      sku: "TYRE-1",
      storeId: "store_birmingham",
      unitPriceGbp: 110,
      totalPriceGbp: 440,
      checkoutId: "chk_99",
      checkoutJwt: "jwt_signed_payload"
    });
    expect(msg.params.type).toBe("inventory.intent.ready");
    expect(msg.params.payload.totalPriceGbp).toBe(440);
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
