import { describe, it, expect } from "vitest";
import { calculateCheckoutHash, verifyClosedCheckoutMandate, verifyPaymentMandate } from "../verifier";
import type { OpenCheckoutMandate, ClosedCheckoutMandate, PaymentMandate } from "@cymbal/commerce-protocol";

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

  it("verifies payment mandate binds to checkout_hash", () => {
    const checkoutHash = "sha256:abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234";
    const paymentMandate: PaymentMandate = {
      type: "PaymentMandate",
      version: "0.2",
      paymentMandateId: "pay_001",
      checkout_hash: checkoutHash,
      amount: 44000,
      currency: "GBP",
      paymentMethodRef: "pm_card_gbp",
      authorizedAt: new Date().toISOString(),
      signature: "sig_buyer_key",
    };

    const res = verifyPaymentMandate(paymentMandate, checkoutHash);
    expect(res.valid).toBe(true);
  });
});
