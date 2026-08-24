'use client';

import React from 'react';
import { useCommerce, AppNotification } from './CommerceContext';
import { X, CheckCircle2, AlertCircle, Sparkles, Package, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationToastContainer() {
  const { notifications, dismissNotification } = useCommerce();

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-40 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto shadow-[4px_4px_0px_#020617] rounded-t-lg rounded-br-lg rounded-bl-none p-4 border-2 backdrop-blur-md flex items-start gap-3.5 text-sm ${
              n.type === 'success'
                ? 'bg-[#062c1d]/95 text-emerald-100 border-emerald-500'
                : n.type === 'recovery'
                ? 'bg-[#2d1b06]/95 text-amber-100 border-amber-500'
                : n.type === 'intent'
                ? 'bg-[#0f172a]/95 text-cyan-100 border-[#38bdf8]'
                : n.type === 'warning'
                ? 'bg-[#2b080c]/95 text-rose-100 border-rose-500'
                : 'bg-[#0c1222]/95 text-slate-100 border-[#1e293b]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {n.type === 'recovery' && <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />}
              {n.type === 'intent' && <Clock className="w-5 h-5 text-[#38bdf8]" />}
              {n.type === 'warning' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {n.type === 'info' && <Package className="w-5 h-5 text-[#38bdf8]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm leading-tight text-white mb-1 font-mono uppercase tracking-wide">{n.title}</h4>
              <p className="text-xs text-slate-200 leading-relaxed">{n.message}</p>
            </div>

            <button
              onClick={() => dismissNotification(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded-sm hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
