'use client';

import React from 'react';
import Link from 'next/link';
import { LiveProtocolDeck } from '@/components/LiveProtocolDeck';
import {
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

export default function TelemetryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="cymbal-box-lg p-6 sm:p-8 bg-[#0a0f1d] border-[#1e293b] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="cymbal-stamp bg-emerald-400 text-[#020617] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#020617] animate-ping" />
                ADK 2.5 TELEMETRY
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                CYMBAL COMMERCE AGENTIC ENGINE
              </span>
              <span className="cymbal-tag text-purple-400 border-purple-500/30 bg-purple-500/10">
                AP2 v0.2 MANDATES
              </span>
              <span className="cymbal-tag text-[#38bdf8] border-[#0284c7]/30 bg-[#0284c7]/10">
                A2A JSON-RPC 2.0
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Activity className="w-7 h-7 text-[#38bdf8]" />
              Live Agent Observation Deck
            </h1>

            <p className="text-sm font-mono text-slate-300 max-w-3xl leading-relaxed">
              Centralized judge cockpit streaming real-time protocol chatter across all 4 autonomous commerce loops. Inspect JSON-RPC 2.0 envelopes, AP2 mandate transitions, Ed25519/ES256 signatures, and Selective Disclosure JWT (SD-JWT) verifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/demo-controls"
              className="cymbal-btn-primary px-4 py-2 text-xs flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Operator Demo Controls</span>
            </Link>
            <Link
              href="/manager"
              className="cymbal-btn-secondary px-3 py-2 text-xs flex items-center gap-1.5"
            >
              <span>Manager Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Loop Architecture Quick Map */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#1e293b]">
          {/* Loop 1 */}
          <div className="cymbal-box-md p-3.5 bg-[#060913] border-[#0284c7]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="cymbal-stamp bg-[#0284c7] text-white text-[9px]">LOOP 1</span>
              <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
            </div>
            <h3 className="font-bold text-white text-xs">Stalled Cart Recovery</h3>
            <p className="text-[11px] text-slate-400 font-mono leading-tight">
              15m inactivity detection ➔ Long Horizon Policy evaluation ➔ A2A JSON-RPC 5% discount offer.
            </p>
          </div>

          {/* Loop 2 */}
          <div className="cymbal-box-md p-3.5 bg-[#060913] border-purple-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="cymbal-stamp bg-purple-600 text-white text-[9px]">LOOP 2</span>
              <Layers className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-xs">Stock Intent Matcher</h3>
            <p className="text-[11px] text-slate-400 font-mono leading-tight">
              Depot stock arrival ➔ Deterministic match ➔ AP2 OpenMandate converted to ClosedMandate with checkout_hash.
            </p>
          </div>

          {/* Loop 3 */}
          <div className="cymbal-box-md p-3.5 bg-[#060913] border-rose-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="cymbal-stamp bg-rose-600 text-white text-[9px]">LOOP 3</span>
              <Activity className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h3 className="font-bold text-white text-xs">Detractor Escalation</h3>
            <p className="text-[11px] text-slate-400 font-mono leading-tight">
              Post-service NPS ≤ 6 ➔ Review link suppressed ➔ Interactive card dispatched to Google Chat.
            </p>
          </div>

          {/* Loop 4 */}
          <div className="cymbal-box-md p-3.5 bg-[#060913] border-emerald-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="cymbal-stamp bg-emerald-600 text-white text-[9px]">LOOP 4</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-xs">AI Buying Assistant</h3>
            <p className="text-[11px] text-slate-400 font-mono leading-tight">
              Gemini 3.7 Flash grounded consultation ➔ UK vehicle reg fitment ➔ Workshop bay schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Live Protocol Chatter Console */}
      <LiveProtocolDeck showHeader={true} />

      {/* Protocol Architecture & Cryptographic Specs Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AP2 v0.2 Protocol Specifications */}
        <div className="cymbal-box-lg p-6 bg-[#0a0f1d] border-[#1e293b] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              AP2 v0.2 Autonomous Purchasing Protocol
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 font-mono">
            <div className="p-3 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none space-y-1.5">
              <div className="text-[#38bdf8] font-bold">1. OpenCheckoutMandate</div>
              <p className="text-slate-400 text-[11px]">
                Issued by the user with bounding constraints (<code className="text-amber-300">maxAmount</code>, <code className="text-amber-300">allowedMerchants: [&quot;cymbal-tyres-uk&quot;]</code>, and <code className="text-amber-300">expiresAt</code>). Pre-authorizes autonomous execution when out-of-stock inventory arrives.
              </p>
            </div>

            <div className="p-3 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none space-y-1.5">
              <div className="text-purple-400 font-bold">2. ClosedCheckoutMandate</div>
              <p className="text-slate-400 text-[11px]">
                Produced upon stock replenishment. Deterministic matching binds the Open Mandate to exact stock pricing, computing cryptographic <code className="text-amber-300">checkout_hash</code>. Signed by Buyer Agent using Ed25519.
              </p>
            </div>

            <div className="p-3 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none space-y-1.5">
              <div className="text-emerald-400 font-bold">3. PaymentMandate & Settlement</div>
              <p className="text-slate-400 text-[11px]">
                Payment processor asserts cryptographic integrity of <code className="text-amber-300">checkout_hash</code> matching the sealed ClosedMandate before charging funds.
              </p>
            </div>
          </div>
        </div>

        {/* SD-JWT & A2A Cryptographic Proof */}
        <div className="cymbal-box-lg p-6 bg-[#0a0f1d] border-[#1e293b] space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              SD-JWT Selective Disclosure & A2A Security
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 font-mono">
            <div className="p-3 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none space-y-1.5">
              <div className="text-amber-400 font-bold">Selective Disclosure JWT (IETF SD-JWT)</div>
              <p className="text-slate-400 text-[11px]">
                Allows the Buyer Agent to prove authorization limit and verified identity to the merchant without revealing sensitive payment PANs or raw credit card data to unauthorized intermediaries.
              </p>
            </div>

            <div className="p-3 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none space-y-1.5">
              <div className="text-[#38bdf8] font-bold">A2A JSON-RPC 2.0 Negotiation</div>
              <p className="text-slate-400 text-[11px]">
                Agent-to-Agent message envelopes encapsulate structured intent negotiation (<code className="text-amber-300">commerce.recovery.offer</code> and <code className="text-amber-300">inventory.intent.ready</code>) with strict schema validation.
              </p>
            </div>

            <div className="p-3 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none space-y-1.5">
              <div className="text-emerald-400 font-bold">Deterministic Policy Verification</div>
              <p className="text-slate-400 text-[11px]">
                Strict mathematical guardrails enforce discount limits (max 5%), TTL expiration (2h), and price tolerance rules without non-deterministic hallucinations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
