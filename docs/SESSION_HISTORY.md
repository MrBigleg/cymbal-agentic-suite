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
