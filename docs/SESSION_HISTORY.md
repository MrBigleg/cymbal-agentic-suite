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

## 📅 Session 4: Wiry Neo-Brutalist Theme Rollout & Custom Studio Assets
- **Date**: 2026-08-22
- **Topic**: Frontend Visual Design Overhaul & Real Studio Tyre Assets

### 🎯 The What
1. **Neo-Brutalist Design System**:
   - Defined custom Tailwind utility classes (`cymbal-box`, `cymbal-btn-primary`, `cymbal-btn-secondary`, `cymbal-tag`, `cymbal-badge`).
   - Implemented an asymmetric, technical dark aesthetic (`#0c1222` dark navy, `#1e293b` borders, `#38bdf8` electric blue accents, monospace metric pills).
2. **Custom Tyre Assets & Fitted Wheel Packages**:
   - Replaced generic Unsplash stock photos with high-resolution custom studio tyre cutouts (`ultra-sport-ev.png`, `all-season-pro.png`, `winter-grip-ice.png`, `eco-touring-plus.png`, `all-terrain-heavy.png`).
   - Added interactive "Fitted Wheel & Tyre Package" toggle with realistic alloy wheel overlay visuals.
3. **Restyled Components**:
   - Upgraded `Navbar`, `Footer`, `ProductCard`, `StockStatusBadge`, `TyreBadge`, `Shop` catalog, and `ProductDetail` views.

### 💡 The Why
- **Enterprise Credibility & Visual Polish**: Moving beyond generic ecommerce templates to a distinctive, engineering-grade automotive portal showcases high production quality and brand consistency for Cymbal Tyres.

---

## 📅 Session 5: Driver.js Interactive Multi-Track Tour & Judge Guide Implementation
- **Date**: 2026-08-22
- **Topic**: Guided Navigation, Protocol Walkthroughs & Live Action Triggers

### 🎯 The What
1. **Driver.js v1 Integration & Multi-Track Engine (`apps/storefront/lib/tour-config.ts`)**:
   - Installed `driver.js` in `@cymbal/storefront`.
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
   - Header navigation item trigger for quick access.
4. **Dark Neo-Brutalist Styling (`apps/storefront/app/globals.css`)**:
   - Custom CSS overrides matching the Cymbal brand theme (`#0c1222` dark background, `#38bdf8` cyan borders, monospace protocol badges, solid shadows).
5. **Testing & Verification**:
   - Authored unit test suite `apps/storefront/tests/unit/tour-config.test.ts` (9 unit tests).
   - Verified 100% pass rate across all 13 unit tests and a zero-error Next.js production build (`pnpm --filter @cymbal/storefront build`).

### 💡 The Why
- **Hackathon Evaluation Friction**: Judges have limited time to review complex multi-protocol architectures (ADK 2.5, AP2 v0.2, A2A, UCP, OKF). A guided, interactive tour with live actionable buttons allows any judge to comprehend and test the end-to-end loops in under 2 minutes.
- **Cross-Route Parity**: The system spans customer-facing storefronts, demo simulators, and manager back-offices. A unified cross-route orchestrator bridges these separate views into one continuous story.


