"use client";

import React, { useState } from "react";
import { Play, Sparkles, AlertTriangle, ShoppingCart, PackageCheck, CheckCircle2 } from "lucide-react";

export default function DemoControlsPage() {
  const [activeTab, setActiveTab] = useState<"cart" | "stock" | "survey">("cart");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const triggerCartStalling = () => {
    setStatusMessage("⚡ Dispatched `commerce.checkout.stalled` -> Long Horizon evaluated RecoveryOfferPolicy (5% discount, 2h TTL) -> A2A `commerce.recovery.offer` sent to Buyer Agent.");
  };

  const triggerStockReplenish = () => {
    setStatusMessage("📦 Dispatched `inventory.replenished` (Depot #101) -> Deterministic Matcher matched Open Checkout Mandate -> Signed Checkout JWT generated & Closed Mandate verified with `checkout_hash`.");
  };

  const triggerSurveyDetractor = () => {
    setStatusMessage("⚠️ Dispatched `customer.survey.submitted` (Score: 2/10) -> Dispatched neutral Google Review link -> Posted interactive card to Manager's Google Chat with in-place action buttons.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-900">Hackathon Live Demo Control Center</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Simulate real-time events across the 3 autonomous customer lifecycle loops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={triggerCartStalling}
          className="p-5 border rounded-xl bg-white hover:border-blue-500 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <Play className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">1. Stalled Cart (15m Inactivity)</h3>
          <p className="text-xs text-gray-500">Triggers A2A negotiation, 5% discount recovery offer, and AP2 Cart Mandate prompt.</p>
        </button>

        <button
          onClick={triggerStockReplenish}
          className="p-5 border rounded-xl bg-white hover:border-purple-500 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <PackageCheck className="w-6 h-6 text-purple-600" />
            <Play className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">2. OOS Stock Arrival</h3>
          <p className="text-xs text-gray-500">Triggers deterministic intent match, merchant JWT signing, and AP2 `checkout_hash` settlement.</p>
        </button>

        <button
          onClick={triggerSurveyDetractor}
          className="p-5 border rounded-xl bg-white hover:border-red-500 hover:shadow-md transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <Play className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">3. Detractor Survey (2/10)</h3>
          <p className="text-xs text-gray-500">Sends neutral review link & posts in-place actionable escalation card to Google Chat.</p>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-blue-900 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Event Dispatched & Protocol Handled
          </div>
          <p className="text-xs text-blue-800 font-mono">{statusMessage}</p>
        </div>
      )}
    </div>
  );
}
