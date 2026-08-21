import { createHash } from "crypto";
import type { OpenCheckoutMandate, ClosedCheckoutMandate, PaymentMandate, MandateVerificationResult } from "@cymbal/commerce-protocol";

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
