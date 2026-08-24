"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Clock, MapPin, CheckCircle2, ShieldCheck, TrendingDown, ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";

export default function IncidentDossierPage() {
  const params = useParams();
  const incidentId = (params?.id as string) || "inc_001";

  return (
    <div data-tour="manager-incident-dossier" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/manager" className="text-xs font-mono text-[#38bdf8] hover:underline flex items-center gap-1.5 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Operations Dashboard
      </Link>

      <div className="cymbal-box-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="cymbal-tag bg-[#2a080c] text-[#f43f5e] border-[#881337] text-[10px] font-bold">
              HIGH SEVERITY
            </span>
            <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">AUDIT LEDGER</span>
            <span className="font-mono text-[10px] text-slate-400">ID: {incidentId}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase mt-1 tracking-tight">
            Incident Dossier & Evidence Stack: {incidentId}
          </h1>
          <p className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" /> Birmingham Central Autocentre (Depot #101) • <Clock className="w-3.5 h-3.5 text-amber-400" /> Escalated via Google Chat
          </p>
        </div>

        <div data-tour="hitl-action-buttons" className="flex gap-3">
          <button className="cymbal-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#020617]">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Mark Resolved</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Customer & Incident Context */}
        <div data-tour="incident-metrics-panel" className="cymbal-box-lg p-5 space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1e293b] pb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f43f5e]" /> 1. Survey & Customer Context
          </h2>

          <div className="font-mono text-xs space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block font-bold">Customer Profile</span>
            <p className="text-white font-bold">driver.johnson@example.com</p>
          </div>

          <div className="font-mono space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block font-bold">NPS Feedback Score</span>
            <p className="text-3xl font-black text-[#f43f5e]">2 / 10</p>
          </div>

          <div>
            <span className="font-mono text-slate-500 uppercase text-[10px] block font-bold mb-1">Customer Quote</span>
            <blockquote className="cymbal-box-md p-3 text-xs italic text-slate-300 border-l-4 border-l-[#f43f5e]">
              &quot;Fitting bay delayed by 45 minutes past my booked slot. Counter staff were overwhelmed.&quot;
            </blockquote>
          </div>

          <div className="pt-2 border-t border-[#1e293b] font-mono text-xs">
            <span className="text-slate-500 uppercase text-[10px] block font-bold">Public Review Policy</span>
            <p className="text-slate-300 mt-0.5">Neutral Google Review link dispatched (strict un-gated anti-bias policy).</p>
          </div>
        </div>

        {/* 2. Evidence Stack */}
        <div data-tour="sentiment-insights-panel" className="cymbal-box-lg p-5 space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1e293b] pb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-400" /> 2. Places Insights & BigQuery Stack
          </h2>

          <div className="space-y-2">
            <span className="font-mono text-slate-500 uppercase text-[10px] block font-bold">Places Insights (Birmingham Cluster)</span>
            <div className="cymbal-box-md p-3 text-xs font-mono space-y-1 text-slate-300">
              <p>• Local Competitor Avg Rating: <b className="text-amber-400">4.3★</b> (vs Depot #101: <b className="text-[#f43f5e]">4.1★</b>)</p>
              <p>• Competitor Review Volume: <b>380 reviews / mo</b></p>
              <p>• Maps Grounding Sentiment: Competitors lead on <i>wait time turnaround</i>.</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1e293b]">
            <span className="font-mono text-slate-500 uppercase text-[10px] block font-bold">BigQuery Regional Anomaly</span>
            <div className="cymbal-box-md p-3 text-xs font-mono text-amber-300 border-amber-800/80 bg-[#2a1704]">
              Depot #101 slot delay is <b>+32% above regional baseline</b> during Saturday peak hours.
            </div>
          </div>
        </div>

        {/* 3. Action History & Audit Log */}
        <div className="cymbal-box-lg p-5 space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1e293b] pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" /> 3. Immutable Action Ledger
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex gap-2">
              <span className="text-slate-500">14:10</span>
              <span className="text-slate-300">Survey submitted (Rating: 2/10)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-500">14:11</span>
              <span className="text-slate-300">Long Horizon generated incident dossier</span>
            </div>
            <div className="flex gap-2 text-[#38bdf8] font-bold">
              <span className="text-slate-500">14:12</span>
              <span>Interactive card posted to Google Chat</span>
            </div>
            <div className="flex gap-2 text-[#10b981] font-bold">
              <span className="text-slate-500">14:15</span>
              <span>Manager Sarah assigned compensation offer</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e293b]">
            <span className="font-mono text-[10px] text-slate-500 block">SHA-256 LEDGER HASH</span>
            <code className="text-[10px] font-mono text-slate-400 break-all block mt-0.5">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
