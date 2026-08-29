# 📜 Cymbal Development Session History & Changelog

> **Running architectural log of all engineering sessions for the Cymbal Agentic Suite.**  
> Each entry outlines **The What** (technical deliverables and code changes) and **The Why** (strategic and architectural rationale).

---

## 📅 Session 1: Monorepo Setup & Core Autonomous Protocols
- **Date**: 2026-08-21
- **Topic**: Google ADK 2.5 Long Horizon Agent, AP2 v0.2, A2A & UCP

### 🎯 The What
1. **Polyglot Monorepo Architecture**:
   - Set up PNPM workspaces (`apps/storefront`, `packages/commerce-protocol`, `packages/deterministic-policy`).
   - Integrated Python 3.11 Google ADK 2.5 Long Horizon Agent with Gemini 3.7 Flash in `services/long-horizon-agent`.
2. **Deterministic Commerce Policies**:
   - Built `RecoveryOfferPolicy` (bounded 5% discount, £35 cap, 2h TTL, SD-JWT-VC CartMandate).
   - Built `PurchaseIntentMatcher` (SKU, price cap, and store matching for open checkout mandates).
   - Built `AP2Verifier` for `checkout_hash` binding.
3. **A2A & UCP Contracts**:
   - Created JSON schemas and protocol specifications for A2A negotiation and UCP cart extensions.

### 💡 The Why
- **Autonomous Agentic Commerce**: Traditional checkout fails when buyer agents act on behalf of users. Building native A2A negotiation, cryptographic AP2 payment mandates, and deterministic safeguards provides a complete reference architecture for agent-era commerce.

---

## 📅 Session 2: Manager Portal, Google Chat HITL Integration & Demo Controls
- **Date**: 2026-08-21
- **Topic**: Operational Back-Office, Incident Dossiers & Event Simulator

### 🎯 The What
1. **Manager Portal & Incident Dossiers**:
   - Built `/manager/incidents/[id]` featuring real-time BigQuery regional NPS anomaly alerts, Places Insights sentiment gaps, and customer journey timelines.
2. **Google Chat HITL Integration**:
   - Created `apps/storefront/lib/gchat-card-builder.ts` to generate declarative Google Chat Cards v2 for detractor review escalations.
   - Implemented webhook receiver with in-place action handling (`INVESTIGATE`, `ASSIGN`, `DISMISS`).
3. **Interactive Demo Controls**:
   - Built `/demo-controls` allowing evaluators to simulate 3 live events: Stalled Cart (15m Inactivity), OOS Stock Arrival (`inventory.replenished`), and Detractor Survey (2/10 NPS).

### 💡 The Why
- **Human-in-the-Loop (HITL) Reality**: Autonomous AI systems require operational governance. Equipping store managers with in-place actionable Google Chat cards closes the feedback loop between customer sentiment and field management.

---

## 📅 Session 3: Security Hardening, Cloud Run Parity & Programmatic Verification
- **Date**: 2026-08-22
- **Topic**: Threat Modeling, Cryptographic Verification & Hermetic Test Harness

### 🎯 The What
1. **Security & Cryptographic Hardening**:
   - Implemented asymmetric ED25519/RS256 signature verification for AP2 mandates (`AP2Verifier`).
   - Added HMAC-SHA256 signature verification for incoming UCP and Google Chat webhooks.
   - Built anti-XSS escaping and prompt injection defenses (Model Armor / delimiter isolation) for LLM inputs and outputs.
2. **Container Parity & Cloud Run Health Probes**:
   - Added `/healthz` startup, liveness, and readiness probes with public bypass in FastAPI and Next.js.
   - Configured non-root `appuser` execution in multi-stage Dockerfiles.
3. **Automated Smoke Test Harness**:
   - Created `scripts/smoke_test.py` and `scripts/smoke_test.ps1` for hermetic verification of endpoints, health probes, and error handling.
   - Wrote comprehensive guides: `docs/SECURITY_EVALUATION_AND_HARDENING.md` and `docs/LOCAL_TESTING_AND_VERIFICATION.md`.

### 💡 The Why
- **Enterprise-Grade Governance**: Hackathon submissions often fail on deployment or security oversights. Hardening cryptographic verification, securing webhooks, and providing a 1-command verification harness guarantees deployment reliability on Google Cloud Run.

---

## 📅 Session 4: Custom Studio Tyre Assets & Wheel Package Visualizer
- **Date**: 2026-08-22
- **Topic**: Real Studio Tyre Cutouts & Fitted Alloy Wheel Overlays

