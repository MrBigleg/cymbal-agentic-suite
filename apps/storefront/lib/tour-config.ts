export interface TourAction {
  label: string;
  actionId: string;
}

export interface TourStepConfig {
  id: string;
  selector: string;
  route: string;
  title: string;
  protocolBadge?: string;
  description: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  action?: TourAction;
}

export interface TourTrack {
  id: 'judge' | 'customer' | 'manager';
  name: string;
  tagline: string;
  badge: string;
  steps: TourStepConfig[];
}

export const TOUR_TRACKS: Record<string, TourTrack> = {
  judge: {
    id: 'judge',
    name: 'Judge Architecture Tour',
    tagline: '6-Step End-to-End Agentic Customer Loops & Protocols',
    badge: 'HACKATHON EVALUATOR',
    steps: [
      {
        id: 'judge-step-1-depot',
        selector: '[data-tour="depot-selector"]',
        route: '/',
        title: 'Depot Scoping & OKF Competitive Graph',
        protocolBadge: 'OKF PROTOCOL',
        description:
          'Autonomous agents dynamically bind pricing, live stock, and competitor review sentiment to the selected physical depot using the Open Knowledge Format (OKF) store graph.',
        position: 'bottom',
      },
      {
        id: 'judge-step-2-ai-assistant',
        selector: '[data-tour="ai-assistant-btn"]',
        route: '/',
        title: 'Gemini-Grounded Buying Assistant',
        protocolBadge: 'GOOGLE ADK 2.5',
        description:
          'Grounds tyre recommendations in live vehicle fitment, driving profiles, and depot stock using Gemini 3.7 Flash with delimiter-isolated prompt defenses.',
        position: 'bottom',
        action: {
          label: '⚡ Open AI Assistant',
          actionId: 'OPEN_AI_ASSISTANT',
        },
      },
      {
        id: 'judge-step-3-shop',
        selector: '[data-tour="shop-catalog-hero"]',
        route: '/shop',
        title: 'AP2 Intent Mandates (OOS Pre-Authorization)',
        protocolBadge: 'AP2 v0.2',
        description:
          'When tyres are out-of-stock, consumer shopping agents issue cryptographically signed IntentMandates. Upon depot stock arrival, deterministic matching executes settlement autonomously.',
        position: 'bottom',
      },
      {
        id: 'judge-step-4-cart',
        selector: '[data-tour="cart-container"]',
        route: '/cart',
        title: 'A2A Stalled Cart Recovery & SD-JWT Mandates',
        protocolBadge: 'A2A + UCP',
        description:
          'Stalled UCP sessions (15m inactivity) trigger merchant-to-buyer A2A negotiation. The merchant issues a signed SD-JWT-VC CartMandate locking a 5% discount (capped at £35 with 2h TTL) to prevent replay attacks.',
        position: 'top',
      },
      {
        id: 'judge-step-5-demo-controls',
        selector: '[data-tour="demo-controls-container"]',
        route: '/demo-controls',
        title: 'Deterministic Engine & Protocol Event Simulator',
        protocolBadge: 'EVENT SIMULATOR',
        description:
          'Evaluate the 3 core autonomous loops in real time: simulate Stalled Carts, OOS Inventory Replenishment, and Detractor Survey submissions with immediate protocol feedback.',
        position: 'bottom',
        action: {
          label: '📦 Simulate Stock Arrival',
          actionId: 'TRIGGER_STOCK_REPLENISH',
        },
      },
      {
        id: 'judge-step-6-manager',
        selector: '[data-tour="manager-incident-dossier"]',
        route: '/manager/incidents/inc_001',
        title: 'Closed-Loop HITL Escalation & Google Chat',
        protocolBadge: 'HITL + GBP',
        description:
          'Detractor feedback combines BigQuery regional NPS anomaly data with Places Insights sentiment into an incident dossier, dispatching interactive in-place action cards to Google Chat.',
        position: 'bottom',
      },
    ],
  },

  customer: {
    id: 'customer',
    name: 'Customer Experience Tour',
    tagline: 'Explore Tyre Sizing, Fitting & AI Assistance',
    badge: 'SHOPPER ONBOARDING',
    steps: [
      {
        id: 'customer-step-1-depot',
        selector: '[data-tour="depot-selector"]',
        route: '/',
        title: '1. Select Your Local Depot',
        protocolBadge: 'LOCAL INVENTORY',
        description:
          'Choose your nearest Cymbal Tyres depot for real-time stock availability, local fitting appointments, and certified technicians.',
        position: 'bottom',
      },
      {
        id: 'customer-step-2-search',
        selector: '[data-tour="hero-search-widget"]',
        route: '/',
        title: '2. Search by Tyre Size or Reg',
        protocolBadge: 'FITMENT SEARCH',
        description:
          'Enter tyre dimensions (e.g. 225/45 R17) or select quick popular sizes to find guaranteed OEM compatible tyres.',
        position: 'bottom',
      },
      {
        id: 'customer-step-3-assistant',
        selector: '[data-tour="ai-assistant-btn"]',
        route: '/',
        title: '3. AI Buying Assistant',
        protocolBadge: 'AI ADVISOR',
        description:
          'Not sure what you need? Consult our Gemini-powered assistant for wet-grip ratings, EV-specific tyres, and seasonal advice.',
        position: 'bottom',
        action: {
          label: '✨ Try AI Assistant',
          actionId: 'OPEN_AI_ASSISTANT',
        },
      },
      {
        id: 'customer-step-4-cart',
        selector: '[data-tour="cart-nav-icon"]',
        route: '/',
        title: '4. Cart & Instant Booking',
        protocolBadge: 'FAST CHECKOUT',
        description:
          'Review selected tyres, choose optional fitted alloy wheel packages, and schedule your fitting appointment in minutes.',
        position: 'left',
      },
    ],
  },

  manager: {
    id: 'manager',
    name: 'Store Manager & HITL Tour',
    tagline: 'Incident Dossiers, Anomaly Detection & Operations',
    badge: 'OPERATIONS SUITE',
    steps: [
      {
        id: 'manager-step-1-metrics',
        selector: '[data-tour="incident-metrics-panel"]',
        route: '/manager/incidents/inc_001',
        title: '1. BigQuery NPS Anomaly Alert',
        protocolBadge: 'BIGQUERY ML',
        description:
          'Automated anomaly detection identifies localized sentiment dips (e.g. Depot #101 down 24% vs regional baseline) following customer survey submissions.',
        position: 'bottom',
      },
      {
        id: 'manager-step-2-insights',
        selector: '[data-tour="sentiment-insights-panel"]',
        route: '/manager/incidents/inc_001',
        title: '2. Places Insights Competitor Benchmark',
        protocolBadge: 'PLACES API',
        description:
          'Autonomous agent correlates customer reviews against regional competitor graphs, diagnosing root causes like curbside pickup delays or fitting bay bottlenecks.',
        position: 'bottom',
      },
      {
        id: 'manager-step-3-actions',
        selector: '[data-tour="hitl-action-buttons"]',
        route: '/manager/incidents/inc_001',
        title: '3. In-Place Google Chat Resolution',
        protocolBadge: 'GOOGLE CHAT CARDS',
        description:
          'Store managers resolve escalations in seconds with 1-click in-place action buttons directly synchronized with connected Google Chat spaces.',
        position: 'top',
      },
    ],
  },
};
