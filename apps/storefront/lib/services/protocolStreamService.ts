import { eventPublisher } from './mockCommerceService';
import { DomainEvent } from '@/lib/types/commerce';
import {
  A2AEnvelope,
  buildCommerceRecoveryOfferMessage,
  buildInventoryIntentReadyMessage,
  OpenCheckoutMandate,
  ClosedCheckoutMandate,
  PaymentMandate,
} from '@cymbal/commerce-protocol';

export type ProtocolLoop =
  | 'LOOP_1_RECOVERY'
  | 'LOOP_2_INVENTORY'
  | 'LOOP_3_OPERATIONS'
  | 'LOOP_4_ASSISTANT'
  | 'CRYPTO_SECURITY'
  | 'SYSTEM';

export type PacketSeverity =
  | 'INFO'
  | 'DISPATCH'
  | 'A2A_NEGOTIATION'
  | 'MANDATE_SEALED'
  | 'SD_JWT_VERIFIED'
  | 'WARN'
  | 'ERROR';

export interface TelemetryPacket {
  id: string;
  timestamp: string;
  loop: ProtocolLoop;
  severity: PacketSeverity;
  sourceAgent: string;
  targetAgent: string;
  protocol: 'JSON-RPC 2.0' | 'AP2 v0.2' | 'SD-JWT / VC' | 'ADK-2.5';
  action: string;
  summary: string;
  latencyMs: number;
  payload: Record<string, any>;
  cryptoProof?: {
    algorithm: string;
    keyId: string;
    signature: string;
    digest: string;
    verified: boolean;
    disclosedClaims?: string[];
  };
}

type PacketListener = (packet: TelemetryPacket) => void;