### 🎯 The What
1. **Custom Studio Tyre Assets**:
   - Replaced generic stock photos with high-resolution custom studio tyre cutouts (`ultra-sport-ev.png`, `all-season-pro.png`, `winter-grip-ice.png`, `eco-touring-plus.png`, `all-terrain-heavy.png`).
2. **Fitted Alloy Wheel Visualizer**:
   - Added interactive "Fitted Wheel & Tyre Package" toggle with realistic alloy wheel overlay visuals on the Product Detail Page.

### 💡 The Why
- **Real-World Fidelity**: Visual quality and authentic automotive assets immediately communicate domain authority and credibility for the Cymbal Tyres brand.

---

## 📅 Session 5: Driver.js Interactive Multi-Track Tour & Judge Guide Implementation
- **Date**: 2026-08-22
- **Topic**: Guided Navigation, Protocol Walkthroughs & Live Action Triggers

### 🎯 The What
1. **Driver.js v1 Integration & Multi-Track Engine (`apps/storefront/lib/tour-config.ts`)**:
   - Installed `driver.js` (^1.8.0) in `@cymbal/storefront`.
   - Designed and built 3 guided interactive tour tracks:
     - **Track 1: Judge Architecture Tour (6 Steps)**: Explains the full multi-loop agentic architecture across `/`, `/shop`, `/cart`, `/demo-controls`, and `/manager/incidents/inc_001` with protocol badges `[OKF PROTOCOL]`, `[GOOGLE ADK 2.5]`, `[AP2 v0.2]`, `[A2A + UCP]`, `[EVENT SIMULATOR]`, `[HITL + GBP]`.
     - **Track 2: Customer / Shopper Tour (4 Steps)**: Onboarding guide covering vehicle registration lookup, tyre dimension filtering, basket review, and fitting slot booking.
     - **Track 3: Store Manager Escalation Tour (3 Steps)**: Workshop incident management, sentiment analysis, and stock replenishment dispatch.
2. **Cross-Route Orchestrator (`apps/storefront/components/TourContext.tsx`)**:
   - Built a React Context providing seamless cross-page routing transitions across Next.js App Router.
   - Built DOM retry polling for dynamic element hydration after page transitions.
   - Added URL direct query parameter support (`?tour=judge`, `?tour=customer`, `?tour=manager`) for 1-click shareable demo links.
   - Built action dispatcher for popovers (`cymbal-tour-action` event bus) supporting triggers such as `OPEN_AI_ASSISTANT` and `TRIGGER_STOCK_REPLENISH`.
3. **Tour Launcher & UI Components (`apps/storefront/components/TourLauncher.tsx`)**:
   - Floating pill in bottom right corner with animated glow (`⚡ Interactive Guide / Judge & Shopper Tours`).
   - Track selector modal with track summaries, step counts, and 1-click link copying.
4. **Testing & Verification**:
   - Authored unit test suite `apps/storefront/tests/unit/tour-config.test.ts` (9 unit tests).

### 💡 The Why
- **Evaluation Velocity**: Evaluators and judges have limited time. An interactive multi-track tour with in-place action triggers allows anyone to experience and understand the complete multi-protocol architecture in under 2 minutes.

---

## 📅 Session 6: Master Design System (`design.md`) & Wiry Neo-Brutalist Slate Rollout
- **Date**: 2026-08-22
- **Topic**: Multi-Channel Design System & Comprehensive Frontend Overhaul

### 🎯 The What
1. **Master Design System Specification (`design.md`)**:
   - Authored master multi-channel design documentation covering Core Philosophy, Design Tokens, Asymmetric Corner Geometry, Typography, UI Components, Google Chat Cards v2, AI Image Art Direction, and Competition Verification Matrices.
2. **Global Token & Utility Setup (`apps/storefront/app/globals.css`)**:
   - Implemented signature asymmetric geometry (`border-radius: [T] [T] [T] 0px` — top-left, top-right, bottom-right rounded; bottom-left sharp).
   - Exported custom utility classes: `.cymbal-box-lg` (`20px 20px 20px 0px`), `.cymbal-box-md` (`12px 12px 12px 0px`), `.cymbal-btn-primary` (`10px 10px 10px 0px`), `.cymbal-tag`, `.cymbal-stamp` (`6px 6px 6px 0px`), and authentic British yellow reg plate `.cymbal-plate` (`8px 8px 8px 0px`).
   - Defined obsidian canvas (`#060913`), dark slate flat surfaces (`#0c1222`, `#111a30`), wire borders (`#1e293b`, `#0284c7`), electric cyan accents (`#38bdf8`), and hard brutalist drop shadows (`4px 4px 0px #020617`).
