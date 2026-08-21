"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, TrendingUp, Users, ShieldAlert, ArrowRight } from "lucide-react";

export default function ManagerDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cymbal Regional Operations & Incident Center</h1>
          <p className="text-sm text-gray-500 mt-1">Multi-location Autocentre NPS, Google Chat escalations, and Places Insights</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-400 font-medium">ACTIVE ESCALATIONS</span>
          <p className="text-2xl font-bold text-red-600 mt-1 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5 text-red-500" /> 1 Unresolved
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-400 font-medium">NETWORK NPS</span>
          <p className="text-2xl font-bold text-green-600 mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-green-500" /> +64
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-400 font-medium">RECOVERY CONVERSION</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">18.4%</p>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-400 font-medium">OOS AP2 SETTLEMENTS</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">£14,280</p>
        </div>
      </div>

      {/* Escalation Incidents Queue */}
      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" /> Real-Time Google Chat Escalation Queue
        </h2>

        <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">High Severity</span>
              <span className="font-medium text-gray-900">Birmingham Central (#101) &bull; Fitting Delay (+45m)</span>
            </div>
            <p className="text-xs text-gray-500">Customer NPS: 2/10 &bull; Escalated to Google Chat Space &bull; Assigned: Sarah</p>
          </div>
          <Link
            href="/manager/incidents/inc_001"
            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 flex items-center gap-1"
          >
            View Dossier <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
