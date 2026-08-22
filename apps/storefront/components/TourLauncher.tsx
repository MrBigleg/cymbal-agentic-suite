"use client";

import React, { useState } from "react";
import { useTour } from "./TourContext";
import { TOUR_TRACKS, TourTrack } from "../lib/tour-config";
import {
  Compass,
  Sparkles,
  ShieldAlert,
  ShoppingCart,
  Sliders,
  CheckCircle2,
  X,
  Play,
  Copy,
  ExternalLink,
} from "lucide-react";

export function TourLauncher() {
  const { isTourActive, isTourModalOpen, openTourModal, closeTourModal, startTour } = useTour();
  const [copiedTrack, setCopiedTrack] = useState<string | null>(null);

  const copyTourLink = (trackId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/?tour=${trackId}`;
      navigator.clipboard.writeText(url);
      setCopiedTrack(trackId);
      setTimeout(() => setCopiedTrack(null), 2000);
    }
  };

  const tracks = Object.values(TOUR_TRACKS) as TourTrack[];

  return (
    <>
      {/* Floating Launcher Trigger Pill (always available unless active) */}
      {!isTourActive && (
        <aside
          aria-label="Guided Tour Controls"
          className="fixed bottom-6 right-6 z-50 animate-bounce hover:animate-none transition-all"
        >
          <button
            onClick={openTourModal}
            className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#0c1222]/95 hover:bg-[#111a30] text-white border-2 border-[#38bdf8] rounded-t-lg rounded-br-lg rounded-bl-none shadow-[4px_4px_0px_#020617] hover:shadow-[6px_6px_0px_#0284c7] transition-all cursor-pointer backdrop-blur-md"
          >
            <div className="w-6 h-6 rounded-full bg-[#0284c7]/20 border border-[#38bdf8] flex items-center justify-center text-[#38bdf8] group-hover:rotate-45 transition-transform">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono text-[#38bdf8] font-black uppercase tracking-wider leading-none">
                Interactive Guide
              </span>
              <span className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors leading-tight">
                Judge & Shopper Tours
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1 group-hover:scale-110 transition-transform" />
          </button>
        </aside>
      )}

      {/* Tour Selection Modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0c1222] border-2 border-[#1e293b] rounded-t-xl rounded-br-xl rounded-bl-none shadow-[8px_8px_0px_#020617] overflow-hidden text-white p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-t-lg rounded-br-lg rounded-bl-none bg-[#0284c7] border border-[#38bdf8] flex items-center justify-center text-white shadow-[2px_2px_0px_#020617]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    Cymbal Guided Tours <span className="text-[#38bdf8]">& Architecture Walkthroughs</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select a track to launch interactive Driver.js spotlight guidance across our apps
                  </p>
                </div>
              </div>
              <button
                onClick={closeTourModal}
                className="text-slate-400 hover:text-white p-1 rounded-sm hover:bg-[#1e293b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Track Selection Cards */}
            <div className="grid grid-cols-1 gap-3.5">
              {tracks.map((track) => {
                const isJudge = track.id === "judge";
                return (
                  <div
                    key={track.id}
                    className={`p-4 border rounded-t-lg rounded-br-lg rounded-bl-none transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isJudge
                        ? "bg-[#111a30]/80 border-[#38bdf8]/60 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                        : "bg-[#080d1a] border-[#1e293b] hover:border-slate-600"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                            isJudge
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-blue-500/20 text-[#38bdf8] border-blue-500/40"
                          }`}
                        >
                          {track.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {track.steps.length} Steps Cross-Route
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{track.name}</h4>
                      <p className="text-xs text-slate-300">{track.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyTourLink(track.id)}
                        title="Copy direct shareable tour link for judges"
                        className="p-2 text-slate-400 hover:text-white border border-[#1e293b] hover:border-slate-500 rounded bg-[#0c1222] transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTrack === track.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-mono hidden sm:inline">Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => startTour(track.id as "judge" | "customer" | "manager")}
                        className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-t-sm rounded-br-sm rounded-bl-none border border-[#38bdf8] transition-all shadow-[2px_2px_0px_#020617] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Tour</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer tips */}
            <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Tip: Use Left/Right keys or in-popover actions to navigate</span>
              <button
                onClick={closeTourModal}
                className="text-slate-300 hover:text-white underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
