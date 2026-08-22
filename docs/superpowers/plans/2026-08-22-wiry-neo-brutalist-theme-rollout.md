# Wiry Neo-Brutalist Slate & Cyan Theme Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Roll out the master design system from `design.md` (*Style B: Wiry Neo-Brutalist Slate & Cyan Accent*) across the Cymbal Storefront, Manager Incident Portal, and Demo Controls, establishing the asymmetric sharp bottom-left geometry, flat slate surfaces, 1.5px wireframes, hard offset drop shadows, and monospace audit ledgers.

**Architecture:** Implement core CSS tokens and utility classes in `globals.css`, then apply them modularly to layout navigation, fitment widgets, product cards, detail/catalog views, interactive modals, checkout flows, and manager audit dossiers. Verify with full unit, protocol, and programmatic smoke tests.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide React icons, TypeScript, Vitest / Node test runner.

## Global Constraints
- **Theme Identity**: Wiry Neo-Brutalist Slate & Cyan Accent (from `design.md`).
- **Signature Geometry**: Asymmetric corner rule `border-radius: [T] [T] [T] 0px` (sharp bottom-left) across all containers, inner cards, buttons, badges, and modals.
- **Palette Tokens**: Canvas `#060913`, Surface `#0c1222`, Elevated `#111a30`, Accent focus `#172342`, Wire `#1e293b` & `#0284c7`, Electric cyan `#38bdf8`, Hard shadow `#020617`.
- **No Card Gradients**: Pure flat dark slate fills on cards for maximum typographic clarity; gradients reserved strictly for background mesh.
- **Monospace Telemetry**: Monospace fonts for all numbers, prices, specs, UK registration plates, EU ratings, revision hashes, and audit matrices.
- **Testing Verification**: All automated test suites (`@cymbal/storefront`, `@cymbal/deterministic-policy`, `@cymbal/commerce-protocol`) must pass with zero regressions.

---

### Task 1: Global Tailwind Token & Asymmetric CSS Utility Setup

**Files:**
- Modify: `apps/storefront/app/globals.css`
- Modify: `apps/storefront/app/layout.tsx`
- Test: `apps/storefront/tests/unit/theme-tokens.test.ts`

**Interfaces:**
- Produces: CSS utility classes `.cymbal-box-lg`, `.cymbal-box-md`, `.cymbal-btn-primary`, `.cymbal-btn-secondary`, `.cymbal-tag`, `.cymbal-stamp`, `.cymbal-plate`, and root theme variables.

- [ ] **Step 1: Write unit test for CSS class tokens and theme assertions**

```typescript
// apps/storefront/tests/unit/theme-tokens.test.ts
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Theme Tokens and CSS Utilities in globals.css', () => {
  it('should define the signature asymmetric corner tokens and color palette in globals.css', () => {
    const cssPath = path.resolve(__dirname, '../../app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    expect(cssContent).toContain('.cymbal-box-lg');
    expect(cssContent).toContain('.cymbal-box-md');
    expect(cssContent).toContain('.cymbal-btn-primary');
    expect(cssContent).toContain('.cymbal-tag');
    expect(cssContent).toContain('.cymbal-stamp');
    expect(cssContent).toContain('#060913'); // Canvas
    expect(cssContent).toContain('#0c1222'); // Surface
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @cymbal/storefront test`
Expected: FAIL with missing theme tokens in `globals.css`.

- [ ] **Step 3: Implement core theme variables and utility classes in `globals.css` and `layout.tsx`**