3. **Complete Surface Rollout Across 8 Modules**:
   - **Header & Navbar** (`Navbar.tsx`): Flat dark slate container, asymmetric depot switcher, monospace cart counter.
   - **Footer & Audit Bar** (`Footer.tsx`): Telemetry indicator, depot contact matrix, revision watermark.
   - **Homepage & Search** (`page.tsx`, `TyreSearchWidget.tsx`): Obsidian hero, yellow reg plate box, wire dimension dropdowns.
   - **Catalog & Product Details** (`shop/page.tsx`, `product/[id]/page.tsx`): Asymmetric filter sidebar, EU rating badges, bay fitting choice selector.
   - **Modals & Overlays** (`StoreSelectorModal.tsx`, `IntentModal.tsx`, `BuyingAssistantModal.tsx`): High-contrast modal frames, pre-authorization telemetry chips, grounded AI insights.
   - **Basket & Checkout** (`cart/page.tsx`, `checkout/page.tsx`): 4-stage UCP checkout stepper, monospace pricing breakdowns, AP2 agent wallet simulation.
   - **Operations & Incidents** (`manager/page.tsx`, `manager/incidents/[id]/page.tsx`): Live regional telemetry grid, SHA-256 immutable audit ledger, Places Insights competitive benchmarks.
   - **Demo Controls** (`demo-controls/page.tsx`): Asymmetric event trigger cards with real-time protocol feedback badges.
4. **End-to-End Test & Build Verification**:
   - Unit tests: `theme-tokens.test.ts`, `tour-config.test.ts`, `gchat-cards.test.ts` (13 tests passed).
   - Deterministic policy tests: `ap2-verifier.test.ts`, `verifier-crypto.test.ts`, `commerce-policy.test.ts`, `e2e-agentic-loops.test.ts` (11 tests passed).
   - Commerce protocol tests: `a2a-protocol.test.ts` (3 tests passed).
   - Total TypeScript monorepo: 8 test files, 27 tests passed (100% PASS).
   - Next.js production build: 15/15 static pages compiled with zero errors.

### 💡 The Why
- **Engineering-Grade Aesthetic Authority**: Moving away from generic SaaS templates to a disciplined, wiry neo-brutalist theme reinforces the mechanical precision, cryptographic auditability, and technical depth of the Cymbal Agentic Suite for hackathon judges and enterprise evaluators.

---

## 📅 Session 7: Live Agent Observation Deck & Protocol Chatter Console
- **Date**: 2026-08-24
- **Topic**: Real-Time Protocol Inspector, JSON-RPC & SD-JWT Packet Stream, Full Telemetry Cockpit

### 🎯 The What
1. **Protocol Event Stream Service (`apps/storefront/lib/services/protocolStreamService.ts`)**:
   - Built a deterministic event stream service generating RFC-compliant JSON-RPC 2.0 frames for all 4 agentic loops.
   - Generates simulated cryptographic payloads: AP2 v0.2 `OpenCheckoutMandate` / `ClosedCheckoutMandate` (with `checkout_hash`), `PaymentMandate`, and SD-JWT-VC disclosures (Ed25519, ES256).
   - Supports pub/sub event subscription, auto-streaming ticker, manual event injection, and `.json` telemetry trace exports.
2. **Interactive Live Protocol Chatter Console Component (`apps/storefront/components/LiveProtocolDeck.tsx`)**:
   - Custom terminal console with neo-brutalist styling, monospace feeds, and toggleable CRT green phosphor scanline effects.
   - Filter tabs by Protocol Loop (`ALL`, `LOOP 1 (RECOVERY)`, `LOOP 2 (INVENTORY)`, `LOOP 3 (OPERATIONS)`, `LOOP 4 (ASSISTANT)`, `SD-JWT / CRYPTO`).
   - Deep-dive Packet Inspector modal rendering formatted JSON trees, signature assertions, Key IDs, disclosed claims, and copy-to-clipboard.
3. **Dedicated Full Cockpit Route (`/telemetry`) & Embedded Dock in `/demo-controls`**:
   - Created `/telemetry` providing full-screen protocol inspection, 4-loop architectural notes, and crypto specifications.
   - Embedded a compact dock of `LiveProtocolDeck` directly into `/demo-controls` so simulator triggers immediately display real-time packet traces.