class ProtocolStreamService {
  private listeners: Set<PacketListener> = new Set();
  private packets: TelemetryPacket[] = [];
  private isAutoStreaming = false;
  private autoStreamTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSeedPackets();
      this.subscribeToDomainEvents();
    }
  }

  private initSeedPackets() {
    const now = Date.now();
    const seeds: TelemetryPacket[] = [
      {
        id: `pkt_${now - 120000}`,
        timestamp: new Date(now - 120000).toISOString(),
        loop: 'SYSTEM',
        severity: 'INFO',
        sourceAgent: 'SYSTEM_BOOTSTRAP',
        targetAgent: 'ALL_BUS_LISTENERS',
        protocol: 'ADK-2.5',
        action: 'adk.bus.initialized',
        summary: 'ADK Commerce Telemetry Subsystem active. Connected to Google Cloud Vertex & PubSub transport.',
        latencyMs: 12,
        payload: {
          runtime: 'Node.js 20 / Next.js 15',
          adkVersion: '2.5.0',
          agents: ['long-horizon-agent', 'storefront-buyer-agent', 'inventory-matcher', 'support-escalator'],
          transport: 'In-Memory LocalPubSub / BroadcastChannel',
        },
      },
      {
        id: `pkt_${now - 85000}`,
        timestamp: new Date(now - 85000).toISOString(),
        loop: 'LOOP_1_RECOVERY',
        severity: 'A2A_NEGOTIATION',
        sourceAgent: 'LONG_HORIZON_CONTROLLER',
        targetAgent: 'BUYER_AGENT_SESSION_BHM_01',
        protocol: 'JSON-RPC 2.0',
        action: 'a2a.task.dispatch (commerce.recovery.offer)',
        summary: 'Stalled checkout detected (15m idle). Emitted dynamic 5% recovery discount offer with 2h TTL.',
        latencyMs: 44,
        payload: buildCommerceRecoveryOfferMessage({
          checkoutId: 'chk_bhm_99182',
          offerId: 'rec_off_5pct_2026',
          discountPercent: 5,
          discountAmountGbp: 14.99,
          expiresAt: new Date(now + 7200000).toISOString(),
          checkoutRevisionId: 'rev_02_rec_applied',
        }),
        cryptoProof: {
          algorithm: 'ES256',
          keyId: 'keys/merchant-signing-key-2026',
          signature: 'MEYCIQD7eP9...8xN12kQ4e9zW_cYMbal_s1gn',
          digest: 'sha256:4b22c7a911e3b6a032df51a7e44',
          verified: true,
          disclosedClaims: ['discountPercent', 'expiresAt', 'checkoutId'],
        },
      },
      {
        id: `pkt_${now - 45000}`,
        timestamp: new Date(now - 45000).toISOString(),
        loop: 'LOOP_2_INVENTORY',
        severity: 'MANDATE_SEALED',
        sourceAgent: 'INVENTORY_MATCHER_DEPOT_101',
        targetAgent: 'AP2_MANDATE_SETTLEMENT_ENGINE',
        protocol: 'AP2 v0.2',
        action: 'ap2.mandate.closed_intent_match',
        summary: 'Depot Birmingham replenished 4x Michelin Pilot Sport 5. Deterministic matcher bound OpenCheckoutMandate to ClosedCheckoutMandate.',
        latencyMs: 31,
        payload: {
          openMandateId: 'man_opn_882914_bhm',
          closedMandateId: 'man_cls_100293_bhm',
          sku: 'michelin-ps5-225-45r17',
          matchedQuantity: 4,
          unitPriceGbp: 142.50,
          totalAmountGbp: 570.00,
          checkout_hash: '0x9a8f2c3d4e5b6a71829304958671829304958671',
          settlementStatus: 'PRE_AUTHORIZED_MATCHED',
        },
        cryptoProof: {
          algorithm: 'Ed25519',
          keyId: 'did:key:z6MkuV8...CymbalDepotBHM',
          signature: 'ed_sig_39f0a218d...8849bca001192',
          digest: 'sha256:0x9a8f2c3d4e5b6a71829304958671829304958671',
          verified: true,
        },
      },
      {
        id: `pkt_${now - 15000}`,
        timestamp: new Date(now - 15000).toISOString(),
        loop: 'LOOP_3_OPERATIONS',
        severity: 'DISPATCH',
        sourceAgent: 'OPS_INCIDENT_ESCALATOR',
        targetAgent: 'GOOGLE_CHAT_WEBHOOK_DEPOT_BHM',
        protocol: 'JSON-RPC 2.0',
        action: 'gchat.card.dispatch',
        summary: 'Detractor survey (2/10 NPS) auto-escalated. Interactive resolution card posted to Depot Manager channel.',
        latencyMs: 68,
        payload: {
          orderId: 'ORD-98213-BHM',
          customerName: 'Marcus Vance',
          score: 2,
          sentiment: 'NEGATIVE_HIGH_URGENCY',
          comment: 'Fitting took 45 minutes past my slot due to bay blockage.',
          interactiveActions: ['REASSIGN_BAY_CREDIT_20', 'SCHEDULE_MANAGER_CALL', 'DISPATCH_COURTESY_VALET'],
          channel: 'spaces/AAAADepotManagersBHM/messages',
        },
      },
    ];

    this.packets = seeds;
  }

  private subscribeToDomainEvents() {
    eventPublisher.subscribe((event: DomainEvent) => {
      this.handleDomainEvent(event);
    });
  }

  private handleDomainEvent(event: DomainEvent) {
    const now = Date.now();
    let packet: TelemetryPacket | null = null;

    if (event.eventType.includes('checkout.stalled')) {
      packet = {
        id: `pkt_${now}`,
        timestamp: new Date().toISOString(),
        loop: 'LOOP_1_RECOVERY',
        severity: 'A2A_NEGOTIATION',
        sourceAgent: 'LONG_HORIZON_CONTROLLER',
        targetAgent: 'BUYER_AGENT',
        protocol: 'JSON-RPC 2.0',
        action: 'a2a.task.dispatch (commerce.recovery.offer)',
        summary: `Stalled cart recovery triggered for checkout ${event.payload?.checkoutId || 'chk_live'}. Emitted 5% discount A2A offer.`,
        latencyMs: Math.floor(Math.random() * 35) + 20,
        payload: buildCommerceRecoveryOfferMessage({
          checkoutId: event.payload?.checkoutId || `chk_${Date.now()}`,
          offerId: `rec_off_${Date.now().toString(36)}`,
          discountPercent: 5,
          discountAmountGbp: 14.50,
          expiresAt: new Date(now + 7200000).toISOString(),
          checkoutRevisionId: 'rev_live_stalled_recovery',
        }),
        cryptoProof: {
          algorithm: 'ES256',
          keyId: 'keys/cymbal-merchant-signer-v1',
          signature: `sig_${Math.random().toString(36).substr(2, 16)}`,
          digest: `sha256:${Math.random().toString(36).substr(2, 32)}`,
          verified: true,
          disclosedClaims: ['discountPercent', 'expiresAt', 'checkoutId'],
        },
      };
    } else if (event.eventType.includes('inventory.replenished')) {
      packet = {
        id: `pkt_${now}`,
        timestamp: new Date().toISOString(),
        loop: 'LOOP_2_INVENTORY',
        severity: 'MANDATE_SEALED',
        sourceAgent: 'INVENTORY_MATCHER',
        targetAgent: 'AP2_MANDATE_ENGINE',
        protocol: 'AP2 v0.2',
        action: 'ap2.mandate.closed_intent_match',
        summary: `Stock arrival event matched OpenCheckoutMandate. ClosedCheckoutMandate verified with deterministic checkout_hash.`,
        latencyMs: Math.floor(Math.random() * 25) + 15,
        payload: {
          storeId: event.payload?.storeId || 'birmingham',
          productId: event.payload?.productId || 'prod_michelin_ps5',
          quantity: event.payload?.quantity || 4,
          checkout_hash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          settlementStatus: 'CLOSED_MANDATE_VERIFIED',
        },
        cryptoProof: {
          algorithm: 'Ed25519',
          keyId: 'did:key:z6MkuV8...CymbalDepot',
          signature: `ed25519_${Math.random().toString(36).substr(2, 24)}`,
          digest: `sha256:${Math.random().toString(36).substr(2, 32)}`,
          verified: true,
        },
      };
    } else if (event.eventType.includes('survey.submitted')) {
      const isDetractor = (event.payload?.score || 10) <= 6;
      packet = {
        id: `pkt_${now}`,
        timestamp: new Date().toISOString(),
        loop: 'LOOP_3_OPERATIONS',
        severity: isDetractor ? 'WARN' : 'INFO',
        sourceAgent: 'SURVEY_INGESTION_SERVICE',
        targetAgent: isDetractor ? 'GOOGLE_CHAT_OPS_ESCALATOR' : 'CUSTOMER_REVIEW_AGGREGATOR',
        protocol: 'JSON-RPC 2.0',
        action: isDetractor ? 'gchat.card.dispatch (incident_escalation)' : 'review.link.dispatched (promoter)',
        summary: isDetractor
          ? `Detractor survey received (${event.payload?.score}/10). Auto-dispatched resolution card to Depot Manager.`
          : `Promoter survey received (${event.payload?.score}/10). Dispatched Google 5-Star review link to customer.`,
        latencyMs: Math.floor(Math.random() * 40) + 30,
        payload: {
          ...event.payload,
          automatedAction: isDetractor ? 'INCIDENT_CARD_POSTED_GCHAT' : 'GOOGLE_REVIEW_LINK_SENT',
        },
      };
    } else if (event.eventType.includes('assistant')) {
      packet = {
        id: `pkt_${now}`,
        timestamp: new Date().toISOString(),
        loop: 'LOOP_4_ASSISTANT',
        severity: 'INFO',
        sourceAgent: 'GEMINI_BUYING_ASSISTANT',
        targetAgent: 'STOREFRONT_CLIENT',
        protocol: 'ADK-2.5',
        action: 'assistant.grounded_consultation.completed',
        summary: `Gemini 3.7 Flash consultation executed. Grounded against UK depot catalogue & bay fitting schedule.`,
        latencyMs: Math.floor(Math.random() * 80) + 120,
        payload: event.payload,
      };
    }

    if (packet) {
      this.publishPacket(packet);
    }
  }

  public publishPacket(packet: TelemetryPacket) {
    this.packets = [packet, ...this.packets.slice(0, 199)]; // retain latest 200 packets
    this.listeners.forEach((listener) => {
      try {
        listener(packet);
      } catch (err) {
        console.error('Error notifying telemetry listener:', err);
      }
    });
  }

  public getPackets(): TelemetryPacket[] {
    return [...this.packets];
  }

  public subscribe(listener: PacketListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public clearPackets() {
    this.packets = [];
  }

  public triggerManualSimulation(type: 'STALLED_CART' | 'STOCK_ARRIVAL' | 'SURVEY_DETRACTOR' | 'AI_ASSISTANT' | 'SD_JWT_VERIFY') {
    const now = Date.now();
    let packet: TelemetryPacket;

    switch (type) {
      case 'STALLED_CART':
        packet = {
          id: `pkt_man_${now}`,
          timestamp: new Date().toISOString(),
          loop: 'LOOP_1_RECOVERY',
          severity: 'A2A_NEGOTIATION',
          sourceAgent: 'LONG_HORIZON_CONTROLLER',
          targetAgent: 'BUYER_AGENT_CLIENT',
          protocol: 'JSON-RPC 2.0',
          action: 'a2a.task.dispatch (commerce.recovery.offer)',
          summary: '⚡ Simulated Stalled Cart (15m threshold): Evaluated RecoveryOfferPolicy and dispatched A2A 5% discount envelope.',
          latencyMs: 38,
          payload: buildCommerceRecoveryOfferMessage({
            checkoutId: `chk_${now.toString(36)}`,
            offerId: `rec_off_${Date.now().toString(36)}`,
            discountPercent: 5,
            discountAmountGbp: 18.50,
            expiresAt: new Date(now + 7200000).toISOString(),
            checkoutRevisionId: 'rev_sim_applied',
          }),
          cryptoProof: {
            algorithm: 'ES256',
            keyId: 'keys/cymbal-merchant-2026',
            signature: `sig_es256_${Math.random().toString(36).substr(2, 20)}`,
            digest: `sha256:${Math.random().toString(36).substr(2, 32)}`,
            verified: true,
            disclosedClaims: ['discountPercent', 'expiresAt', 'checkoutId'],
          },
        };
        break;

      case 'STOCK_ARRIVAL':
        packet = {
          id: `pkt_man_${now}`,
          timestamp: new Date().toISOString(),
          loop: 'LOOP_2_INVENTORY',
          severity: 'MANDATE_SEALED',
          sourceAgent: 'INVENTORY_MATCHER',
          targetAgent: 'AP2_MANDATE_SETTLEMENT_ENGINE',
          protocol: 'AP2 v0.2',
          action: 'ap2.mandate.closed_intent_match',
          summary: '📦 Simulated OOS Stock Arrival: Deterministic matcher bound Open Mandate to Closed Mandate with cryptographic checkout_hash.',
          latencyMs: 29,
          payload: buildInventoryIntentReadyMessage({
            intentId: `int_${now.toString(36)}`,
            sku: 'continental-premiumcontact-7-225-45r17',
            storeId: 'bristol',
            unitPriceGbp: 135.00,
            totalPriceGbp: 540.00,
            checkoutId: `chk_${now.toString(36)}`,
            checkoutJwt: `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...simulated_checkout_jwt...`,
          }),
          cryptoProof: {
            algorithm: 'Ed25519',
            keyId: 'did:key:z6MkuV8...CymbalBristolDepot',
            signature: `ed25519_${Math.random().toString(36).substr(2, 24)}`,
            digest: `sha256:0x${Math.random().toString(36).substr(2, 32)}`,
            verified: true,
          },
        };
        break;

      case 'SURVEY_DETRACTOR':
        packet = {
          id: `pkt_man_${now}`,
          timestamp: new Date().toISOString(),
          loop: 'LOOP_3_OPERATIONS',
          severity: 'WARN',
          sourceAgent: 'OPS_INCIDENT_ESCALATOR',
          targetAgent: 'GOOGLE_CHAT_WEBHOOK_MANAGER',
          protocol: 'JSON-RPC 2.0',
          action: 'gchat.card.dispatch (incident_escalation)',
          summary: '⚠️ Simulated Detractor Survey (Score: 2/10): Neutral review link suppressed, posted actionable card to Google Chat.',
          latencyMs: 54,
          payload: {
            orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}-BHM`,
            score: 2,
            customerName: 'Sarah Jenkins',
            feedback: 'Waited 30 minutes in the bay due to technician shift change.',
            chatCardActionButtons: [
              { label: 'Issue 20% Courtesy Credit', actionId: 'CREDIT_20' },
              { label: 'Escalate to Area Director', actionId: 'ESCALATE_DIRECTOR' },
            ],
          },
        };
        break;

      case 'AI_ASSISTANT':
        packet = {
          id: `pkt_man_${now}`,
          timestamp: new Date().toISOString(),
          loop: 'LOOP_4_ASSISTANT',
          severity: 'INFO',
          sourceAgent: 'GEMINI_3_7_FLASH',
          targetAgent: 'TYRE_FITMENT_ASSISTANT',
          protocol: 'ADK-2.5',
          action: 'assistant.consultation.completed',
          summary: '✨ Simulated AI Assistant Consultation: Grounded reasoning against vehicle reg (BMW 3 Series) and EV range optimization.',
          latencyMs: 142,
          payload: {
            model: 'gemini-3.7-flash',
            inputPrompt: 'Need durable, low road noise tyres for wet highway commuting on my BMW 320d.',
            groundedRecommendations: [
              { name: 'Michelin Pilot Sport 5', rating: 'Wet A / Fuel B / 72dB', price: '£142.50' },
              { name: 'Goodyear Eagle F1 Asymmetric 6', rating: 'Wet A / Fuel C / 69dB', price: '£128.00' },
            ],
            confidenceScore: 0.96,
          },
        };
        break;

      case 'SD_JWT_VERIFY':
        packet = {
          id: `pkt_man_${now}`,
          timestamp: new Date().toISOString(),
          loop: 'CRYPTO_SECURITY',
          severity: 'SD_JWT_VERIFIED',
          sourceAgent: 'SD_JWT_VERIFIER_ENGINE',
          targetAgent: 'PAYMENT_PROCESSOR_GATEWAY',
          protocol: 'SD-JWT / VC',
          action: 'crypto.sd_jwt.selective_disclosure_verified',
          summary: '🔒 Selective Disclosure JWT Verified: Buyer credential verified with Ed25519 signature while masking private card numbers.',
          latencyMs: 18,
          payload: {
            issuer: 'did:web:auth.cymbaltyres.co.uk',
            holder: 'did:key:z6MkuV8...BuyerWalletClient',
            audience: 'did:web:settlement.cymbaltyres.co.uk',
            disclosedClaims: {
              account_holder_name: 'Marcus Vance',
              authorized_limit_gbp: 750.00,
              mandate_id: 'man_opn_882914_bhm',
            },
            undisclosedClaimsMasked: ['pan_full', 'cvv', 'billing_street'],
            signatureStatus: 'CRYPTOGRAPHICALLY_VALID_ES256',
          },
          cryptoProof: {
            algorithm: 'ES256',
            keyId: 'did:web:auth.cymbaltyres.co.uk#key-1',
            signature: `es256_${Math.random().toString(36).substr(2, 32)}`,
            digest: `sha256:${Math.random().toString(36).substr(2, 32)}`,
            verified: true,
            disclosedClaims: ['account_holder_name', 'authorized_limit_gbp', 'mandate_id'],
          },
        };
        break;
    }

    this.publishPacket(packet);
  }

  public toggleAutoStream(enabled?: boolean): boolean {
    const target = enabled !== undefined ? enabled : !this.isAutoStreaming;
    this.isAutoStreaming = target;

    if (this.autoStreamTimer) {
      clearInterval(this.autoStreamTimer);
      this.autoStreamTimer = null;
    }

    if (this.isAutoStreaming) {
      const actions: Array<'STALLED_CART' | 'STOCK_ARRIVAL' | 'SURVEY_DETRACTOR' | 'AI_ASSISTANT' | 'SD_JWT_VERIFY'> = [
        'STALLED_CART',
        'STOCK_ARRIVAL',
        'SURVEY_DETRACTOR',
        'AI_ASSISTANT',
        'SD_JWT_VERIFY',
      ];
      this.autoStreamTimer = setInterval(() => {
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        this.triggerManualSimulation(randomAction);
      }, 4500);
    }

    return this.isAutoStreaming;
  }

  public isStreaming(): boolean {
    return this.isAutoStreaming;
  }
}

export const protocolStreamService = new ProtocolStreamService();
