export const RECOVERY_POLICY_CONFIG = {
  DEFAULT_DISCOUNT_PERCENT: 5,
  MAX_DISCOUNT_CEILING_PERCENT: 10,
  MAX_VALUE_CAP_GBP: 35,
  COOLDOWN_DAYS: 30,
  OFFER_TTL_HOURS: 2,
} as const;

export interface CheckoutContext {
  id: string;
  customerEmail: string;
  totalGbp: number;
  items: Array<{ sku: string; qty: number }>;
}

export interface CustomerHistory {
  lastOfferTimestamp: string | null;
}

export interface RecoveryOfferResult {
  eligible: boolean;
  reason?: string;
  discountPercent?: number;
  discountAmountGbp?: number;
  ttlHours?: number;
  expiresAt?: string;
}

export function evaluateRecoveryOffer(checkout: CheckoutContext, history: CustomerHistory): RecoveryOfferResult {
  if (history.lastOfferTimestamp) {
    const elapsedDays = (Date.now() - new Date(history.lastOfferTimestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (elapsedDays < RECOVERY_POLICY_CONFIG.COOLDOWN_DAYS) {
      return { eligible: false, reason: "COOLDOWN_ACTIVE" };
    }
  }

  const rawDiscount = (checkout.totalGbp * RECOVERY_POLICY_CONFIG.DEFAULT_DISCOUNT_PERCENT) / 100;
  const discountAmountGbp = Math.min(rawDiscount, RECOVERY_POLICY_CONFIG.MAX_VALUE_CAP_GBP);
  const expiresAt = new Date(Date.now() + RECOVERY_POLICY_CONFIG.OFFER_TTL_HOURS * 3600 * 1000).toISOString();

  return {
    eligible: true,
    discountPercent: RECOVERY_POLICY_CONFIG.DEFAULT_DISCOUNT_PERCENT,
    discountAmountGbp,
    ttlHours: RECOVERY_POLICY_CONFIG.OFFER_TTL_HOURS,
    expiresAt,
  };
}

export interface PurchaseIntent {
  intentId: string;
  customerEmail: string;
  sku: string;
  storeId: string;
  targetQuantity: number;
  maxPriceCapGbp: number;
  expiresAt: string;
}

export interface StockReplenishment {
  sku: string;
  storeId: string;
  addedQuantity: number;
  unitPriceGbp: number;
}

export interface MatchResult {
  matched: boolean;
  reason?: string;
  totalPriceGbp?: number;
}

export function matchPurchaseIntent(intent: PurchaseIntent, replenishment: StockReplenishment): MatchResult {
  if (new Date(intent.expiresAt).getTime() < Date.now()) {
    return { matched: false, reason: "INTENT_EXPIRED" };
  }
  if (intent.sku !== replenishment.sku) {
    return { matched: false, reason: "SKU_MISMATCH" };
  }
  if (intent.storeId !== replenishment.storeId) {
    return { matched: false, reason: "STORE_MISMATCH" };
  }
  if (replenishment.addedQuantity < intent.targetQuantity) {
    return { matched: false, reason: "INSUFFICIENT_STOCK" };
  }

  const totalPriceGbp = replenishment.unitPriceGbp * intent.targetQuantity;
  if (totalPriceGbp > intent.maxPriceCapGbp) {
    return { matched: false, reason: "EXCEEDS_PRICE_CAP" };
  }

  return { matched: true, totalPriceGbp };
}
