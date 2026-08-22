"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, TrendingUp, Users, ShieldAlert, ArrowRight, Activity, MapPin } from "lucide-react";

export default function ManagerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="cymbal-box-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">OPERATIONS</span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
              AUDIT PROTOCOL REV 9F82D1
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase mt-1 tracking-tight">
            Regional Operations & Incident Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Multi-location Autocentre NPS telemetry, Google Chat incident escalations, and Places Insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="cymbal-tag bg-[#022c22] text-[#10b981] border-[#064e3b] font-mono text-[11px] font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cymbal-box-md p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">Active Escalations</span>
            <span className="cymbal-tag bg-[#2a080c] text-[#f43f5e] border-[#881337] text-[9px]">CRITICAL</span>
          </div>
          <p className="text-2xl font-black font-mono text-[#f43f5e] flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5" /> 1 Unresolved
          </p>
          <span className="font-mono text-[10px] text-slate-500 block">Depot #101 (Birmingham)</span>
        </div>

        <div className="cymbal-box-md p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">Network NPS</span>
            <span className="cymbal-tag bg-[#022c22] text-[#10b981] border-[#064e3b] text-[9px]">+8.2%</span>
          </div>
          <p className="text-2xl font-black font-mono text-[#10b981] flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5" /> +64
          </p>
          <span className="font-mono text-[10px] text-slate-500 block">30-Day Rolling Score</span>
        </div>

        <div className="cymbal-box-md p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">Cart Recovery</span>
            <span className="cymbal-tag bg-[#111a30] text-[#38bdf8] border-[#0284c7] text-[9px]">A2A LOOP</span>
          </div>
          <p className="text-2xl font-black font-mono text-[#38bdf8]">
            18.4%
          </p>
          <span className="font-mono text-[10px] text-slate-500 block">Stalled Checkout Reclaim</span>
        </div>

        <div className="cymbal-box-md p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">OOS AP2 Settlement</span>
            <span className="cymbal-tag bg-[#2e1065] text-[#c084fc] border-[#7e22ce] text-[9px]">PRE-AUTH</span>
          </div>
          <p className="text-2xl font-black font-mono text-purple-400">
            £14,280
          </p>
          <span className="font-mono text-[10px] text-slate-500 block">Autonomous Match Volume</span>
        </div>
      </div>

      {/* Escalation Incidents Queue */}
      <div className="cymbal-box-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Real-Time Google Chat Escalation Queue
          </h2>
          <span className="font-mono text-[10px] text-slate-400">[STREAM_CONNECTED]</span>
        </div>

        <div className="cymbal-box-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-[#881337]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="cymbal-tag bg-[#2a080c] text-[#f43f5e] border-[#881337] text-[10px] font-bold">
                HIGH SEVERITY
              </span>
              <span className="font-bold text-white text-sm">
                Birmingham Central (#101) • Fitting Delay (+45m)
              </span>
              <span className="cymbal-stamp text-[9px] bg-[#111a30] text-slate-400">INC_001</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Customer NPS: <strong className="text-[#f43f5e]">2/10</strong> • Escalated to Google Chat Space • Assigned: Sarah Jenkins (Operations Lead)
            </p>
          </div>

          <Link
            href="/manager/incidents/inc_001"
            className="cymbal-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Inspect Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
