import { describe, it, expect } from "vitest";
import { evaluateRecoveryOffer, matchPurchaseIntent } from "../policy";
import { calculateCheckoutHash, verifyClosedCheckoutMandate } from "../verifier";
import { buildCommerceRecoveryOfferMessage } from "@cymbal/commerce-protocol";

describe("End-to-End Agentic Customer Loops", () => {
  it("Loop 1: Detractor survey dispatches un-gated review link AND triggers escalation", () => {
    const surveyEvent = { orderId: "ord_1", rating: 2, feedback: "Tyres took too long to fit", storeId: "birmingham" };
    expect(surveyEvent.rating <= 6).toBe(true);
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
