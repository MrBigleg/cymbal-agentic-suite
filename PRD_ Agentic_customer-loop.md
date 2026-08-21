# **Product Requirements Document (PRD): Agentic Customer Lifecycle & Revenue Recovery Suite**

## **1\. Feature Overview & Protocol Stack**

The **Agentic Customer Lifecycle & Revenue Recovery Suite** transforms traditional post-purchase communication, cart abandonment, and out-of-stock workflows into autonomous, protocol-driven loops. Built for multi-location enterprise brands, the system leverages Google’s open agentic stack to drive reputation growth on Google Business Profile (GBP), recover stalled consumer carts, and convert out-of-stock intent into cryptographically verified transactions.

| System Module | Core Protocol / Tool | Technical Function |
| :---- | :---- | :---- |
| **Post-Purchase Engagement** | GBP APIs \+ Cloud Pub/Sub \+ OKF | Competitor review-gap analysis, personalized review prompts, and closed-loop CRM logging. |
| **Agentic Cart Recovery** | A2A \+ UCP \+ AP2 | Direct agent-to-agent abandoned cart pings with cryptographically signed discount mandates. |
| **Agentic OOS Recovery** | AP2 Intent Mandates \+ MCP | Pre-authorized conditional purchasing triggered immediately upon stock replenishment. |
| **User Experience Surface** | Agent-to-User Interface (A2UI) | Declarative, native UI rendering for human approvals and consumer notifications. |

## **2\. Module 1: Post-Purchase Review Generation & Closed-Loop Feedback**

### **Operational Workflow**

> 1. **Trigger & Sentiment Analysis:** Upon order completion, the PostPurchaseAgent executes an MCP tool query to fetch the store location's Open Knowledge Format (OKF) competitive graph. The agent compares local review sentiment against regional competitors to identify strategic review gaps (e.g., "Competitors lead in *staff friendliness*, but we lead in *checkout speed*").  
> 2. **Personalized Review Nudge:** The system dispatches a personalized thank-you message to the buyer. It embeds a trackable GBP review link (\[https://search.google.com/local/writereview?placeid=\](https://search.google.com/local/writereview?placeid=)...) along with tailored prompts asking the user to mention specific highlights (e.g., *"If you loved how quick your curbside pickup was today, let us know on Google\!"*).  
> 3. **Closed-Loop Verification & CRM Logging:**  
   * Cloud Pub/Sub intercepts incoming NEW\_REVIEW events from the GBP API.  
   * The ReviewCorrelator agent matches the review author and timestamp to the customer profile in the CRM/OKF store graph.  
   * If $\\ge 4$ stars, the system posts an automated thank-you reply via the Business Profile API and updates the customer's CRM profile with a "Brand Promoter" tag.  
   * If $\\le 3$ stars, it routes through the HITL escalation path using an interactive A2UI card sent to the local store manager.

## **3\. Module 2: Agent-Era Abandoned Cart Recovery**

### **Operational Workflow**

Standard email cart abandonments fail when AI shopping agents conduct purchases on behalf of users. This module upgrades recovery to operate directly over agent protocols.

\[Stalled UCP Session\] ➔ \[A2A Inactivity Ping\] ➔ \[UCP Discount Extension\]  
                                                        │  
\[AP2 Settlement\] ◄── \[A2UI User Prompt\] ◄── \[AP2 Cart Mandate Issued\]

> 1. **Session Stalling Detection:** A consumer agent initiates a UCP checkout session (dev.ucp.shopping.checkout) but fails to submit an AP2 payment authorization within 15 minutes.  
> 2. **A2A Negotiation Ping:** The Merchant Recovery Agent sends an Agent-to-Agent (A2A) protocol message directly to the consumer's buyer agent.  
> 3. **Dynamic UCP Incentive:** The message attaches an updated UCP cart payload containing a 5% "Finish Checkout" discount extension.  
> 4. **AP2 Cryptographic Security:** The merchant issues a cryptographically signed AP2 CartMandate (SD-JWT-VC). This locks the 5% discount strictly to the current cart hash and sets a 2-hour Time-to-Live (TTL) to prevent discount abuse or replay attacks.  
> 5. **Consumer Surface Delivery:** The consumer agent presents an A2UI notification card to the user's device. Clicking **Complete Purchase** instantly signs the AP2 PaymentMandate and executes settlement.

## **4\. Module 3: Agent-Era Out-of-Stock (OOS) Inventory Recovery**

### **Operational Workflow**

> 1. **OOS Discovery & Intent Capture:** When a consumer (or their AI agent) queries an out-of-stock item via UCP/MCP, the consumer agent issues an AP2 IntentMandate. This mandate delegates pre-authorized buying criteria: *"Purchase item X when back in stock at Store \#101 if price $\\le \\$120$ within 14 days"*.  
> 2. **ERP Stock Replenishment:** The local store receives inventory. An ERP webhook triggers an MCP alert to the OOSRecoveryAgent.  
> 3. **Automated Order Execution:**  
   * **Human-Not-Present (HNP) Mode:** If the AP2 IntentMandate explicitly permits autonomous execution, the Merchant Agent generates the UCP checkout object, matches the IntentMandate signature, generates the PaymentMandate via the Credential Provider, and completes checkout without human latency.  
   * **Human-Present (HP) Mode:** If the IntentMandate requires approval, the merchant sends an A2A task message that renders an interactive A2UI card ("Item Back in Stock—Tap to Order") on the user's screen.

## **5\. Security, Governance & Compliance**

* **Mandate Verification:** Every financial transaction must cryptographically validate AP2 CartMandate and PaymentMandate signatures prior to order processing to defeat price manipulation.  
* **Brand Safety:** All LLM-generated review replies and thank-you emails must pass through Model Armor / NeMo Guardrails to ensure output compliance and prevent prompt injection vulnerabilities.  
* **Audit Trail:** Every closed review loop, cart recovery, and OOS purchase writes an immutable event log entry to the store's OKF graph for enterprise auditing.