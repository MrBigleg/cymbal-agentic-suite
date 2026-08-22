'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types/commerce';
import { useCommerce } from './CommerceContext';
import { StockStatusBadge } from './StockStatusBadge';
import { IntentModal } from './IntentModal';
import { TyreBadge } from './TyreBadge';
import { Clock, ShoppingCart, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { selectedStoreId, selectedStore, addToCart } = useCommerce();
  const [isIntentModalOpen, setIsIntentModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const stockInfo = product.stockByStore[selectedStoreId] || {
    state: 'Out of Stock',
    quantity: 0,
    bayAvailable: false,
  };

  const isOutOfStock = stockInfo.state === 'Out of Stock' || stockInfo.quantity === 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, 2, 'in_store');
    } finally {
      setIsAdding(false);
    }
  };

  const [viewPackage, setViewPackage] = useState(false);

  const currentImage = viewPackage && product.wheelPackageImage ? product.wheelPackageImage : product.image;

  return (
    <>
      <div
        className={`cymbal-box-lg flex flex-col p-5 overflow-hidden transition-all duration-200 hover:border-[#38bdf8] ${
          isOutOfStock
            ? 'border-[#881337]'
            : 'border-[#1e293b]'
        }`}
      >
        {/* Top Header: Badge & Price */}
        <div className="flex justify-between items-start mb-3">
          <StockStatusBadge
            state={stockInfo.state}
            quantity={stockInfo.quantity}
            storeName={isOutOfStock ? selectedStore.city : undefined}
            size="sm"
          />
          <div className="text-right">
            <span className="font-mono text-xl font-black text-[#38bdf8] leading-none block">
              £{product.price.toFixed(2)}
            </span>
            <div className="font-mono text-[9px] uppercase font-bold text-slate-500">
              inc. VAT & fitting
            </div>
          </div>
        </div>

        {/* Tyre Image / Visual Podium Container with Style Toggle */}
        <div className="relative mb-4">
          <Link
            href={`/product/${product.id}`}
            className="h-44 sm:h-48 bg-[#111a30] rounded-t-lg rounded-br-lg rounded-bl-none flex items-center justify-center relative overflow-hidden group/img border border-[#1e293b] border-b-2 border-b-[#0284c7]"
          >
            <Image
              src={currentImage}
              alt={product.name}
              width={260}
              height={260}
              className="object-contain max-h-40 sm:max-h-44 group-hover/img:scale-105 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              referrerPolicy="no-referrer"
            />
            {product.vehicleType === 'EV / Hybrid' && (
              <span className="absolute top-2 left-2 cymbal-tag text-emerald-400 border-emerald-800 bg-emerald-950/80 font-mono text-[9px] font-bold">
                <Sparkles className="w-2.5 h-2.5" /> EV READY
              </span>
            )}
          </Link>

          {/* Quick toggle between Tyre only and Fitted Wheel Package */}
          {product.wheelPackageImage && (
            <div className="absolute bottom-2 right-2 flex bg-[#080d1a] border border-[#1e293b] rounded-t-sm rounded-br-sm rounded-bl-none p-0.5 text-[10px] font-mono font-semibold">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewPackage(false);
                }}
                className={`px-2 py-0.5 rounded-t-sm rounded-br-sm rounded-bl-none ${
                  !viewPackage
                    ? 'bg-[#111a30] text-[#38bdf8] border border-[#0284c7]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tyre
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewPackage(true);
                }}
                className={`px-2 py-0.5 rounded-t-sm rounded-br-sm rounded-bl-none ${
                  viewPackage
                    ? 'bg-[#0284c7] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Wheel
              </button>
            </div>
          )}
        </div>

        {/* Tyre Brand & Name */}
        <div className="mb-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b] text-[9px]">
              {product.brand}
            </span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
              {product.season}
            </span>
          </div>
          <Link
            href={`/product/${product.id}`}
            className="font-bold text-white hover:text-[#38bdf8] transition-colors leading-tight text-base line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 mb-3 flex-1 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Spec Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase mb-3">
          <div className="bg-[#111a30] border border-[#1e293b] p-1.5 rounded-t-sm rounded-br-sm rounded-bl-none text-center truncate">
            Size: {product.tyreSize}
          </div>
          <div className="bg-[#111a30] border border-[#1e293b] p-1.5 rounded-t-sm rounded-br-sm rounded-bl-none text-center truncate text-emerald-400">
            {isOutOfStock ? `Depot: ${selectedStore.city}` : 'Bay Fit: 45 min'}
          </div>
        </div>

        {/* EU Rating Tag Bar */}
        <div className="mb-4">
          <TyreBadge
            fuel={product.fuelEfficiency}
            wetGrip={product.wetGrip}
            noiseDb={product.noiseLevelDb}
            size="sm"
          />
        </div>

        {/* Primary CTA Button */}
        {isOutOfStock ? (
          <button
            type="button"
            onClick={() => setIsIntentModalOpen(true)}
            className="cymbal-btn-primary w-full py-2.5 text-xs flex items-center justify-center space-x-2"
          >
            <Clock className="w-4 h-4 text-white" />
            <span>Buy when back in stock</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="cymbal-btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-75"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isAdding ? 'Adding...' : '⚡ Instant Fitting Booking'}</span>
          </button>
        )}
      </div>

      {/* Out of stock purchase intent modal */}
      {isIntentModalOpen && (
        <IntentModal
          isOpen={isIntentModalOpen}
          onClose={() => setIsIntentModalOpen(false)}
          product={product}
        />
      )}
    </>
  );
}
