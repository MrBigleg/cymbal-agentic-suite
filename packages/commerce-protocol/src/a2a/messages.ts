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
