"""Cymbal Long Horizon Sub-Agents.

Implements the three core specialized agents for:
1. Experience & Reputation (un-gated review link + Google Chat manager escalation)
2. Checkout Recovery (5% default discount, 2h TTL, A2A commerce.recovery.offer)
3. Inventory & AP2 Intent (Deterministic constraint check & inventory.intent.ready)
"""

from typing import Dict, Any, Optional
from google import genai

MODEL_NAME = "gemini-3.7-flash"

class ExperienceReputationAgent:
    """Specialized agent for post-purchase review generation and incident escalation."""
    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client()
        self.model = MODEL_NAME

    def process_survey_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        rating = event.get("rating", 10)
        is_detractor = rating <= 6
        store_id = event.get("storeId", "birmingham")
        
        return {
            "orderId": event["orderId"],
            "rating": rating,
            "reviewLinkSent": True,  # Un-gated: All customers receive honest feedback link
            "escalateToGoogleChat": is_detractor,
            "incidentDossier": {
                "title": f"⚠️ {store_id.capitalize()} Autocentre Experience Alert",
                "severity": "HIGH" if rating <= 3 else "MEDIUM",
                "reason": event.get("feedback", "Low satisfaction score"),
                "storeId": store_id,
                "customerEmail": event.get("customerEmail", ""),
            } if is_detractor else None
        }

class CheckoutRecoveryAgent:
    """Specialized agent for abandoned cart recovery within deterministic bounds."""
    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client()
        self.model = MODEL_NAME

    def process_stalled_checkout(self, event: Dict[str, Any]) -> Dict[str, Any]:
        total = event.get("totalGbp", 0)
        discount_percent = 5
        discount_amount = min((total * discount_percent) / 100.0, 35.0)
        
        return {
            "checkoutId": event["checkoutId"],
            "eligible": True,
            "discountPercent": discount_percent,
            "discountGbp": discount_amount,
            "expiresInHours": 2,
            "a2aMessageType": "commerce.recovery.offer"
        }

class InventoryIntentAgent:
    """Specialized agent for OOS replenishment matching and AP2 mandate execution."""
    def __init__(self, client: Optional[genai.Client] = None):
        self.client = client or genai.Client()
        self.model = MODEL_NAME

    def process_replenishment(self, intent: Dict[str, Any], stock: Dict[str, Any]) -> Dict[str, Any]:
        total = stock["unitPriceGbp"] * intent["targetQuantity"]
        matched = (
            intent["sku"] == stock["sku"] and
            intent["storeId"] == stock["storeId"] and
            stock["addedQuantity"] >= intent["targetQuantity"] and
            total <= intent["maxPriceCapGbp"]
        )
        return {
            "matched": matched,
            "intentId": intent["intentId"],
            "totalPriceGbp": total if matched else None,
            "a2aMessageType": "inventory.intent.ready" if matched else None
        }
