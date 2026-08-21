"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Clock, MapPin, CheckCircle2, ShieldCheck, TrendingDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IncidentDossierPage() {
  const params = useParams();
  const incidentId = (params?.id as string) || "inc_001";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Link href="/manager" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Multi-Location Dashboard
      </Link>

      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">High Severity</span>
            <h1 className="text-2xl font-bold text-gray-900">Incident Dossier: {incidentId}</h1>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" /> Birmingham Central Autocentre (Depot #101) &bull; <Clock className="w-4 h-4" /> Escalated via Google Chat
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Mark Resolved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Incident Context */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> 1. Survey & Customer Context
          </h2>
          <div>
            <span className="text-xs text-gray-400">CUSTOMER</span>
            <p className="text-sm font-medium text-gray-800">driver.johnson@example.com</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">NPS RATING</span>
            <p className="text-3xl font-black text-red-600">2 / 10</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">CUSTOMER FEEDBACK</span>
            <blockquote className="text-sm italic text-gray-600 border-l-2 border-red-400 pl-2 mt-1">
              "Fitting bay delayed by 45 minutes past my booked slot. Counter staff were overwhelmed."
            </blockquote>
          </div>
          <div className="pt-2 border-t">
            <span className="text-xs text-gray-400">PUBLIC REVIEW STATUS</span>
            <p className="text-xs text-gray-700 mt-0.5">Neutral Google Review link dispatched (un-gated policy).</p>
          </div>
        </div>

        {/* Evidence Stack: Places Insights & BigQuery */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-500" /> 2. External Evidence & Benchmarks
          </h2>
          <div className="space-y-2">
            <span className="text-xs text-gray-400">PLACES INSIGHTS (BIRMINGHAM CLUSTER)</span>
            <div className="text-xs text-gray-600 space-y-1">
              <p>&bull; Local Competitor Avg Rating: <b>4.3★</b> (vs Depot #101: <b>4.1★</b>)</p>
              <p>&bull; Competitor Review Volume: <b>380 reviews / mo</b></p>
              <p>&bull; Maps Grounding Sentiment: Competitors lead on <i>wait time</i>.</p>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t">
            <span className="text-xs text-gray-400">BIGQUERY REGIONAL ANOMALY</span>
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200">
              Depot #101 slot delay is <b>+32% above regional baseline</b> during Saturday peak hours.
            </p>
          </div>
        </div>

        {/* Action History & Immutable Audit Ledger */}
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> 3. Action History & Audit Log
          </h2>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex gap-2">
              <span className="text-gray-400 font-mono">14:10</span>
              <span>Survey submitted (Rating: 2/10)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 font-mono">14:11</span>
              <span>Long Horizon generated incident dossier</span>
            </div>
            <div className="flex gap-2 text-blue-600 font-medium">
              <span className="text-gray-400 font-mono">14:12</span>
              <span>Interactive card posted to Google Chat</span>
            </div>
            <div className="flex gap-2 text-green-600 font-medium">
              <span className="text-gray-400 font-mono">14:15</span>
              <span>Manager clicked [Investigate] in Google Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
