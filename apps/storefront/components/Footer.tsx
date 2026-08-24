'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 bg-[#080d1a] text-slate-400 text-sm border-t border-[#1e293b]">
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#0284c7] border border-[#38bdf8] flex items-center justify-center font-black italic text-white text-base shadow-[2px_2px_0px_#020617]">
                C
              </div>
              <span className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                CYMBAL <span className="text-[#38bdf8]">TYRES</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Cymbal Tyres is an autonomous protocol-driven tyre retailer & autocentre network operating depots across the UK. Featuring AP2 v0.2 conditional purchasing, laser wheel alignment, and certified technician bay fitting.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Manufacturer Warranty & 100% Fitment Guarantee</span>
            </div>
          </div>

          {/* Col 2: Autocentres */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">DEPOTS</span>
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
                Autocentres
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Birmingham (Bullring)</strong>
                  <br />
                  <span className="font-mono text-[10px] text-slate-500">B4 7XU • 4 BAYS</span>
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Bristol (Cribbs)</strong>
                  <br />
                  <span className="font-mono text-[10px] text-slate-500">BS10 7UB • 3 BAYS</span>
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Croydon (Purley Way)</strong>
                  <br />
                  <span className="font-mono text-[10px] text-slate-500">CR0 4XJ • 4 BAYS</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-3">
              Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-[#38bdf8] transition-colors">
                  All Tyres & Specs
                </Link>
              </li>
              <li>
                <Link href="/shop?season=Winter" className="hover:text-[#38bdf8] transition-colors">
                  Winter Tyres
                </Link>
              </li>
              <li>
                <Link href="/shop?vehicleType=EV%20%2F%20Hybrid" className="hover:text-[#38bdf8] transition-colors">
                  EV Ready Range
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#38bdf8] transition-colors">
                  Basket & Fitting Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                Agentic Platform
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Autonomous commerce powered by Google ADK 2.5, Gemini 3.7 Flash, AP2 v0.2, and A2A negotiation.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/telemetry"
                className="cymbal-btn-primary inline-flex items-center gap-1.5 text-xs px-3 py-1.5"
              >
                <span>Live Observation Deck</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/demo-controls"
                className="cymbal-btn-secondary inline-flex items-center gap-1.5 text-xs px-3 py-1.5"
              >
                <span>Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wiry Theme Bottom Bar */}
      <div className="h-12 bg-[#060913] border-t border-[#1e293b] px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium gap-2">
        <div className="flex items-center space-x-4">
          <span className="font-mono text-[10px] text-slate-500">&copy; {new Date().getFullYear()} CYMBAL TYRES UK</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-emerald-400">AP2_UCP_A2A_ONLINE</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/telemetry"
            className="text-emerald-400 font-mono text-[10px] font-bold hover:underline"
          >
            Live Telemetry
          </Link>
          <Link
            href="/demo-controls"
            className="text-amber-400 font-mono text-[10px] font-bold hover:underline"
          >
            Demo Controls
          </Link>
          <Link href="/shop" className="hover:text-[#38bdf8] font-mono text-[10px]">
            Book Fitting
          </Link>
          <span className="font-mono text-[10px] text-slate-500">BHM • BRS • CRY</span>
        </div>
      </div>
    </footer>
  );
}
