"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Sparkles, AlertTriangle, ShoppingCart, PackageCheck, CheckCircle2, Sliders, Terminal, ExternalLink } from "lucide-react";
import { LiveProtocolDeck } from "@/components/LiveProtocolDeck";
import { protocolStreamService } from "@/lib/services/protocolStreamService";

export default function DemoControlsPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const triggerCartStalling = () => {
    setStatusMessage("⚡ Dispatched `commerce.checkout.stalled` -> Long Horizon evaluated RecoveryOfferPolicy (5% discount, 2h TTL) -> A2A `commerce.recovery.offer` sent to Buyer Agent.");
    protocolStreamService.triggerManualSimulation('STALLED_CART');
  };

  const triggerStockReplenish = () => {
    setStatusMessage("📦 Dispatched `inventory.replenished` (Depot #101) -> Deterministic Matcher matched Open Checkout Mandate -> Signed Checkout JWT generated & Closed Mandate verified with `checkout_hash`.");
    protocolStreamService.triggerManualSimulation('STOCK_ARRIVAL');
  };

  const triggerSurveyDetractor = () => {
    setStatusMessage("⚠️ Dispatched `customer.survey.submitted` (Score: 2/10) -> Dispatched neutral Google Review link -> Posted interactive card to Manager's Google Chat with in-place action buttons.");
    protocolStreamService.triggerManualSimulation('SURVEY_DETRACTOR');
  };

  useEffect(() => {
    const handleTourAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ actionId: string }>;
      if (customEvent.detail?.actionId === "TRIGGER_STOCK_REPLENISH") {
        triggerStockReplenish();
      }
    };
    window.addEventListener("cymbal-tour-action", handleTourAction);
    return () => window.removeEventListener("cymbal-tour-action", handleTourAction);
  }, []);

  return (
    <div data-tour="demo-controls-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="cymbal-box-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="cymbal-stamp bg-amber-400 text-[#020617]">LIVE SIMULATOR</span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
              AGENTIC PROTOCOL TRIGGERS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase mt-1 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#38bdf8]" />
            Competition Live Demo Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Simulate real-time events across the 3 autonomous customer lifecycle loops and inspect protocol chatter.
          </p>
        </div>

        <Link
          href="/telemetry"
          className="cymbal-btn-primary px-3.5 py-2 text-xs flex items-center gap-2 shrink-0 font-mono"
        >
          <Terminal className="w-4 h-4 text-[#38bdf8]" />
          <span>Full Observation Deck</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Simulator Trigger Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={triggerCartStalling}
          className="cymbal-box-lg p-5 text-left space-y-3 hover:border-[#0284c7] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#0284c7] flex items-center justify-center text-[#38bdf8]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <Play className="w-4 h-4 text-slate-500 group-hover:text-[#38bdf8] transition-colors" />
          </div>
          <div>
            <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b] text-[9px]">
              LOOP 1 • CHECKOUT
            </span>
            <h3 className="font-bold text-white text-sm mt-1">1. Stalled Cart (15m Inactivity)</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Triggers A2A negotiation, 5% discount recovery offer, and AP2 Cart Mandate prompt.
          </p>
        </button>

        <button
          onClick={triggerStockReplenish}
          className="cymbal-box-lg p-5 text-left space-y-3 hover:border-purple-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-purple-600 flex items-center justify-center text-purple-400">
              <PackageCheck className="w-5 h-5" />
            </div>
            <Play className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div>
            <span className="cymbal-stamp bg-[#111a30] text-purple-400 border border-[#1e293b] text-[9px]">
              LOOP 2 • INVENTORY
            </span>
            <h3 className="font-bold text-white text-sm mt-1">2. OOS Stock Arrival</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Triggers deterministic intent match, merchant JWT signing, and AP2 `checkout_hash` settlement.
          </p>
        </button>

        <button
          onClick={triggerSurveyDetractor}
          className="cymbal-box-lg p-5 text-left space-y-3 hover:border-[#881337] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#881337] flex items-center justify-center text-[#f43f5e]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <Play className="w-4 h-4 text-slate-500 group-hover:text-[#f43f5e] transition-colors" />
          </div>
          <div>
            <span className="cymbal-stamp bg-[#111a30] text-[#f43f5e] border border-[#1e293b] text-[9px]">
              LOOP 3 • OPERATIONS
            </span>
            <h3 className="font-bold text-white text-sm mt-1">3. Detractor Survey (2/10)</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Sends neutral review link & posts in-place actionable escalation card to Google Chat.
          </p>
        </button>
      </div>

      {statusMessage && (
        <div className="cymbal-box-lg p-5 space-y-2 border-[#0284c7] bg-[#0c162d]">
          <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> Event Dispatched & Handled
          </div>
          <p className="text-xs font-mono text-slate-200 leading-relaxed">{statusMessage}</p>
        </div>
      )}

      {/* Embedded Live Protocol Chatter Console */}
      <div className="pt-2">
        <LiveProtocolDeck compact={true} showHeader={false} />
      </div>
    </div>
  );
}

