'use client';

import React from 'react';
import { StockState } from '@/lib/types/commerce';

interface StockStatusBadgeProps {
  state: StockState;
  quantity?: number;
  storeName?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StockStatusBadge({
  state,
  quantity,
  storeName,
  size = 'md',
}: StockStatusBadgeProps) {
  if (state === 'In Stock') {
    return (
      <div className="cymbal-tag bg-[#022c22] border-[#064e3b] text-[#10b981] font-mono font-bold text-[10px] uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
        <span>In Stock</span>
        {quantity !== undefined && quantity > 0 && <span>({quantity})</span>}
      </div>
    );
  }

  if (state === 'Low Stock') {
    return (
      <div className="cymbal-tag bg-[#2a1704] border-[#78350f] text-[#f59e0b] font-mono font-bold text-[10px] uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
        <span>Low Stock {quantity !== undefined ? `(${quantity})` : ''}</span>
      </div>
    );
  }

  // Out of stock
  return (
    <div className="cymbal-tag bg-[#2a080c] border-[#881337] text-[#f43f5e] font-mono font-bold text-[10px] uppercase tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
      <span>Out of Stock {storeName ? `at ${storeName}` : ''}</span>
    </div>
  );
}
