'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCommerce } from '@/components/CommerceContext';
import { StoreSelectorModal } from '@/components/StoreSelectorModal';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Wrench,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    selectedStore,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCommerce();

  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const cartItemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-t-2xl rounded-br-2xl rounded-bl-none bg-[#111a30] border border-[#1e293b] text-slate-400 mx-auto flex items-center justify-center shadow-[4px_4px_0px_#020617]">
          <ShoppingCart className="w-10 h-10 text-[#38bdf8]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Your Tyre Basket is Empty
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Choose your vehicle tyres and select your preferred fitting centre or mobile technician service.
          </p>
        </div>
        <Link
          href="/shop"
          className="cymbal-btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Tyres</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">UCP BASKET</span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
              SESSION ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1 tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-[#38bdf8]" />
            Your Tyre Basket
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Review your selected tyres and confirm your fitting appointment.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="font-mono text-xs text-[#f43f5e] hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>[CLEAR_ALL_ITEMS]</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Depot Bar */}
          <div className="p-4 cymbal-box-md flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <div>
                <span className="font-bold text-white">
                  Designated Fitting Autocentre:
                </span>
                <span className="text-[#38bdf8] font-bold ml-1">{selectedStore.name}</span>
                <span className="text-slate-400 font-mono text-[11px] block sm:inline sm:ml-2">
                  ({selectedStore.address})
                </span>
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

          {/* Items */}
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="cymbal-box-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#1e293b] flex items-center justify-center shrink-0 p-2">
                  <Image
                    src={item.productImage || '/tyres/goodyear-eagle-f1.png'}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="object-contain max-h-16 drop-shadow-md"
                  />
                </div>

                <div className="space-y-1">
                  <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b] text-[9px]">
                    {item.brand}
                  </span>
                  <h3 className="font-bold text-base text-white leading-tight">
                    {item.productName}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="text-[#38bdf8]">{item.tyreSize}</span>
                    <span>•</span>
                    <span>£{item.unitPrice.toFixed(2)} / tyre</span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-0.5">
                    {item.fittingOption === 'mobile' ? (
                      <>
                        <Truck className="w-3 h-3 text-[#38bdf8]" />
                        <span>Mobile Van Fitting (+£15.00/tyre)</span>
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3 h-3 text-emerald-400" />
                        <span>In-Store Bay Fitting (Included Free)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-t-sm rounded-br-sm rounded-bl-none border border-[#1e293b] bg-[#111a30] p-0.5">
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs px-2 text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 rounded-t-sm rounded-br-sm rounded-bl-none text-slate-400 hover:text-[#f43f5e] hover:bg-[#2a080c] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="font-mono text-lg font-black text-[#38bdf8]">
                    £{(item.unitPrice * item.quantity + (item.fittingOption === 'mobile' ? 15 * item.quantity : 0)).toFixed(2)}
                  </div>
                  <div className="font-mono text-[9px] text-slate-500 uppercase">
                    inc. VAT & fittings
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cymbal-box-lg p-6 space-y-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1e293b] pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tyres Subtotal ({cartItemCount} items):</span>
                <span className="text-white font-bold">£{cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bay Fitting & Balancing:</span>
                <span className="text-emerald-400 font-bold">
                  {cart.fittingTotal === 0 ? 'FREE' : `£${cart.fittingTotal.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>VAT (20% Included):</span>
                <span>£{cart.taxTotal.toFixed(2)}</span>
              </div>

              {cart.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Recovery Promo Discount:</span>
                  <span>-£{cart.discountTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#1e293b] flex justify-between items-baseline font-bold text-base text-white">
                <span className="uppercase">Total Payable:</span>
                <span className="font-mono text-2xl font-black text-[#38bdf8]">£{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/checkout"
                className="cymbal-btn-primary w-full py-3.5 text-xs flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-3 cymbal-box-md text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Fitment Guarantee</span>
              </div>
              <p className="text-[10px]">
                Laser wheel alignment, free valves, balancing, and old tyre recycling included.
              </p>
            </div>
          </div>
        </div>
      </div>

      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />
    </div>
  );
}