4. **Global Navigation & Status Indicators**:
   - Added glowing `LIVE_TELEMETRY` status badge in `Navbar.tsx` and quick access links in `Footer.tsx`.

### 💡 The Why
- **Protocol Observability for Evaluators**: In agentic AI hackathons, backend agent decisions and A2A negotiations can feel abstract or invisible. Providing a live, interactive protocol observation deck allows judges to directly inspect JSON-RPC message passing, mandate seals, and cryptographic proofs in real time.

---

## 📅 Session 8: Production Google Cloud Run Deployment & Verification Harness
- **Date**: 2026-08-28 - 2026-08-29
- **Topic**: Multi-Service Cloud Run Deployment, Docker Containerization, Automated Smoke Test Harness

### 🎯 The What
1. **Production Docker Containerization**:
   - Built production multi-stage Docker configurations for Next.js 15 Storefront (`apps/storefront/Dockerfile`) and Python 3.11 ADK 2.5 Long Horizon Agent (`services/long-horizon-agent/Dockerfile`).
   - Hardened security with non-root runtime users, clean `.dockerignore` filters, and optimized caching layers.
2. **Automated Cloud Run Deployment Tooling**:
   - Authored cross-platform deployment automation scripts (`scripts/deploy_cloud_run.ps1`, `scripts/deploy_cloud_run.sh`).
   - Configured Cloud Build, artifact registries, and service environment mappings across European GCP regions.
3. **Automated Smoke Test & Health Harness**:
   - Built comprehensive automated smoke test suite in `scripts/smoke_test.py` targeting public probes, authenticated A2A JSON-RPC endpoints, and Next.js Storefront health.
   - Verified live deployed Cloud Run URLs with HTTP 200 checks across all operational surfaces.

### 💡 The Why
- **Instant Reproducibility & Zero-Friction Evaluation**: Hackathon judges can evaluate live, high-availability Cloud Run endpoints immediately without needing local builds or credentials, with automated fallback verification for self-hosting.

---

## 📅 Session 9: Multi-Model Google AI Stack, Publication Architecture Diagrams & Visual Assets
- **Date**: 2026-08-29
- **Topic**: Google AI Models Portfolio (Gemini 3.7 Flash, Gemini 3.7 Thinking, Gemma, Imagen 3, Veo 2, Lyria), High-Res Architecture Diagrams (PNG, PDF, 3D Concepts), Hackathon Pitch Thumbnail

### 🎯 The What
1. **Google AI Models Compliance & Portfolio Documentation (`docs/GOOGLE_AI_MODELS.md`)**:
   - Formally documented full compliance with mandatory Gemini 3.5+ requirement via **Gemini 3.7 Flash** (Long Horizon Orchestrator, ADK 2.5, Storefront Buying Assistant).
   - Documented scoring bonus models: **Gemini 3.7 Pro/Thinking** (Causal incident root cause), **Gemma 2/4** (Zero-exfiltration PII edge filter), **Imagen 3** (Studio tyre visualizer), **Veo 2** (360° vehicle fitment clearance motion), and **Lyria** (Acoustic telemetry sonification).
   - Updated `README.md` and `docs/AGENT_ARCHITECTURE.md` with multi-model capability matrices.
2. **Publication-Grade High-Resolution Architecture Diagrams**:
   - Designed high-contrast dark slate system architecture blueprint (`docs/architecture_diagram.html`).
   - Rendered pixel-perfect 2400x1350 PNG (`docs/assets/architecture_diagram.png`) and vector PDF (`docs/assets/architecture_diagram.pdf`) matching hackathon file submission guidelines.
   - Generated isometric 3D conceptual diagram (`docs/assets/architecture_concept_diagram.jpg`) and multi-model stack graphic (`docs/assets/google_ai_models_stack.jpg`).
3. **Official Hackathon Showcase & Thumbnail Asset**:
   - Generated 16:9 cinematic promotional thumbnail (`docs/assets/thumbnail.jpg`) featuring holographic HUDs, vehicle fitment geometry, and Google ADK 2.5 / Gemini 3.7 badging.

### 💡 The Why
- **Evaluation Clarity & Multi-Model Scoring Dominance**: Ensures judges immediately see that the project fulfills all mandatory model requirements while demonstrating state-of-the-art multimodal usage across text, reasoning, image generation, video motion, privacy guardrails, and audio sonification.


