'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCommerce } from './CommerceContext';
import { TyreBadge } from './TyreBadge';
import { StockStatusBadge } from './StockStatusBadge';
import { IntentModal } from './IntentModal';
import {
  Sparkles,
  Search,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertTriangle,
  X,
  ShoppingCart,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface BuyingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface AssistantResponse {
  groundedAnswer: string;
  plainEnglishSummary: string;
  confidenceScore: number;
  isFullyGrounded: boolean;
  keyDifferentiator: string;
  recommendedProductIds: string[];
  drivingProfileMatch: string;
  groundingHighlights: string[];
  groundingSources?: Array<{ title: string; uri: string }>;
  webSearchQueries?: string[];
  humanInTheLoop: {
    required: boolean;
    reason?: string;
    technicianAssigned?: string;
    ticketId?: string;
    estimatedWait?: string;
  };
  suggestedNextAction: string;
}

export function BuyingAssistantModal({
  isOpen,
  onClose,
  initialQuery = '',
}: BuyingAssistantModalProps) {
  const { selectedStore, products, addToCart } = useCommerce();

  const [query, setQuery] = useState(initialQuery);
  const [vehicleReg, setVehicleReg] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('Wet Weather Safety');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalationSuccess, setEscalationSuccess] = useState<string | null>(null);
  const [selectedProductForIntent, setSelectedProductForIntent] = useState<any | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  if (!isOpen) return null;

  const drivingProfiles = [
    { id: 'Wet Weather Safety', label: '🌧️ Wet Weather & Braking', desc: 'Maximum grip on rain-soaked UK roads' },
    { id: 'EV Range & Low Noise', label: '⚡ EV Range & Acoustic', desc: 'Low rolling resistance & silent cabin' },
    { id: 'High Mileage Durability', label: '🚗 High Mileage Commute', desc: '40k+ mile tread life & fuel efficiency' },
    { id: 'Ultra High Performance', label: '🏁 Performance & Track', desc: 'Razor-sharp precision & cornering' },
    { id: 'Budget & Everyday Value', label: '💰 Budget & Quality', desc: 'Best safety-to-cost ratio' },
  ];

  const handleConsult = async (customQuery?: string) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setEscalationSuccess(null);

    try {
      const res = await fetch('/api/assistant/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: activeQuery,
          drivingProfile: selectedProfile,
          vehicleReg: vehicleReg.trim() || undefined,
          selectedStoreId: selectedStore.id,
          requireStrictGrounding: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to consult Buying Assistant');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error(json.error || 'Invalid assistant response');
      }
    } catch (err: any) {
      setError(err.message || 'Consultation encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addToCart(productId, 2, 'in_store');
    } finally {
      setAddingProductId(null);
    }
  };

  const handleManualEscalate = async () => {
    setIsEscalating(true);
    try {
      const res = await fetch('/api/assistant/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || 'Customer requested direct Master Technician fitment review',
          vehicleReg: vehicleReg || 'DVLA Lookup Requested',
          storeId: selectedStore.id,
          reason: 'Customer requested human technician verification and fitment guarantee',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEscalationSuccess(
          data.message ||
            `Ticket ${data.ticket?.ticketId} created! Dave Henderson at ${selectedStore.city} has been notified.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEscalating(false);
    }
  };

  const matchedProducts = result?.recommendedProductIds
    ? products.filter((p) => result.recommendedProductIds.includes(p.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative cymbal-box-lg bg-[#0c1222] border-[#0284c7] shadow-[8px_8px_0px_#000000] w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        {/* Header */}
        <div className="bg-[#080d1a] px-5 sm:px-7 py-4 flex items-center justify-between border-b border-[#1e293b] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#0284c7] flex items-center justify-center text-[#38bdf8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg uppercase tracking-tight">
                  Cymbal AI Buying Assistant
                </h2>
                <span className="cymbal-stamp bg-amber-400 text-[#020617]">
                  GROUNDED AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                100% Grounded Advice • Plain English Insights • Human-in-the-Loop Safeguard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-t-sm rounded-br-sm rounded-bl-none text-slate-400 hover:text-white hover:bg-[#111a30] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#060913]">
          {/* Top Info Banner */}
          <div className="cymbal-box-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-t-sm rounded-br-sm rounded-bl-none bg-[#022c22] border border-[#064e3b] text-[#10b981] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  100% Grounded Policy & Master Technician Safeguard
                </span>
                <span className="text-slate-400 text-[11px]">
                  All suggestions must achieve 100% test-verified confidence. Any fitment ambiguity is deferred to a senior technician at{' '}
                  <strong className="text-slate-200">{selectedStore.name}</strong>.
                </span>
              </div>
            </div>

            <button
              onClick={handleManualEscalate}
              disabled={isEscalating}
              className="cymbal-btn-secondary px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{isEscalating ? 'Assigning...' : 'Talk to Technician'}</span>
            </button>
          </div>

          {/* Driving Profile Picker */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. Select Driving Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {drivingProfiles.map((dp) => (
                <button
                  key={dp.id}
                  type="button"
                  onClick={() => setSelectedProfile(dp.id)}
                  className={`p-2.5 rounded-t-lg rounded-br-lg rounded-bl-none text-left border transition-all text-xs flex flex-col justify-between ${
                    selectedProfile === dp.id
                      ? 'bg-[#111a30] border-[#0284c7] text-[#38bdf8] font-bold shadow-[2px_2px_0px_#020617]'
                      : 'bg-[#080d1a] border-[#1e293b] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="leading-tight block mb-1">{dp.label}</span>
                  <span className="text-[10px] font-normal text-slate-400 leading-tight">
                    {dp.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Query & Vehicle Input */}
          <div className="cymbal-box-md p-4 space-y-3">
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              2. Describe your vehicle or ask a question in plain English
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Optional Reg Plate */}
              <div className="cymbal-plate p-1 sm:w-44 shrink-0">
                <div className="bg-[#1d4ed8] text-white font-bold text-[8px] px-1.5 py-1 rounded-t-sm rounded-br-sm rounded-bl-none select-none">
                  UK
                </div>
                <input
                  type="text"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  placeholder="OPTIONAL REG"
                  maxLength={8}
                  className="bg-[#f59e0b] text-[#020617] font-mono font-black text-xs uppercase px-2 py-0.5 outline-none text-center w-full"
                />
              </div>

              {/* Free Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                  placeholder="e.g. Which tyre gives maximum wet grip on motorway commutes with lowest road noise?"
                  className="w-full h-full bg-[#080d1a] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-[#38bdf8]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleConsult()}
                disabled={isLoading || (!query.trim() && !vehicleReg.trim())}
                className="cymbal-btn-primary px-5 py-2 text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching Web...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Consult AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          {result && (
            <div className="space-y-4">
              <div className="cymbal-box-md p-5 border-[#0284c7] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
                  <span className="font-mono text-xs font-bold text-[#38bdf8] uppercase">
                    Grounded Recommendation
                  </span>
                  <span className="cymbal-tag bg-[#022c22] text-[#10b981] border-[#064e3b] font-mono text-[10px]">
                    CONFIDENCE: {Math.round(result.confidenceScore * 100)}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {result.groundedAnswer}
                </p>

                {result.plainEnglishSummary && (
                  <div className="p-3 bg-[#080d1a] border border-[#1e293b] rounded-t-sm rounded-br-sm rounded-bl-none text-xs text-slate-300 font-mono">
                    <strong className="text-amber-400">Key Takeaway:</strong> {result.plainEnglishSummary}
                  </div>
                )}
              </div>

              {/* Matched Product Cards */}
              {matchedProducts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-mono font-bold text-xs uppercase text-slate-400">
                    Recommended Model Options
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchedProducts.map((p) => (
                      <div key={p.id} className="cymbal-box-md p-4 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="cymbal-stamp text-[9px] bg-[#111a30] text-[#38bdf8] border border-[#1e293b]">
                              {p.brand}
                            </span>
                            <h5 className="font-bold text-white text-sm mt-1">{p.name}</h5>
                            <span className="font-mono text-xs text-[#38bdf8]">{p.tyreSize}</span>
                          </div>
                          <span className="font-mono font-black text-lg text-[#38bdf8]">
                            £{p.price.toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(p.id)}
                          disabled={addingProductId === p.id}
                          className="cymbal-btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{addingProductId === p.id ? 'Adding...' : '⚡ Quick Book Fitting'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
