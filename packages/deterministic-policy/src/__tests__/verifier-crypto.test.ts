import { describe, it, expect } from "vitest";
import { generateKeyPairSync, createSign } from "crypto";
import {
  calculateCheckoutHash,
  verifyClosedCheckoutMandate,
  verifyPaymentMandate,
  verifyCryptographicSignature,
} from "../verifier";
import type { OpenCheckoutMandate, ClosedCheckoutMandate, PaymentMandate } from "@cymbal/commerce-protocol";

describe("AP2 Cryptographic Signature Verification", () => {
  // Generate test RSA Key Pair
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  function signPayload(payload: string, keyPem: string): string {
    const signer = createSign("SHA256");
    signer.update(payload);
    signer.end();
    return signer.sign(keyPem).toString("base64");
  }

  it("successfully signs and verifies data with RSA public key", () => {
    const message = "chk_test_123:sha256:abcd:4500:GBP";
    const signature = signPayload(message, privateKey);
    const valid = verifyCryptographicSignature(message, signature, publicKey);
    expect(valid).toBe(true);

    const tampered = verifyCryptographicSignature(message + "_tampered", signature, publicKey);
    expect(tampered).toBe(false);
  });

  it("verifies closed checkout mandate with authentic cryptographic signature", () => {
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

    const mandateId = "man_closed_01";
    const finalAmount = 44000;
    const currency = "GBP";
    const payloadToSign = `${mandateId}:${checkoutHash}:${finalAmount}:${currency}`;
    const agentSignature = signPayload(payloadToSign, privateKey);

    const validClosedMandate: ClosedCheckoutMandate = {
      type: "ClosedCheckoutMandate",
      version: "0.2",
      mandateId,
      parentMandateId: "man_open_01",
      checkout_hash: checkoutHash,
      merchantId: "cymbal_autocentres",
      finalAmount,
      currency,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      agentSignature,
    };

    const verification = verifyClosedCheckoutMandate(validClosedMandate, checkoutPayload, openMandate, publicKey);
    expect(verification.valid).toBe(true);

    // Tampered signature should fail
    const invalidSigMandate = { ...validClosedMandate, agentSignature: Buffer.from("invalid_signature").toString("base64") };
    const failedVerification = verifyClosedCheckoutMandate(invalidSigMandate, checkoutPayload, openMandate, publicKey);
    expect(failedVerification.valid).toBe(false);
    expect(failedVerification.reason).toBe("INVALID_AGENT_CRYPTOGRAPHIC_SIGNATURE");
  });

  it("verifies payment mandate with authentic cryptographic signature", () => {
    const checkoutHash = "sha256:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const paymentMandateId = "pay_001";
    const amount = 44000;
    const currency = "GBP";

    const payloadToSign = `${paymentMandateId}:${checkoutHash}:${amount}:${currency}`;
    const signature = signPayload(payloadToSign, privateKey);

    const paymentMandate: PaymentMandate = {
      type: "PaymentMandate",
      version: "0.2",
      paymentMandateId,
      checkout_hash: checkoutHash,
      amount,
      currency,
      paymentMethodRef: "pm_card_gbp",
      authorizedAt: new Date().toISOString(),
      signature,
    };

    const res = verifyPaymentMandate(paymentMandate, checkoutHash, publicKey);
    expect(res.valid).toBe(true);

    const tamperedRes = verifyPaymentMandate(paymentMandate, "sha256:tampered_hash", publicKey);
    expect(tamperedRes.valid).toBe(false);
    expect(tamperedRes.reason).toBe("CHECKOUT_HASH_MISMATCH");
  });
});
