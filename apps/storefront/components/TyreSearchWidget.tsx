'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Car, Disc, ShieldCheck } from 'lucide-react';

export function TyreSearchWidget() {
  const router = useRouter();
  const [tab, setTab] = useState<'reg' | 'size'>('reg');
  const [regInput, setRegInput] = useState('BK72 XDA');
  const [width, setWidth] = useState('225');
  const [profile, setProfile] = useState('40');
  const [rim, setRim] = useState('18');
  const [isSearching, setIsSearching] = useState(false);

  const handleRegSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/shop?q=${encodeURIComponent(regInput.trim())}`);
    }, 300);
  };

  const handleSizeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?width=${width}&profile=${profile}&rim=${rim}`);
  };

  return (
    <div className="cymbal-box-lg p-5 sm:p-6 max-w-4xl mx-auto -mt-10 relative z-20">
      {/* Tabs */}
      <div className="flex border-b border-[#1e293b] mb-5 gap-2">
        <button
          type="button"
          onClick={() => setTab('reg')}
          className={`flex items-center gap-2 pb-2.5 px-4 text-xs sm:text-sm font-bold transition-all rounded-t-lg rounded-br-lg rounded-bl-none border-t border-r border-l ${
            tab === 'reg'
              ? 'border-[#0284c7] bg-[#111a30] text-[#38bdf8] shadow-[2px_2px_0px_#020617]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#080d1a]'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Registration Lookup</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('size')}
          className={`flex items-center gap-2 pb-2.5 px-4 text-xs sm:text-sm font-bold transition-all rounded-t-lg rounded-br-lg rounded-bl-none border-t border-r border-l ${
            tab === 'size'
              ? 'border-[#0284c7] bg-[#111a30] text-[#38bdf8] shadow-[2px_2px_0px_#020617]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#080d1a]'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>Search by Tyre Size</span>
        </button>
      </div>

      {tab === 'reg' ? (
        <form onSubmit={handleRegSearch} className="flex flex-col sm:flex-row items-center gap-3">
          {/* Authentic British Road Spec Plate */}
          <div className="cymbal-plate p-1 w-full sm:w-auto">
            <div className="bg-[#1d4ed8] text-white font-bold text-[9px] flex flex-col items-center justify-center px-2 py-1.5 rounded-t-sm rounded-br-sm rounded-bl-none select-none">
              <span className="text-[8px]">🇬🇧</span>
              <span>UK</span>
            </div>
            <input
              type="text"
              value={regInput}
              onChange={(e) => setRegInput(e.target.value.toUpperCase())}
              placeholder="ENTER REG"
              className="bg-[#f59e0b] text-[#020617] font-mono font-black text-lg tracking-widest uppercase px-3 py-1 outline-none text-center w-full sm:w-44 placeholder-slate-900/60"
              maxLength={8}
            />
          </div>

          <div className="flex-1 w-full text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Instant DVLA match & verified bay fitment</span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-0.5">e.g. BK72 XDA, WP21 TXL, EA71 BHM</p>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="cymbal-btn-primary w-full sm:w-auto px-6 py-3 text-xs flex items-center justify-center gap-2 shrink-0"
          >
            {isSearching ? (
              <span>Looking up vehicle...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Fitted Tyres</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSizeSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto flex-1">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Width
              </label>
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-slate-200 text-xs font-mono font-semibold outline-none focus:border-[#38bdf8]"
              >
                <option value="205">205 mm</option>
                <option value="225">225 mm</option>
                <option value="245">245 mm</option>
                <option value="255">255 mm</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Profile
              </label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full p-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-slate-200 text-xs font-mono font-semibold outline-none focus:border-[#38bdf8]"
              >
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="55">55</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                Rim
              </label>
              <select
                value={rim}
                onChange={(e) => setRim(e.target.value)}
                className="w-full p-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-slate-200 text-xs font-mono font-semibold outline-none focus:border-[#38bdf8]"
              >
                <option value="16">16&quot;</option>
                <option value="17">17&quot;</option>
                <option value="18">18&quot;</option>
                <option value="19">19&quot;</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="cymbal-btn-primary w-full sm:w-auto mt-2 sm:mt-5 px-6 py-2.5 text-xs flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search Tyres</span>
          </button>
        </form>
      )}

      {/* Quick reassurance line */}
      <div className="mt-4 pt-3 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Guaranteed fitment or 100% free swap</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-500 font-mono text-[10px] uppercase">Popular sizes:</span>
          <button
            type="button"
            onClick={() => router.push('/shop?width=225&profile=40&rim=18')}
            className="cymbal-tag font-mono text-[#38bdf8] hover:border-[#38bdf8]"
          >
            225/40 R18
          </button>
          <button
            type="button"
            onClick={() => router.push('/shop?width=205&profile=55&rim=16')}
            className="cymbal-tag font-mono text-[#38bdf8] hover:border-[#38bdf8]"
          >
            205/55 R16
          </button>
        </div>
      </div>
    </div>
  );
}
