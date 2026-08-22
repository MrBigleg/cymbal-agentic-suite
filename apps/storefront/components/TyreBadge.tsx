'use client';

import React from 'react';
import { Fuel, CloudRain, Volume2 } from 'lucide-react';

interface TyreBadgeProps {
  fuel: 'A' | 'B' | 'C' | 'D' | 'E';
  wetGrip: 'A' | 'B' | 'C' | 'D' | 'E';
  noiseDb: number;
  size?: 'sm' | 'md';
}

export function TyreBadge({ fuel, wetGrip, noiseDb, size = 'md' }: TyreBadgeProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A':
        return 'text-[#10b981] border-[#064e3b] bg-[#022c22]';
      case 'B':
        return 'text-[#38bdf8] border-[#0284c7] bg-[#081126]';
      case 'C':
        return 'text-[#f59e0b] border-[#78350f] bg-[#2a1704]';
      case 'D':
        return 'text-orange-400 border-orange-800 bg-orange-950';
      default:
        return 'text-[#f43f5e] border-[#881337] bg-[#2a080c]';
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className="flex items-center gap-1.5 bg-[#080d1a] p-1 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] text-xs">
      {/* Fuel efficiency */}
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-t-sm rounded-br-sm rounded-bl-none bg-[#111a30] border border-[#1e293b]" title="EU Fuel Efficiency Rating">
        <Fuel className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-400`} />
        <span className={`font-mono font-bold px-1 rounded text-[10px] border ${getRatingColor(fuel)}`}>
          {fuel}
        </span>
      </div>

      {/* Wet grip */}
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-t-sm rounded-br-sm rounded-bl-none bg-[#111a30] border border-[#1e293b]" title="EU Wet Braking Grip Rating">
        <CloudRain className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#38bdf8]`} />
        <span className={`font-mono font-bold px-1 rounded text-[10px] border ${getRatingColor(wetGrip)}`}>
          {wetGrip}
        </span>
      </div>

      {/* Noise */}
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-t-sm rounded-br-sm rounded-bl-none bg-[#111a30] border border-[#1e293b]" title="External Rolling Noise (dB)">
        <Volume2 className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-400`} />
        <span className="font-mono font-bold text-slate-300 text-[10px]">
          {noiseDb}dB
        </span>
      </div>
    </div>
  );
}
