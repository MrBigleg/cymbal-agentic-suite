'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCommerce } from '@/components/CommerceContext';
import { mockCommerceService } from '@/lib/services/mockCommerceService';
import { CheckoutSession } from '@/lib/types/commerce';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, selectedStore, refreshData, showNotification } = useCommerce();

  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@example.co.uk');
  const [phone, setPhone] = useState('07700 900823');
  const [vehicleReg, setVehicleReg] = useState('BK72 XDA');
  const [address, setAddress] = useState('42 Highfield Lane');
  const [postcode, setPostcode] = useState('B15 3TR');

  // Fitting Slot
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 - 11:00');

  // Payment method
  const [paymentType, setPaymentType] = useState<'simulated_card' | 'simulated_agent_wallet'>('simulated_card');

  // Initialize or fetch checkout session
  useEffect(() => {
    async function initCheckout() {
      try {
        let active = await mockCommerceService.getActiveCheckout();
        if (!active && cart.items.length > 0) {
          active = await mockCommerceService.createCheckout();
        }
        setCheckoutSession(active);
      } catch (err) {
        console.error('Failed to init checkout:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initCheckout();

    const unsubState = mockCommerceService.subscribeToState(async () => {
      const active = await mockCommerceService.getActiveCheckout();
      if (active) setCheckoutSession(active);
    });

    return () => {
      unsubState();
    };
  }, [cart.items.length]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutSession) return;

    setIsProcessing(true);

    try {
      await mockCommerceService.updateCheckout(checkoutSession.checkoutId, {
        customer: {
          name,
          email,
          phone,
          vehicleReg,
        },
        fittingSlot: {
          date: selectedDate,
          timeSlot: selectedTimeSlot,
        },
      });

      const order = await mockCommerceService.completeCheckout(checkoutSession.checkoutId, {
        method: paymentType === 'simulated_card' ? 'Visa •••• 4242' : 'AP2 Agent Wallet',
      });

      await refreshData();
      router.push(`/order/${order.orderId}/complete`);
    } catch (err) {
      console.error('Failed to complete order:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-[#0284c7] border-t-transparent rounded-full mx-auto" />
        <p className="font-mono text-xs text-slate-400">Initializing UCP checkout session...</p>
      </div>
    );
  }

  if (!checkoutSession || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white uppercase">Checkout Session Not Found</h1>
        <p className="text-xs text-slate-400">Your basket is empty or session expired.</p>
        <Link
          href="/shop"
          className="cymbal-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/cart" className="hover:text-[#38bdf8] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Basket</span>
          </Link>
          <span>/</span>
          <span className="text-[#38bdf8] font-bold">UCP 4-STAGE CHECKOUT</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="cymbal-stamp bg-[#38bdf8] text-[#020617]">UCP v1.0</span>
          <span className="cymbal-tag text-slate-300 font-mono text-[10px]">
            SESSION: {checkoutSession.checkoutId.slice(0, 8)}...
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4-Stage Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-6">
          {/* Stage 1: Vehicle & Customer Info */}
          <div className="cymbal-box-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b]">STAGE 1</span>
                <h2 className="font-bold text-sm uppercase tracking-wider text-white">
                  Vehicle & Contact Details
                </h2>
              </div>
              <span className="font-mono text-[10px] text-emerald-400">● VERIFIED_FITMENT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Vehicle Registration
                </label>
                <div className="cymbal-plate p-1 w-full">
                  <div className="bg-[#1d4ed8] text-white font-bold text-[8px] px-1.5 py-1 rounded-t-sm rounded-br-sm rounded-bl-none select-none">
                    UK
                  </div>
                  <input
                    type="text"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                    className="bg-[#f59e0b] text-[#020617] font-mono font-black text-sm uppercase px-2 py-0.5 outline-none w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Stage 2: Fitting Bay Schedule */}
          <div className="cymbal-box-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b]">STAGE 2</span>
                <h2 className="font-bold text-sm uppercase tracking-wider text-white">
                  Autocentre Bay Appointment
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#38bdf8]">
                {selectedStore.name} ({selectedStore.city})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#38bdf8]" />
                  <span>Select Date</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#38bdf8]" />
                  <span>Select 1-Hour Bay Slot</span>
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-t-lg rounded-br-lg rounded-bl-none border border-[#1e293b] bg-[#111a30] text-white outline-none focus:border-[#38bdf8]"
                >
                  <option value="08:30 - 09:30">08:30 - 09:30 (Early Bird)</option>
                  <option value="10:00 - 11:00">10:00 - 11:00 (Popular)</option>
                  <option value="11:30 - 12:30">11:30 - 12:30</option>
                  <option value="14:00 - 15:00">14:00 - 15:00</option>
                  <option value="15:30 - 16:30">15:30 - 16:30</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stage 3: Simulated Payment Settlement */}
          <div className="cymbal-box-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <span className="cymbal-stamp bg-[#111a30] text-[#38bdf8] border border-[#1e293b]">STAGE 3</span>
                <h2 className="font-bold text-sm uppercase tracking-wider text-white">
                  Payment Method
                </h2>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-BIT ENCRYPTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType('simulated_card')}
                className={`p-3.5 rounded-t-lg rounded-br-lg rounded-bl-none border-2 text-left transition-all ${
                  paymentType === 'simulated_card'
                    ? 'border-[#0284c7] bg-[#111a30] shadow-[2px_2px_0px_#020617]'
                    : 'border-[#1e293b] bg-[#080d1a] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-white mb-1">
                  <CreditCard className="w-4 h-4 text-[#38bdf8]" />
                  <span>Debit / Credit Card</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">Visa / Mastercard / Amex</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('simulated_agent_wallet')}
                className={`p-3.5 rounded-t-lg rounded-br-lg rounded-bl-none border-2 text-left transition-all ${
                  paymentType === 'simulated_agent_wallet'
                    ? 'border-[#0284c7] bg-[#111a30] shadow-[2px_2px_0px_#020617]'
                    : 'border-[#1e293b] bg-[#080d1a] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-white mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AP2 Agent Wallet</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">Autonomous Mandate Settlement</p>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="cymbal-btn-primary w-full py-4 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Settling Payment & Booking Bay...' : `Confirm Order • £${cart.total.toFixed(2)}`}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Order Summary & Recovery Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cymbal-box-lg p-6 space-y-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1e293b] pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between items-start text-xs">
                  <div>
                    <span className="text-white font-bold block">{item.product?.name}</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {item.quantity}x @ £{(item.product?.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#38bdf8]">
                    £{((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1e293b] space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>£{cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fitting:</span>
                <span className="text-emerald-400 font-bold">
                  {cart.fittingTotal === 0 ? 'FREE' : `£${cart.fittingTotal.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>VAT (20%):</span>
                <span>£{((cart.total * 20) / 120).toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-[#1e293b] flex justify-between font-bold text-base text-white">
                <span className="uppercase">Total:</span>
                <span className="font-mono text-xl font-black text-[#38bdf8]">£{cart.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Operator Recovery Simulation Controls */}
            <div className="p-3.5 cymbal-box-md text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[10px] text-amber-400 flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> DEMO SIMULATOR
                </span>
                <span className="cymbal-tag text-[9px] text-slate-400">AGENTIC LOOP #2</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Simulate a stalled checkout to trigger the autonomous Cart Recovery Agent.
              </p>
              <Link
                href="/demo-controls"
                className="cymbal-btn-secondary w-full py-1.5 text-center block text-[11px] font-mono"
              >
                Open Demo Controls
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
