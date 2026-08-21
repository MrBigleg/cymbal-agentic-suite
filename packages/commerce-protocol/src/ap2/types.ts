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