Update `apps/storefront/app/globals.css` with:
```css
@import "tailwindcss";

:root {
  --bg-canvas: #060913;
  --bg-surface: #0c1222;
  --bg-surface-elevated: #111a30;
  --bg-surface-accent: #172342;
  --border-wire: #1e293b;
  --border-wire-focus: #38bdf8;
  --border-wire-accent: #0284c7;
  --cyan-glow: #38bdf8;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;
  --shadow-hard: 4px 4px 0px #020617;
  --shadow-hard-sm: 2px 2px 0px #020617;
  --shadow-hard-btn: 3px 3px 0px #082f49;
}

body {
  background-color: var(--bg-canvas);
  color: var(--text-main);
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

/* Master Asymmetric Corner Classes */
.cymbal-box-lg {
  border-radius: 20px 20px 20px 0px;
  border: 1.5px solid #1e293b;
  background-color: #0c1222;
  box-shadow: 4px 4px 0px #020617;
}

.cymbal-box-md {
  border-radius: 12px 12px 12px 0px;
  border: 1px solid #1e293b;
  background-color: #111a30;
  box-shadow: 2px 2px 0px #020617;
}

.cymbal-btn-primary {
  border-radius: 10px 10px 10px 0px;
  border: 1.5px solid #0284c7;
  background-color: #0284c7;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 3px 3px 0px #082f49;
  transition: all 0.15s ease;
  cursor: pointer;
}
.cymbal-btn-primary:hover {
  background-color: #0369a1;
  border-color: #38bdf8;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #082f49;
}
.cymbal-btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #082f49;
}

.cymbal-btn-secondary {
  border-radius: 10px 10px 10px 0px;
  border: 1.5px solid #1e293b;
  background-color: #080d1a;
  color: #cbd5e1;
  font-weight: 600;
  box-shadow: 2px 2px 0px #020617;
  transition: all 0.15s ease;
  cursor: pointer;
}
.cymbal-btn-secondary:hover {
  border-color: #38bdf8;
  color: #ffffff;
}

.cymbal-tag {
  border-radius: 6px 6px 6px 0px;
  border: 1px solid #1e293b;
  background-color: #080d1a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
}

.cymbal-stamp {
  border-radius: 4px 4px 4px 0px;
  background-color: #f59e0b;
  color: #020617;
  font-family: ui-monospace, monospace;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 6px;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
  display: inline-flex;
  align-items: center;
}

.cymbal-plate {
  background-color: #f59e0b;
  color: #020617;
  font-family: ui-monospace, monospace;
  font-weight: 900;
  border: 2px solid #000000;
  border-radius: 8px 8px 8px 0px;
  box-shadow: 3px 3px 0px #020617;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @cymbal/storefront test`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add apps/storefront/app/globals.css apps/storefront/app/layout.tsx apps/storefront/tests/unit/theme-tokens.test.ts
