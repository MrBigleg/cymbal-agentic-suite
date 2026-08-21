import pytest
from unittest.mock import MagicMock
from horizon.cymbal_subagents import ExperienceReputationAgent, CheckoutRecoveryAgent, InventoryIntentAgent

def test_experience_agent_detractor_routing():
    agent = ExperienceReputationAgent(client=MagicMock())
    decision = agent.process_survey_event({
        "orderId": "ord_5521",
        "customerEmail": "driver@example.com",
        "rating": 2,
        "feedback": "Took 45 minutes past my slot time.",
        "storeId": "birmingham"
    })
    assert decision["escalateToGoogleChat"] is True
    assert decision["reviewLinkSent"] is True  # Review link sent to all customers (un-gated)
    assert "Birmingham" in decision["incidentDossier"]["title"]

def test_checkout_recovery_agent_discount_cap():
    agent = CheckoutRecoveryAgent(client=MagicMock())
    offer = agent.process_stalled_checkout({
        "checkoutId": "chk_101",
        "customerEmail": "buyer@example.com",
        "totalGbp": 500,
        "lastOfferDate": None
    })
    assert offer["eligible"] is True
    assert offer["discountPercent"] == 5
    assert offer["discountGbp"] == 25.0
    assert offer["expiresInHours"] == 2

def test_inventory_intent_agent_matching():
    agent = InventoryIntentAgent(client=MagicMock())
    intent = {
        "intentId": "int_99",
        "sku": "TYRE-225-45-R17",
        "storeId": "store_birmingham",
        "targetQuantity": 4,
        "maxPriceCapGbp": 480
    }
    stock = {
        "sku": "TYRE-225-45-R17",
        "storeId": "store_birmingham",
        "addedQuantity": 8,
        "unitPriceGbp": 110
    }
    result = agent.process_replenishment(intent, stock)
    assert result["matched"] is True
    assert result["totalPriceGbp"] == 440
    assert result["a2aMessageType"] == "inventory.intent.ready"
