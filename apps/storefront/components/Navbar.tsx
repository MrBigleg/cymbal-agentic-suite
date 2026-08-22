'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCommerce } from './CommerceContext';
import { useTour } from './TourContext';
import { StoreSelectorModal } from './StoreSelectorModal';
import { BuyingAssistantModal } from './BuyingAssistantModal';
import {
  ShoppingCart,
  Sliders,
  ChevronDown,
  Search,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedStore, cart } = useCommerce();
  const { openTourModal } = useTour();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const handleTourAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ actionId: string }>;
      if (customEvent.detail?.actionId === 'OPEN_AI_ASSISTANT') {
        setIsAssistantOpen(true);
      }
    };
    window.addEventListener('cymbal-tour-action', handleTourAction);
    return () => window.removeEventListener('cymbal-tour-action', handleTourAction);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Wiry Neo-Brutalist Primary Navbar */}
      <nav className="h-16 bg-[#0c1222] border-b border-[#1e293b] text-white flex items-center justify-between px-4 sm:px-8 shrink-0 z-40 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#0284c7] border border-[#38bdf8] flex items-center justify-center font-black italic text-white text-base shadow-[2px_2px_0px_#020617] group-hover:translate-y-[-1px] transition-transform">
              C
            </div>
            <span className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              CYMBAL <span className="text-[#38bdf8]">TYRES</span>
            </span>
          </Link>

          <div className="h-6 w-[1.5px] bg-[#1e293b] hidden sm:block" />

          {/* Selected Depot Selector Pill */}
          <div
            data-tour="depot-selector"
            onClick={() => setIsStoreModalOpen(true)}
            className="cymbal-box-md px-3 py-1.5 cursor-pointer group hover:border-[#38bdf8] transition-colors flex items-center gap-2"
          >
            <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider leading-none">
                Active Depot
              </span>
              <div className="flex items-center space-x-1 text-white group-hover:text-[#38bdf8] transition-colors">
                <span className="text-xs font-bold leading-tight">{selectedStore.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#38bdf8]" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tyres by size, brand, or spec (e.g. 225/45 R17)..."
              className="w-full bg-[#111a30] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none py-1.5 px-3 pr-9 text-xs text-white placeholder-slate-400 focus:border-[#38bdf8] focus:shadow-[0_0_12px_rgba(56,189,248,0.2)] outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2 text-slate-400 hover:text-[#38bdf8] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Navigation & Cart */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={openTourModal}
            className="cymbal-btn-secondary px-2.5 py-1.5 text-xs hidden sm:flex items-center gap-1.5 hover:border-[#38bdf8]"
            title="Interactive App & Architecture Tour"
          >
            <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-mono text-[11px]">Tour</span>
          </button>

          <button
            data-tour="ai-assistant-btn"
            onClick={() => setIsAssistantOpen(true)}
            className="cymbal-btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Buying Assistant</span>
            <span className="sm:hidden">AI Assist</span>
          </button>

          <Link
            href="/shop"
            className="text-xs font-bold text-slate-300 hover:text-[#38bdf8] transition-colors hidden md:inline"
          >
            Book Fitting
          </Link>

          <Link
            data-tour="demo-controls-link"
            href="/demo-controls"
            className="cymbal-tag hidden lg:inline-flex items-center gap-1.5 text-[#f59e0b] border-amber-500/40 bg-amber-500/10 hover:border-amber-400 transition-colors"
          >
            <Sliders className="w-3 h-3 text-amber-400" />
            <span>DEMO_CONTROLS</span>
          </Link>

          {/* Cart Icon with badge */}
          <Link
            data-tour="cart-nav-icon"
            href="/cart"
            className="relative cursor-pointer text-slate-200 hover:text-[#38bdf8] transition-colors p-1"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#0284c7] text-white border border-[#38bdf8] font-mono text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-t-sm rounded-br-sm rounded-bl-none shadow-[1px_1px_0px_#020617]">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Wiry Sub-Navbar Category Bar */}
      <div className="h-10 bg-[#080d1a] border-b border-[#1e293b] flex items-center px-4 sm:px-8 space-x-6 text-xs shrink-0 overflow-x-auto scrollbar-none z-30 font-medium">
        <Link
          href="/shop"
          className={`h-full flex items-center whitespace-nowrap transition-colors border-b-2 ${
            pathname === '/shop'
              ? 'font-bold text-[#38bdf8] border-[#38bdf8]'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          All Tyres & Sizes
        </Link>
        <Link
          href="/shop?season=Winter"
          className="text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors"
        >
          Winter Tyres
        </Link>
        <Link
          href="/shop?sort=popular"
          className="text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors"
        >
          Performance Tyres
        </Link>
        <Link
          href="/shop?vehicleType=EV%20%2F%20Hybrid"
          className="text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors"
        >
          EV Ready
        </Link>
        <Link
          href="/shop?brand=Continental"
          className="text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors"
        >
          Continental Range
        </Link>

        <div className="flex-1 min-w-4" />

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-slate-500 font-mono text-[10px] uppercase hidden sm:inline">Quick Size:</span>
          <select
            onChange={(e) => {
              if (e.target.value) router.push(e.target.value);
            }}
            className="bg-[#111a30] border border-[#1e293b] rounded-t-sm rounded-br-sm rounded-bl-none px-2 py-0.5 font-mono text-[11px] text-slate-300 outline-none hover:border-[#38bdf8] cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>
              Select Dimension
            </option>
            <option value="/shop?q=225%2F45%20R17">225/45 R17</option>
            <option value="/shop?q=205%2F55%20R16">205/55 R16</option>
            <option value="/shop?q=245%2F40%20R18">245/40 R18</option>
            <option value="/shop?q=255%2F35%20R19">255/35 R19</option>
          </select>
        </div>
      </div>

      {/* Store Selector Modal */}
      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      {/* Gemini Grounded Buying Assistant Modal */}
      <BuyingAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </>
  );
}
