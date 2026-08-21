# Google Chat App: In-Place Card Integration Guide

This guide details the operational architecture of the **Google Chat App** used by Cymbal Autocentre store managers for real-time customer experience triage.

---

## 📱 Operational Flow

```text
Detractor Survey / Regional Anomaly
                │
                ▼
      Long Horizon Agent
  (Generates Incident Dossier)
                │
                ▼
      Google Chat App API
 (Posts Interactive Card to Space)
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Birmingham Autocentre Experience Alert               │
│ Detractor Survey: 2/10 (Delay +45m)                     │
│                                                         │
│ [⚡ Open Investigation]  [👤 Assign]  [✕ Dismiss]       │
└───────────────────────────────┬─────────────────────────┘
                                │
                    Manager clicks [⚡ Open Investigation]
                                │
                                ▼
                   Webhook: POST /api/gchat/webhook
                    (Returns type: UPDATE_MESSAGE)
                                │
                                ▼
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Birmingham Autocentre Experience Alert               │
│ Status: ✓ In Progress (Assigned: Sarah (Service Lead))  │
│                                                         │
│ [🔍 View Full Investigation in Cymbal Portal]           │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Card JSON Structure (Google Chat API v2)

### 1. Inbound Alert Card
```json
{
  "cardsV2": [
    {
      "cardId": "inc_901",
      "card": {
        "header": {
          "title": "⚠️ Birmingham Autocentre Experience Alert",
          "subtitle": "Detractor Survey: 2/10"
        },
        "sections": [
          {
            "widgets": [
              {
                "textParagraph": {
                  "text": "<b>Feedback:</b> \"Fitting delayed by 45m\""
                }
              },
              {
                "buttonList": {
                  "buttons": [
                    {
                      "text": "⚡ Open Investigation",
                      "onClick": {
                        "action": {
                          "function": "handleInvestigate",
                          "parameters": [{ "key": "incidentId", "value": "inc_901" }]
                        }
                      }
                    },
                    {
                      "text": "👤 Assign",
                      "onClick": {
                        "action": {
                          "function": "handleAssign",
                          "parameters": [{ "key": "incidentId", "value": "inc_901" }]
                        }
                      }
                    },
                    {
                      "text": "✕ Dismiss",
                      "onClick": {
                        "action": {
                          "function": "handleDismiss",
                          "parameters": [{ "key": "incidentId", "value": "inc_901" }]
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### 2. In-Place Update Response
```json
{
  "actionResponse": {
    "type": "UPDATE_MESSAGE"
  },
  "cardsV2": [
    {
      "cardId": "inc_901",
      "card": {
        "header": {
          "title": "⚠️ Birmingham Autocentre Experience Alert",
          "subtitle": "Status: ✓ In Progress (Assigned: Sarah (Service Lead))"
        },
        "sections": [
          {
            "widgets": [
              {
                "textParagraph": {
                  "text": "<i>Investigation opened by manager. Tracked in Cymbal Corporate Portal.</i>"
                }
              },
              {
                "buttonList": {
                  "buttons": [
                    {
                      "text": "🔍 View Full Investigation",
                      "onClick": {
                        "openLink": {
                          "url": "http://localhost:3000/manager/incidents/inc_901"
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```
