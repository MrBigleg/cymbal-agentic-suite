'use client';

import React, { useState } from 'react';
import { Product, StoreLocation, ApprovalMode, PurchaseIntent } from '@/lib/types/commerce';
import { mockCommerceService } from '@/lib/services/mockCommerceService';
import { useCommerce } from './CommerceContext';
import {
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function IntentModal({ isOpen, onClose, product }: IntentModalProps) {
  const { stores, selectedStoreId, showNotification } = useCommerce();

  const [storeId, setStoreId] = useState<string>(selectedStoreId);
  const [quantity, setQuantity] = useState<number>(2);
  const [maxTotalPrice, setMaxTotalPrice] = useState<number>(
    Number((product.price * 2 * 1.05).toFixed(2))
  );
  const [expiryDays, setExpiryDays] = useState<number>(14);
  const [allowSubstitution, setAllowSubstitution] = useState<boolean>(false);
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('automatic');
  const [customerName, setCustomerName] = useState<string>('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState<string>('alex.mercer@example.co.uk');
  const [customerPhone, setCustomerPhone] = useState<string>('07700 900823');
  const [vehicleReg, setVehicleReg] = useState<string>('BK72 XDA');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdIntent, setCreatedIntent] = useState<PurchaseIntent | null>(null);

  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    setMaxTotalPrice(Number((product.price * newQty * 1.05).toFixed(2)));
  };

  if (!isOpen) return null;

  const targetStore = stores.find((s) => s.id === storeId) || stores[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const expiresAt = new Date(Date.now() + expiryDays * 24 * 3600 * 1000).toISOString();

      const intent = await mockCommerceService.createIntent({
        productId: product.id,
        productName: product.name,
        tyreSize: product.tyreSize,
        storeId: targetStore.id,
        storeName: targetStore.name,
        quantity,
        maxTotalPrice: Number(maxTotalPrice),
        unitPriceAtCreation: product.price,
        expiresAt,
        allowSubstitution,
        approvalMode,
        customerEmail,
        customerName,
        customerPhone,
        vehicleReg,
      });

      setCreatedIntent(intent);
      showNotification({
        type: 'intent',
        title: '🎯 Conditional Purchase Intent Created',
        message: `Registered intent ${intent.id} for ${product.name} at ${targetStore.city}.`,
      });
    } catch (err) {
      console.error('Failed to create purchase intent:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="cymbal-box-lg max-w-xl w-full bg-[#0c1222] border-[#0284c7] shadow-[8px_8px_0px_#000000] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#1e293b] flex items-center justify-between bg-[#080d1a] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#111a30] border border-[#0284c7] flex items-center justify-center text-[#38bdf8]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="cymbal-stamp bg-amber-400 text-[#020617]">AP2 v0.2</span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">Pre-Authorization</span>
                </div>
                <h3 className="font-black text-lg leading-tight uppercase mt-0.5">
                  Buy When Back in Stock
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-t-sm rounded-br-sm rounded-bl-none text-slate-400 hover:text-white hover:bg-[#111a30] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!createdIntent ? (
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {/* Product summary pill */}
              <div className="cymbal-box-md p-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                    Requested Item (OOS)
                  </div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {product.name}
                  </div>
                  <div className="text-xs text-[#38bdf8] font-mono">
                    {product.tyreSize} • £{product.price.toFixed(2)} inc. VAT
                  </div>
                </div>
                <span className="cymbal-tag bg-[#2a080c] border-[#881337] text-[#f43f5e] font-mono text-[10px] font-bold">
                  OUT OF STOCK
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Store selection */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Preferred Fitting Depot
                  </label>
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full text-xs rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white p-2.5 outline-none focus:border-[#38bdf8]"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.city} ({s.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Quantity Required
                  </label>
                  <div className="flex rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] p-1">
                    {[1, 2, 4].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => handleQuantityChange(num)}
                        className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-t-sm rounded-br-sm rounded-bl-none transition-colors ${
                          quantity === num
                            ? 'bg-[#0284c7] text-white shadow-[1px_1px_0px_#082f49]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {num} {num === 1 ? 'Tyre' : 'Tyres'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Total Price */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Max Price Cap (£)</span>
                    <span className="text-[10px] text-slate-500 font-normal">AP2 Limit</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">
                      £
                    </span>
                    <input
                      type="number"
                      step="0.50"
                      min={product.price * quantity}
                      value={maxTotalPrice}
                      onChange={(e) => setMaxTotalPrice(Number(e.target.value))}
                      required
                      className="w-full text-xs font-mono font-bold pl-7 pr-3 py-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-[#38bdf8] outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>

                {/* Expiry period */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                    Intent Expiry
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full text-xs font-mono rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white p-2.5 outline-none focus:border-[#38bdf8]"
                  >
                    <option value={7}>7 Days (Urgent)</option>
                    <option value={14}>14 Days (Standard)</option>
                    <option value={30}>30 Days (Flexible)</option>
                    <option value={60}>60 Days (Extended)</option>
                  </select>
                </div>
              </div>

              {/* Vehicle & Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e293b]">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                    Vehicle Reg Plate
                  </label>
                  <input
                    type="text"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                    className="w-full font-mono text-xs uppercase p-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              {/* Substitution toggle */}
              <div className="p-3.5 cymbal-box-md flex items-start gap-3">
                <input
                  type="checkbox"
                  id="substitution"
                  checked={allowSubstitution}
                  onChange={(e) => setAllowSubstitution(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 text-[#0284c7] focus:ring-[#38bdf8]"
                />
                <label htmlFor="substitution" className="text-xs cursor-pointer">
                  <span className="font-bold text-white block">
                    Allow equivalent premium substitute
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Accept same-tier tyres (e.g. Goodyear Eagle F1 for Michelin PS5) within the price cap.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cymbal-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Signing Pre-Auth Mandate...' : 'Authorize AP2 Purchase Intent'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-5 text-center">
              <div className="w-12 h-12 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#022c22] border border-[#064e3b] text-[#10b981] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white uppercase">Intent Registered Successfully</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mandate <strong className="font-mono text-[#38bdf8]">{createdIntent.id}</strong> has been signed & committed to the deterministic policy engine.
                </p>
              </div>

              <div className="cymbal-box-md p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Item:</span>
                  <span className="text-white font-bold">{createdIntent.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Depot:</span>
                  <span className="text-slate-200">{createdIntent.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price Cap:</span>
                  <span className="text-[#38bdf8] font-bold">£{createdIntent.maxTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-[#10b981] font-bold">[ACTIVE_MONITORING]</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="cymbal-btn-primary flex-1 py-2.5 text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
