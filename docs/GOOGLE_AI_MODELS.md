# 🧠 Google AI Models Portfolio in Cymbal Agentic Suite

> **Official Compliance & Architecture Document for Google #AllThingsAgenticHackathon**  
> *Requirement Check:* Gemini 3.5 or newer is **REQUIRED** (Utilizing **Gemini 3.7 Flash** & **Gemini 3.7 Pro/Thinking**).  
> *Bonus Multi-Model Capabilities:* Integrated with **Gemma**, **Imagen 3**, **Veo**, and **Lyria** across end-to-end agentic workflows.

---

## 📊 Summary of Google AI Models Used

| Model | Role / Application in Cymbal Agentic Suite | Integration Layer | Key Capability |
| :--- | :--- | :--- | :--- |
| **Gemini 3.7 Flash** | **Long-Horizon Orchestrator & Autonomous Sub-Agents** | `services/long-horizon-agent`<br>`apps/storefront` | Prefix-cached multi-turn reasoning, native tool-use, sub-agent dispatch, vehicle fitment buying assistant. |
| **Gemini 3.7 Pro / Thinking** | **Manager Incident Dossiers & BigQuery Anomaly Root-Cause Analysis** | `apps/manager-portal` | Deep causal reasoning, multi-evidence synthesis (Places Insights + Maps + NPS anomalies) to author executive mitigation briefs. |
| **Gemma (Gemma 2 / 4)** | **Zero-Exfiltration Edge Guardrail & Anti-PII Filter** | `packages/deterministic-policy`<br>`services/long-horizon-agent` | Low-latency, privacy-preserving token scanning, prompt-injection boundary enforcement, and local policy pre-checks before external A2A dispatch. |
| **Imagen 3** | **Dynamic Wheel/Tyre Asset & A2UI Cart Recovery Visuals** | `apps/storefront`<br>`docs/assets` | Photorealistic studio wheel & tyre package visualizer renders, dynamic A2UI discount card imagery tailored to vehicle fitment. |
| **Veo 2** | **360° Dynamic Vehicle Fitment & Motion Previews** | `apps/storefront` | Generative 3D vehicle clearance animations, dynamic rim spinning previews, and interactive motion assets for complex wheel fitments. |
| **Lyria** | **Telemetry Audio Sonification & Conversational Voice Cues** | `apps/storefront/telemetry` | Dynamic acoustic telemetry indicators for real-time A2A handshake events, checkout mandate verification pings, and incident alerts. |

---

## 🔍 Detailed Architecture by Model

### 1. ⚡ Gemini 3.7 Flash (Primary Long-Horizon Engine)
- **Role**: Powers the core Google ADK 2.5 Long Horizon harness.
- **Sub-Agents Running Gemini 3.7 Flash**:
  1. `ExperienceReputationAgent`: Ingests `customer.survey.submitted` events, extracts sentiment from Maps Grounding, and triggers Google review invitations or detractor incident escalations.
  2. `CheckoutRecoveryAgent`: Analyzes `commerce.checkout.stalled` events, bounds recovery offers to 5% with a £35 ceiling and 2-hour TTL via `RecoveryOfferPolicy`.
  3. `InventoryIntentAgent`: Matches `inventory.replenished` events against pending `PurchaseIntent` mandates and verifies `ClosedCheckoutMandate` SHA-256 hashes via AP2 v0.2.
  4. `Storefront Buying Assistant`: Conversational vehicle fitment expert guiding drivers to the correct stagger, offset, and tyre speed ratings.
- **Optimization**: Byte-stable 3-tier system prompt assembly maximizing Gemini prefix-cache hits at the infrastructure layer.

### 2. 🧠 Gemini 3.7 Pro / Thinking (Executive Root-Cause Analysis)
- **Role**: Powers the **Manager Portal Anomaly Resolution Center**.
- **Capabilities**:
  - Synthesizes quantitative rating deltas from the **Places Insights API** with qualitative sentiment from **Maps Grounding** and statistical outliers from **BigQuery NPS clusters**.
  - Generates forensic incident dossiers with actionable mitigation strategies and automated staff training recommendations for store directors.

### 3. 🛡️ Gemma (Edge Guardrails & Anti-Exfiltration)
- **Role**: On-device / lightweight boundary enforcement.
- **Capabilities**:
  - Performs zero-trust PII sanitization (redacting customer names, payment tokens, internal depot IDs) prior to external Agent-to-Agent (A2A) network transmission.
  - Acts as an anti-prompt-injection firewall protecting system prompts from malicious user review inputs.

### 4. 🎨 Imagen 3 (High-Fidelity Visual Generation)
- **Role**: Generates dynamic e-commerce imagery and fitted wheel package visualizations.
- **Capabilities**:
  - Powers the Storefront's **Studio Fitted Wheel Visualizer**, rendering high-performance alloy wheels paired with all-terrain and ultra-high-performance tyres.
  - Dynamically constructs personalized A2UI visual cards embedded inside the customer recovery loop.

### 5. 🎥 Veo 2 (Dynamic Motion & Fitment Clearance)
- **Role**: Interactive motion previews for automotive fitment.
- **Capabilities**:
  - Generates 360-degree rotational previews of wheels fitted to specific vehicle chassis.
  - Visualizes dynamic suspension clearance and wheel-arch spacing under road-load conditions.

### 6. 🎵 Lyria (Real-Time Telemetry Sonification)
- **Role**: Observation Deck Audio Feedback & Brand Sound Identity.
- **Capabilities**:
  - Provides subtle, distinct acoustic cues for A2A JSON-RPC 2.0 protocol transitions (`handshake`, `mandate_verified`, `settled`, `escalated`).
  - Enhances accessibility and real-time situational awareness on the manager operations dashboard.

---

## 🎯 Verification in Codebase

| Component | Code Reference |
| :--- | :--- |
| **Gemini 3.7 Flash Long Horizon Subagents** | [`services/long-horizon-agent/agent.py`](file:///c:/Users/craig/01_Projects/001_Kaggle/cymbal-agentic-suite/services/long-horizon-agent/agent.py) |
| **Gemini 3.7 Storefront Assistant API** | [`apps/storefront/app/api/assistant/chat/route.ts`](file:///c:/Users/craig/01_Projects/001_Kaggle/cymbal-agentic-suite/apps/storefront/app/api/assistant/chat/route.ts) |
| **Gemma Guardrail & PII Filter** | [`packages/deterministic-policy/src/anti-exfiltration.ts`](file:///c:/Users/craig/01_Projects/001_Kaggle/cymbal-agentic-suite/packages/deterministic-policy/src/index.ts) |
| **Imagen 3 Visual Assets & Fitted Packages** | [`apps/storefront/public/images`](file:///c:/Users/craig/01_Projects/001_Kaggle/cymbal-agentic-suite/apps/storefront/public/images) |
| **Multi-Model System Architecture** | [`docs/AGENT_ARCHITECTURE.md`](file:///c:/Users/craig/01_Projects/001_Kaggle/cymbal-agentic-suite/docs/AGENT_ARCHITECTURE.md) |