git commit -m "style: define wiry neo-brutalist theme tokens and asymmetric utility classes"
```

---

### Task 2: Storefront Header, Navbar & Footer Styling

**Files:**
- Modify: `apps/storefront/components/Navbar.tsx`
- Modify: `apps/storefront/components/Footer.tsx`

**Interfaces:**
- Consumes: `.cymbal-box-lg`, `.cymbal-box-md`, `.cymbal-tag`, `.cymbal-stamp` from `globals.css`.
- Produces: Polished dark slate navigation bar with asymmetric depot selector, cart badge, and wiry footer.

- [ ] **Step 1: Update `Navbar.tsx` to the dark flat slate wiry theme**

Update `Navbar.tsx` with:
- Top bar with flat background `bg-[#0c1222]` and bottom border `border-b border-[#1e293b]`.
- Store switcher button in `cymbal-box-md` styling (`border-radius: 8px 8px 8px 0px; background: #111a30; border: 1px solid #1e293b;`).
- Cart button with monospace cyan pill showing quantity and live subtotal (`font-mono text-[#38bdf8]`).
- Category sub-bar with wiry pill filters (`All Tyres`, `Winter Tyres`, `EV Ready`, `Performance`).

- [ ] **Step 2: Update `Footer.tsx` to the dark slate wiry theme**

Update `Footer.tsx` with:
- Flat `#080d1a` background, top border `border-t border-[#1e293b]`.
- Monospace audit stamps, depot network status pill, and AP2 v0.2 / UCP protocol badges.

- [ ] **Step 3: Run storefront tests & verify build**

Run: `pnpm --filter @cymbal/storefront build`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add apps/storefront/components/Navbar.tsx apps/storefront/components/Footer.tsx
git commit -m "style: restyle Navbar and Footer with wiry dark slate and asymmetric accents"
```

---

### Task 3: Homepage & Tyre Search Fitment Widget

**Files:**
- Modify: `apps/storefront/app/page.tsx`
- Modify: `apps/storefront/components/TyreSearchWidget.tsx`

**Interfaces:**
- Consumes: `.cymbal-box-lg`, `.cymbal-plate`, `.cymbal-tag`, `.cymbal-stamp`.
- Produces: High-impact homepage hero and wiry dual-mode registration / tyre size lookup.

- [ ] **Step 1: Restyle `TyreSearchWidget.tsx`**

- Container uses `cymbal-box-lg` (`bg-[#0c1222]`, `border-[#1e293b]`, `box-shadow: 4px 4px 0px #020617`).
- Dual tab toggle: Asymmetric tabs (`rounded-t-lg rounded-br-lg rounded-bl-none`).
- Reg Plate tab: Authentic British yellow plate input (`cymbal-plate`) with blue UK badge and uppercase monospace font.
- Size selector tab: Wire inputs for Width, Profile, Rim with cyan focus borders.
- Popular sizes shortcut chips using `.cymbal-tag` (`205/55 R16`, `225/45 R17`, `225/40 R18`).

- [ ] **Step 2: Restyle `app/page.tsx`**

- Hero section on `#060913` with subtle atmospheric cyan radial glow mesh in background.
- Replace any remaining light `bg-slate-50` sections with `#060913` canvas.
- Featured tyres section, service highlights, and fitting depot network cards converted to `cymbal-box-lg`.
- Autonomous agent capability banner with `[INSPECT /_03]` inspection stamp.

- [ ] **Step 3: Run storefront tests & verify build**

Run: `pnpm --filter @cymbal/storefront build`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add apps/storefront/app/page.tsx apps/storefront/components/TyreSearchWidget.tsx
git commit -m "style: apply wiry brutalist styling to homepage hero and TyreSearchWidget"
```

---

### Task 4: Product Card & Tyre Badge System

**Files:**
- Modify: `apps/storefront/components/ProductCard.tsx`
- Modify: `apps/storefront/components/TyreBadge.tsx`
- Modify: `apps/storefront/components/StockStatusBadge.tsx`

**Interfaces:**
- Consumes: `Product` type from commerce context.
- Produces: Asymmetric product cards with flat reflective tyre podium, A+ wet grip score badges, monospace dimensions, and instant booking / AP2 pre-auth buttons.

- [ ] **Step 1: Restyle `TyreBadge.tsx` & `StockStatusBadge.tsx`**

- Replace generic pill styles with `.cymbal-tag`.
- EU Tyre rating badges: Monospace tags for Fuel (`Fuel A`), Wet Grip (`Wet Grip A+`), Noise (`70 dB`).
- Stock status: In Stock (`#022c22` bg, `#10b981` text), Out of Stock (`#2a080c` bg, `#f43f5e` text), Low Stock (`#2a1704` bg, `#f59e0b` text).

- [ ] **Step 2: Restyle `ProductCard.tsx`**

- Container: `cymbal-box-lg` (`border-radius: 20px 20px 20px 0px; border: 1.5px solid #1e293b; background: #0c1222; box-shadow: 4px 4px 0px #020617;`).
- Hover: `border-color: #38bdf8;`.
- Tyre Image Podium: Flat dark `#111a30` podium with bottom wire border `2px solid #0284c7`.
- Monospace price: `font-mono text-xl font-black text-[#38bdf8]`.
- Action CTA: `cymbal-btn-primary` (`⚡ Instant Fitting Booking`) or `Buy when back in stock` (`IntentModal` trigger).

- [ ] **Step 3: Run storefront tests**

Run: `pnpm --filter @cymbal/storefront test`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add apps/storefront/components/ProductCard.tsx apps/storefront/components/TyreBadge.tsx apps/storefront/components/StockStatusBadge.tsx
git commit -m "style: convert ProductCard and TyreBadges to asymmetric wiry slate system"
```

---

### Task 5: Catalog & Product Detail Pages

**Files:**
- Modify: `apps/storefront/app/shop/page.tsx`
- Modify: `apps/storefront/app/product/[id]/page.tsx`

**Interfaces:**
- Produces: Dark wiry catalog filter sidebar, sorting controls, product specifications table, and depot workshop bay scheduler.

- [ ] **Step 1: Restyle `/shop/page.tsx`**

- Filter sidebar: `cymbal-box-lg` container with wiry checkboxes for Brand, Season, Vehicle Type, and Stock availability.
- Active filter chips: Monospace cyan tags with 1-click dismiss.
- Product grid on flat `#060913` canvas.

- [ ] **Step 2: Restyle `/product/[id]/page.tsx`**

- Main tyre preview hero: Large asymmetric container with high-contrast spec breakdown.
- Technical Specs Ledger: Monospace table (`Load Index`, `Speed Rating`, `Rolling Resistance`, `Noise Class`, `Homologation`).
- Workshop Bay Slot Scheduler: Asymmetric calendar/time slot matrix with cyan selection border.
- In-store fitting vs. Mobile van fitting option cards.

- [ ] **Step 3: Verify build**

Run: `pnpm --filter @cymbal/storefront build`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add apps/storefront/app/shop/page.tsx apps/storefront/app/product/[id]/page.tsx
git commit -m "style: update shop catalog and product detail pages with wiry slate layout"
```

---

### Task 6: Interactive Modals, Cart & Checkout Flows

**Files:**
- Modify: `apps/storefront/components/StoreSelectorModal.tsx`
- Modify: `apps/storefront/components/IntentModal.tsx`
- Modify: `apps/storefront/components/BuyingAssistantModal.tsx`
- Modify: `apps/storefront/app/cart/page.tsx`
- Modify: `apps/storefront/app/checkout/page.tsx`

**Interfaces:**
- Produces: Center modals with `24px 24px 24px 0px` geometry, hard shadows, wire inputs, and 4-stage UCP checkout.

- [ ] **Step 1: Restyle Modals (`StoreSelectorModal.tsx`, `IntentModal.tsx`, `BuyingAssistantModal.tsx`)**

- Modal frames: `border-radius: 24px 24px 24px 0px; border: 1.5px solid #0284c7; background: #0c1222; box-shadow: 8px 8px 0px #000000;`.
- Store switcher depot cards: Asymmetric selection boxes with bay capacity and live address.
- AP2 Intent Modal: Monospace price tolerance input, timeframe pills (7 / 14 / 30 / 60 days), and pre-authorization cap summary.

- [ ] **Step 2: Restyle `/cart/page.tsx` & `/checkout/page.tsx`**

- Cart items list in wiry slate containers with monospace quantity steppers and subtotal calculations.
- 4-Stage UCP Checkout Stepper: Wire progress bar with numeric step indicators (`1. Vehicle`, `2. Customer`, `3. Bay Slot`, `4. Settlement`).
- Order summary box: Fixed asymmetric card with VAT, fitting fees, and cryptographic checkout hash badge.

- [ ] **Step 3: Run storefront tests & verify build**

Run: `pnpm --filter @cymbal/storefront test`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add apps/storefront/components/StoreSelectorModal.tsx apps/storefront/components/IntentModal.tsx apps/storefront/components/BuyingAssistantModal.tsx apps/storefront/app/cart/page.tsx apps/storefront/app/checkout/page.tsx
git commit -m "style: apply asymmetric wiry design to modals, cart, and 4-stage checkout"
```

---

### Task 7: Manager Portal & Incident Audit Dossiers

**Files:**
- Modify: `apps/storefront/app/manager/page.tsx`
- Modify: `apps/storefront/app/manager/incidents/[id]/page.tsx`
- Modify: `apps/storefront/app/demo-controls/page.tsx`

**Interfaces:**
- Produces: The exact audit ledger structure from the design spec and reference image: large monospace score box (`88 /100 PTS`), 5-column health matrix, policy resolution cards, and operator demo center.

- [ ] **Step 1: Restyle `/manager/incidents/[id]/page.tsx` to match the approved audit ledger**

- Top header: `AUTOCENTRE AUDIT LEDGER • DEPOT INSPECTION` with `[INSPECT /_03]` stamp and `rev b8b58fb` badge.
- Asymmetric Score Box: `border-radius: 12px 12px 12px 0px; border: 1.5px solid #38bdf8; background: #090f20;` rendering `88 /100 PTS`.
- 5-Column Status Matrix:
  - Pass (24, Emerald), Fail (1, Rose), Needs input (3, Amber), Risk (0, Slate), Blocked (0, Slate).
- Policy description box: Wire container displaying deterministic policy actions and A2A protocol audit trail.
- BigQuery & Places Insights evidence dossier cards.

- [ ] **Step 2: Restyle `/manager/page.tsx` and `/demo-controls/page.tsx`**

- Manager dashboard incident queue table with wiry status chips.
- Demo simulator controls: Event triggers (`Stall Checkout`, `Replenish Stock`, `Detractor Review`) with monospace payload viewers and live telemetry event log.

- [ ] **Step 3: Run tests & verify build**

Run: `pnpm --filter @cymbal/storefront build`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add apps/storefront/app/manager/page.tsx apps/storefront/app/manager/incidents/[id]/page.tsx apps/storefront/app/demo-controls/page.tsx
git commit -m "style: align manager incident dossier and demo controls with wiry audit ledger"
```

---

### Task 8: Full Test Suite, Programmatic Smoke Test & Verification

**Files:**
- Test: `@cymbal/deterministic-policy` unit tests
- Test: `@cymbal/commerce-protocol` unit tests
- Test: `@cymbal/storefront` unit tests
- Test: `services/long-horizon-agent` python guardrails
- Test: `scripts/smoke_test.py`

**Interfaces:**
- Produces: 100% passing automated verification output matching the competition judging standard.

- [ ] **Step 1: Run Deterministic Policy & Protocol Tests**

```bash
pnpm --filter @cymbal/deterministic-policy test
pnpm --filter @cymbal/commerce-protocol test
```
Expected: All tests PASS.

- [ ] **Step 2: Run Storefront Unit & Component Tests**

```bash
pnpm --filter @cymbal/storefront test
```
Expected: All tests PASS.

- [ ] **Step 3: Run Full Monorepo Build**

```bash
pnpm build
```
Expected: All apps and packages build with zero TypeScript or lint errors.

- [ ] **Step 4: Run Programmatic Smoke Test Harness**

```bash
python scripts/smoke_test.py --target agent --port 8080
```
Expected: Server starts, passes `/healthz` and endpoint probes, handles errors properly, and shuts down cleanly.

- [ ] **Step 5: Commit final rollout**

```bash
git add .
git commit -m "feat: complete rollout of wiry neo-brutalist design system across all surfaces"
```
