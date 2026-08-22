'use client';

import React from 'react';
import { useCommerce } from './CommerceContext';
import { MapPin, Phone, Clock, Check, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIdToCheck?: string;
}

export function StoreSelectorModal({
  isOpen,
  onClose,
  productIdToCheck,
}: StoreSelectorModalProps) {
  const { stores, selectedStoreId, setSelectedStoreId, products } = useCommerce();

  if (!isOpen) return null;

  const product = productIdToCheck ? products.find((p) => p.id === productIdToCheck) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="cymbal-box-lg max-w-2xl w-full bg-[#0c1222] border-[#0284c7] shadow-[8px_8px_0px_#000000] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-[#1e293b] flex items-center justify-between bg-[#080d1a]">
            <div>
              <div className="flex items-center gap-2">
                <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">NETWORK</span>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  AUTOCENTRE DEPOT SELECTION
                </span>
              </div>
              <h2 className="text-xl font-black text-white uppercase mt-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#38bdf8]" />
                Select Your Cymbal Autocentre Depot
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose your local fitting hub for same-day collection & certified technician bay fitting.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-t-sm rounded-br-sm rounded-bl-none text-slate-400 hover:text-white hover:bg-[#111a30] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Store List */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {stores.map((store) => {
              const isSelected = store.id === selectedStoreId;
              const stockInfo = product ? product.stockByStore[store.id] : null;

              return (
                <div
                  key={store.id}
                  onClick={async () => {
                    await setSelectedStoreId(store.id);
                    onClose();
                  }}
                  className={`p-4 sm:p-5 rounded-t-lg rounded-br-lg rounded-bl-none border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#0284c7] bg-[#111a30] shadow-[3px_3px_0px_#020617]'
                      : 'border-[#1e293b] hover:border-[#38bdf8] bg-[#080d1a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-white">
                          {store.name}
                        </span>
                        {isSelected && (
                          <span className="cymbal-tag bg-[#022c22] text-[#10b981] border-[#064e3b] font-mono text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> ACTIVE DEPOT
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 mt-1.5 flex items-start gap-1.5 font-mono">
                        <MapPin className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                        <span>{store.address}, {store.postcode}</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#1e293b] text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{store.openingHours}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{store.phone}</span>
                        </div>
                      </div>

                      {product && stockInfo && (
                        <div className="mt-3 p-2.5 rounded-t-sm rounded-br-sm rounded-bl-none bg-[#111a30] border border-[#1e293b] flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300">
                            Availability for <strong className="text-white">{product.name}</strong>:
                          </span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded-t-sm rounded-br-sm rounded-bl-none ${
                              stockInfo.state === 'In Stock'
                                ? 'bg-[#022c22] text-[#10b981] border border-[#064e3b]'
                                : stockInfo.state === 'Low Stock'
                                ? 'bg-[#2a1704] text-[#f59e0b] border border-[#78350f]'
                                : 'bg-[#2a080c] text-[#f43f5e] border border-[#881337]'
                            }`}
                          >
                            {stockInfo.state} ({stockInfo.quantity} available)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-[#080d1a] border-t border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              All centres equipped with Hunter 3D wheel laser alignment.
            </span>
            <button
              onClick={onClose}
              className="cymbal-btn-secondary px-4 py-1.5 text-xs font-mono"
            >
              [DONE]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
