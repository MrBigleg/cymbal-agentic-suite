'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCommerce } from '@/components/CommerceContext';
import { TyreBadge } from '@/components/TyreBadge';
import { StockStatusBadge } from '@/components/StockStatusBadge';
import { IntentModal } from '@/components/IntentModal';
import { StoreSelectorModal } from '@/components/StoreSelectorModal';
import {
  ShoppingCart,
  Clock,
  MapPin,
  ShieldCheck,
  Wrench,
  Truck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, selectedStore, selectedStoreId, addToCart, stores } = useCommerce();

  const [quantity, setQuantity] = useState<number>(2);
  const [fittingOption, setFittingOption] = useState<'in_store' | 'mobile' | 'delivery_only'>('in_store');
  const [isIntentModalOpen, setIsIntentModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewPackage, setViewPackage] = useState(false);

  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white uppercase">Product Not Found</h1>
        <p className="text-sm text-slate-400">The tyre you requested does not exist in our catalog.</p>
        <Link
          href="/shop"
          className="cymbal-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const currentImage = viewPackage && product.wheelPackageImage ? product.wheelPackageImage : product.image;

  const stockInfo = product.stockByStore[selectedStoreId] || {
    state: 'Out of Stock',
    quantity: 0,
    bayAvailable: false,
  };

  const isOutOfStock = stockInfo.state === 'Out of Stock' || stockInfo.quantity === 0;

  const unitFittingFee = fittingOption === 'mobile' ? 15 : 0;
  const itemSubtotal = product.price * quantity;
  const itemFittingTotal = unitFittingFee * quantity;
  const grandTotal = itemSubtotal + itemFittingTotal;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, fittingOption);
      router.push('/cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/shop" className="hover:text-[#38bdf8] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[CATALOG]</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-300 uppercase">{product.brand}</span>
        <span>/</span>
        <span className="truncate max-w-[200px] sm:max-w-none text-[#38bdf8] font-bold">
          {product.name}
        </span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image & EU Tyre Label */}
        <div className="lg:col-span-6 space-y-6">
          <div className="cymbal-box-lg p-8 flex items-center justify-center relative overflow-hidden">
            <div className="relative h-72 sm:h-96 w-full flex items-center justify-center">
              <Image
                src={currentImage}
                alt={product.name}
                width={500}
                height={500}
                priority
                className="object-contain max-h-80 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b] text-xs">
                {product.brand}
              </span>
              {product.vehicleType === 'EV / Hybrid' && (
                <span className="cymbal-tag bg-[#022c22] text-emerald-400 border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> EV CERTIFIED
                </span>
              )}
            </div>

            {/* View Mode Toggle (Tyre vs Fitted Alloy Wheel) */}
            {product.wheelPackageImage && (
              <div className="absolute bottom-4 right-4 flex bg-[#080d1a] border border-[#1e293b] rounded-t-sm rounded-br-sm rounded-bl-none p-1 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setViewPackage(false)}
                  className={`px-3 py-1.5 rounded-t-sm rounded-br-sm rounded-bl-none transition-all ${
                    !viewPackage
                      ? 'bg-[#111a30] text-[#38bdf8] border border-[#0284c7]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tyre Only
                </button>
                <button
                  type="button"
                  onClick={() => setViewPackage(true)}
                  className={`px-3 py-1.5 rounded-t-sm rounded-br-sm rounded-bl-none transition-all ${
                    viewPackage
                      ? 'bg-[#0284c7] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fitted Alloy Wheel
                </button>
              </div>
            )}
          </div>

          {/* EU Tyre Label Spec Box */}
          <div className="cymbal-box-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                Official EU Tyre Label Ratings
              </h3>
              <span className="font-mono text-[10px] text-slate-500">Reg. (EU) 2020/740</span>
            </div>

            <TyreBadge
              fuel={product.fuelEfficiency}
              wetGrip={product.wetGrip}
              noiseDb={product.noiseLevelDb}
              size="md"
            />

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="cymbal-box-md p-2">
                <span className="text-slate-500 block text-[9px] uppercase font-mono font-bold">Fuel Efficiency</span>
                <span className="font-mono font-black text-[#10b981] text-sm">Class {product.fuelEfficiency}</span>
              </div>
              <div className="cymbal-box-md p-2">
                <span className="text-slate-500 block text-[9px] uppercase font-mono font-bold">Wet Grip</span>
                <span className="font-mono font-black text-[#38bdf8] text-sm">Class {product.wetGrip}</span>
              </div>
              <div className="cymbal-box-md p-2">
                <span className="text-slate-500 block text-[9px] uppercase font-mono font-bold">Exterior Noise</span>
                <span className="font-mono font-black text-slate-200 text-sm">{product.noiseLevelDb} dB</span>
              </div>
            </div>
          </div>

          {/* Other Stores Availability Matrix */}
          <div className="cymbal-box-lg p-5 space-y-3">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-400">
              National Depot Network Availability
            </h4>
            <div className="space-y-2">
              {stores.map((s) => {
                const sStock = product.stockByStore[s.id];
                const isCur = s.id === selectedStoreId;
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-t-lg rounded-br-lg rounded-bl-none flex items-center justify-between text-xs border ${
                      isCur
                        ? 'bg-[#111a30] border-[#0284c7] font-semibold'
                        : 'bg-[#080d1a] border-[#1e293b]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span className="text-slate-200 font-bold">{s.name}</span>
                      {isCur && <span className="font-mono text-[10px] text-[#38bdf8] font-bold">[ACTIVE_DEPOT]</span>}
                    </div>
                    <StockStatusBadge
                      state={sStock?.state || 'Out of Stock'}
                      quantity={sStock?.quantity}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Store Bay Booking & Purchase / Intent Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title and Specs Header */}
          <div className="cymbal-box-lg p-6 sm:p-8 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <span>{product.season} TYRE</span>
                <span>•</span>
                <span>{product.vehicleType}</span>
                {product.runFlat && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">RUN-FLAT (RFT)</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {product.name}
              </h1>

              <div className="mt-2 inline-block px-3 py-1 cymbal-tag font-mono font-bold text-sm text-[#38bdf8] border-[#0284c7]">
                {product.tyreSize}
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline justify-between pt-2 border-t border-[#1e293b]">
              <div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-[#38bdf8]">
                  £{product.price.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Per tyre • Fully fitted inc. VAT, standard balancing, and new valve
                </p>
              </div>

              {product.recommendedRetailPrice && (
                <div className="text-right">
                  <span className="font-mono text-xs text-slate-500 line-through">
                    RRP £{product.recommendedRetailPrice.toFixed(2)}
                  </span>
                  <div className="font-mono text-xs font-bold text-emerald-400">
                    SAVE £{(product.recommendedRetailPrice - product.price).toFixed(2)} EA
                  </div>
                </div>
              )}
            </div>

            {/* Current Store Status Banner */}
            <div
              className={`p-4 rounded-t-lg rounded-br-lg rounded-bl-none border flex items-center justify-between gap-3 ${
                isOutOfStock
                  ? 'bg-[#2a080c] border-[#881337] text-[#f43f5e]'
                  : 'bg-[#022c22] border-[#064e3b] text-[#10b981]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-t-sm rounded-br-sm rounded-bl-none bg-[#0c1222] border border-[#1e293b] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#38bdf8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{selectedStore.name}</div>
                  <div className="text-[11px] font-mono opacity-90">
                    {isOutOfStock
                      ? 'Out of stock at this location'
                      : `${stockInfo.quantity} tyres in stock & ready for bay fitting`}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStoreModalOpen(true)}
                className="text-xs font-mono font-bold text-[#38bdf8] hover:underline shrink-0"
              >
                [CHANGE_DEPOT]
              </button>
            </div>

            {/* Fitting Options Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                Select Fitting Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFittingOption('in_store')}
                  className={`p-3.5 rounded-t-lg rounded-br-lg rounded-bl-none border-2 text-left transition-all ${
                    fittingOption === 'in_store'
                      ? 'border-[#0284c7] bg-[#111a30] shadow-[2px_2px_0px_#020617]'
                      : 'border-[#1e293b] bg-[#080d1a] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Wrench className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>In-Store Autocentre</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#022c22] text-[#10b981] border border-[#064e3b]">
                      FREE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Book precision bay fitting at {selectedStore.city}.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFittingOption('mobile')}
                  className={`p-3.5 rounded-t-lg rounded-br-lg rounded-bl-none border-2 text-left transition-all ${
                    fittingOption === 'mobile'
                      ? 'border-[#0284c7] bg-[#111a30] shadow-[2px_2px_0px_#020617]'
                      : 'border-[#1e293b] bg-[#080d1a] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Truck className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Mobile Van Fitting</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      +£15 / tyre
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    We come to your home or office driveway.
                  </p>
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                Quantity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`py-2.5 text-xs font-mono font-bold rounded-t-lg rounded-br-lg rounded-bl-none border transition-all ${
                      quantity === num
                        ? 'bg-[#0284c7] text-white border-[#38bdf8] shadow-[2px_2px_0px_#082f49]'
                        : 'bg-[#080d1a] text-slate-300 border-[#1e293b] hover:border-[#38bdf8]'
                    }`}
                  >
                    {num} {num === 1 ? 'Tyre' : 'Tyres'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Summary Box */}
            <div className="cymbal-box-md p-4 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>
                  {quantity}x {product.name} (£{product.price.toFixed(2)} ea)
                </span>
                <span>£{itemSubtotal.toFixed(2)}</span>
              </div>
              {unitFittingFee > 0 && (
                <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                  <span>Mobile Van Fitting ({quantity}x £15.00)</span>
                  <span>£{itemFittingTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#1e293b]">
                <span className="font-mono uppercase">Total Payable:</span>
                <span className="font-mono text-lg font-black text-[#38bdf8]">£{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* PRIMARY CTA */}
            {isOutOfStock ? (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIntentModalOpen(true)}
                  className="cymbal-btn-primary w-full py-3.5 px-6 text-sm flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-white" />
                  <span>Buy when back in stock</span>
                </button>
                <div className="text-xs text-center text-slate-400 font-mono space-y-1">
                  <p>
                    Out of stock at <strong>{selectedStore.name}</strong>.
                  </p>
                  <p className="text-[11px] text-[#38bdf8]">
                    Set price cap & auto-purchase intent via AP2 v0.2.
                  </p>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="cymbal-btn-primary w-full py-3.5 px-6 text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAdding ? 'Adding to Basket...' : '⚡ Add to Basket & Book Fitting'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Description & Technical Features */}
          <div className="cymbal-box-lg p-6 sm:p-8 space-y-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">
              Product Overview & Engineering
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-[#1e293b]">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#38bdf8]">
                Key Performance Highlights
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Out of stock Intent Modal */}
      {isIntentModalOpen && (
        <IntentModal
          isOpen={isIntentModalOpen}
          onClose={() => setIsIntentModalOpen(false)}
          product={product}
        />
      )}

      {/* Store Selector Modal */}
      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        productIdToCheck={product.id}
      />
    </div>
  );
}
