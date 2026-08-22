'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommerce } from '@/components/CommerceContext';
import { ProductCard } from '@/components/ProductCard';
import { TyreSearchWidget } from '@/components/TyreSearchWidget';
import { BuyingAssistantModal } from '@/components/BuyingAssistantModal';
import {
  ShieldCheck,
  Wrench,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Star,
  Zap,
  UserCheck,
} from 'lucide-react';

export default function HomePage() {
  const { products, selectedStore } = useCommerce();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');

  const launchAssistant = (q: string = '') => {
    setAssistantQuery(q);
    setIsAssistantOpen(true);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-[#0c1222] text-white overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-28 border-b border-[#1e293b]">
        {/* Background Subtle Gradient & Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(2,132,199,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2">
                <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">NETWORK</span>
                <div className="cymbal-tag text-[#38bdf8] border-[#0284c7]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>UK Leading Autonomous Autocentre Network</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white uppercase">
                FITTED TYRES FROM <br />
                <span className="text-[#38bdf8] drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                  TOP PREMIUM BRANDS
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Same-day booking and next-day precision fitting at your local centre in{' '}
                <strong className="text-white underline decoration-[#38bdf8] underline-offset-4">
                  {selectedStore.city}
                </strong>
                . Fully inclusive prices with free valve replacement, balancing, and environmental disposal.
              </p>

              {/* Quick USP Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free In-Store Fitting
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hunter 3D Laser Alignment
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AP2 Conditional Purchasing
                </span>
              </div>
            </div>

            {/* Quick Hero Summary Card */}
            <div className="lg:col-span-4 cymbal-box-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#1e293b] text-[#38bdf8] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Current Depot</div>
                    <div className="font-bold text-sm text-white">{selectedStore.name}</div>
                  </div>
                </div>
                <span className="cymbal-stamp bg-emerald-500 text-white">4 BAYS ACTIVE</span>
              </div>

              <div className="text-xs text-slate-300 space-y-2 pt-3 border-t border-[#1e293b]">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Address:</span>
                  <span className="text-right font-medium text-slate-200">{selectedStore.address}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Next Bay Slot:</span>
                  <span className="text-emerald-400 font-bold">Tomorrow from 08:30</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="cymbal-btn-primary w-full py-2.5 px-4 text-xs flex items-center justify-center gap-2"
                >
                  <span>Explore Available Tyres</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reg / Tyre Size Search Box Overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TyreSearchWidget />
      </div>

      {/* Gemini Grounding User Buying Assistant Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cymbal-box-lg p-6 sm:p-8 text-white relative overflow-hidden border-[#0284c7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="cymbal-stamp bg-amber-400 text-[#020617]">GEMINI 3.7</span>
                <span className="cymbal-tag text-[#38bdf8] border-[#0284c7]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Web-Grounded Buying Assistant • 100% Verified Policy</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                Not sure which tyre is best for your vehicle?
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Our AI Buying Assistant searches live web test data (Tyre Reviews UK, Auto Express, ADAC) and translates wet braking, acoustic noise, and tread life into <strong>plain English</strong>. Suggestions are <strong>100% grounded</strong> in test metrics; if fitment ambiguity is detected, it defers to our Senior Master Technician at {selectedStore.name}.
              </p>

              {/* Quick sample prompt pills */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => launchAssistant('Which tyre has the shortest wet braking distance in UK winter rain?')}
                  className="cymbal-tag text-slate-300 hover:border-[#38bdf8] hover:text-white transition-all cursor-pointer"
                >
                  <span>🌧️ Best tyre for wet UK roads?</span>
                </button>
                <button
                  type="button"
                  onClick={() => launchAssistant('I drive an EV / Tesla Model 3 — what tyre offers lowest road noise and max range?')}
                  className="cymbal-tag text-slate-300 hover:border-[#38bdf8] hover:text-white transition-all cursor-pointer"
                >
                  <span>⚡ Lowest noise for EV / Hybrid?</span>
                </button>
                <button
                  type="button"
                  onClick={() => launchAssistant('BMW 3 Series 18-inch wheels: do I need staggered rear fitment or run-flats?')}
                  className="cymbal-tag text-slate-300 hover:border-[#38bdf8] hover:text-white transition-all cursor-pointer"
                >
                  <span>🛡️ BMW staggered fitment check (HITL test)</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                type="button"
                onClick={() => launchAssistant()}
                className="cymbal-btn-primary w-full py-3 px-5 text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch AI Buying Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono text-center">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backed by Master Technicians in {selectedStore.city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">LIVE CATALOG</span>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Depot: {selectedStore.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1 tracking-tight">
              Popular Tyres In Your Size
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Top-rated OE fitments with live depot stock availability for immediate fitting.
            </p>
          </div>

          <Link
            href="/shop"
            className="cymbal-btn-secondary inline-flex items-center gap-1.5 text-xs px-3 py-2 font-mono"
          >
            <span>VIEW ALL {products.length} MODELS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Agentic Commerce & Out-of-Stock Intent Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cymbal-box-lg p-6 sm:p-10 text-white relative overflow-hidden border-[#0284c7]">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2">
              <span className="cymbal-stamp bg-amber-400 text-[#020617]">AP2 v0.2</span>
              <span className="cymbal-tag text-[#38bdf8] border-[#0284c7]">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Conditional Autonomous Purchasing</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight">
              Looking for a tyre that is out of stock?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              With Cymbal Tyres conditional purchase intents, you can set a price cap, preferred fitting depot, and let autonomous commerce agents execute the order the second our supplier replenishes the warehouse.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/product/michelin-pilot-sport-5"
                className="cymbal-btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
              >
                <span>Test Out-of-Stock Intent Flow (Michelin PS5)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/demo-controls"
                className="cymbal-btn-secondary px-4 py-2.5 text-xs font-mono flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>[OPEN_DEMO_PANEL]</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="cymbal-box-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#1e293b]">
            <div className="space-y-2 pr-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="font-bold text-sm text-white">
                4.9 / 5 on Trustpilot
              </div>
              <p className="text-xs text-slate-400">
                Over 14,000 verified UK driver reviews across Birmingham, Bristol & Croydon.
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0 md:px-6">
              <div className="flex items-center gap-2 text-[#38bdf8]">
                <Wrench className="w-5 h-5" />
                <span className="font-bold text-sm text-white">
                  Laser Wheel Alignment
                </span>
              </div>
              <p className="text-xs text-slate-400">
                State-of-the-art Hunter Hawkeye Elite optical wheel alignment calibrated on every fitting.
              </p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-sm text-white">
                  60-Minute Fitting Guarantee
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Drive into your booked bay slot and drive out within 60 minutes, or receive 20% off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Buying Assistant Modal */}
      <BuyingAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialQuery={assistantQuery}
      />
    </div>
  );
}
