"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { driver, Driver } from "driver.js";
import { TOUR_TRACKS, TourTrack, TourStepConfig } from "../lib/tour-config";

interface TourContextType {
  isTourActive: boolean;
  activeTrackId: string | null;
  currentStepIndex: number;
  isTourModalOpen: boolean;
  openTourModal: () => void;
  closeTourModal: () => void;
  startTour: (trackId: "judge" | "customer" | "manager", stepIndex?: number) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isTourActive, setIsTourActive] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [pendingStepIndex, setPendingStepIndex] = useState<number | null>(null);

  const driverRef = useRef<Driver | null>(null);
  const renderStepRef = useRef<((stepIdx: number, track: TourTrack) => void) | null>(null);

  const activeTrack: TourTrack | null = activeTrackId ? TOUR_TRACKS[activeTrackId] || null : null;

  // Cleanup helper
  const endTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setIsTourActive(false);
    setActiveTrackId(null);
    setCurrentStepIndex(0);
    setPendingStepIndex(null);
  }, []);

  const openTourModal = useCallback(() => setIsTourModalOpen(true), []);
  const closeTourModal = useCallback(() => setIsTourModalOpen(false), []);

  // Action dispatcher for interactive buttons inside popovers
  const handleCustomAction = useCallback((actionId: string) => {
    window.dispatchEvent(new CustomEvent("cymbal-tour-action", { detail: { actionId } }));
  }, []);

  // Build HTML for Neo-Brutalist Popover
  const buildPopoverHtml = useCallback(
    (step: TourStepConfig, track: TourTrack, stepIdx: number, totalSteps: number) => {
      const hasAction = !!step.action;
      const isFirst = stepIdx === 0;
      const isLast = stepIdx === totalSteps - 1;

      return `
        <div class="cymbal-tour-popover font-sans text-slate-100">
          <div class="flex items-center justify-between gap-2 border-b border-[#1e293b] pb-2 mb-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-[#38bdf8] border border-blue-500/30 font-bold">
                ${track.badge}
              </span>
              ${
                step.protocolBadge
                  ? `<span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                      ${step.protocolBadge}
                    </span>`
                  : ""
              }
            </div>
            <span class="text-[10px] font-mono text-slate-400 font-bold">
              ${stepIdx + 1}/${totalSteps}
            </span>
          </div>

          <h4 class="text-sm font-bold text-white mb-1.5 tracking-tight">${step.title}</h4>
          <p class="text-xs text-slate-300 leading-relaxed mb-3">${step.description}</p>

          ${
            hasAction
              ? `<div class="mb-3">
                  <button
                    id="cymbal-tour-action-btn"
                    data-action-id="${step.action?.actionId}"
                    class="w-full py-1.5 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-t-sm rounded-br-sm rounded-bl-none border border-[#38bdf8] transition-all shadow-[2px_2px_0px_#020617] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>${step.action?.label}</span>
                  </button>
                </div>`
              : ""
          }

          <div class="flex items-center justify-between pt-2 border-t border-[#1e293b] gap-2">
            <button
              id="cymbal-tour-prev-btn"
              class="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-white border border-[#1e293b] hover:border-slate-600 rounded-t-sm rounded-br-sm rounded-bl-none transition-colors ${
                isFirst ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              }"
              ${isFirst ? "disabled" : ""}
            >
              Back
            </button>
            <div class="flex items-center gap-1.5">
              <button
                id="cymbal-tour-skip-btn"
                class="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                id="cymbal-tour-next-btn"
                class="px-3 py-1 bg-[#38bdf8] hover:bg-[#0284c7] text-[#0c1222] hover:text-white font-bold text-xs rounded-t-sm rounded-br-sm rounded-bl-none transition-colors cursor-pointer shadow-[1px_1px_0px_#020617]"
              >
                ${isLast ? "Finish Tour" : "Next Step →"}
              </button>
            </div>
          </div>
        </div>
      `;
    },
    []
  );

  // Render a specific step
  const renderStep = useCallback(
    (stepIdx: number, track: TourTrack) => {
      const step = track.steps[stepIdx];
      if (!step) return;

      if (!driverRef.current) {
        driverRef.current = driver({
          showProgress: false,
          animate: true,
          allowClose: true,
          onDestroyStarted: () => {
            endTour();
          },
        });
      }

      const driverObj = driverRef.current;

      const element = document.querySelector(step.selector);
      if (!element) {
        if (pathname !== step.route) {
          setPendingStepIndex(stepIdx);
          router.push(step.route);
        }
        return;
      }

      driverObj.highlight({
        element: step.selector,
        popover: {
          description: buildPopoverHtml(step, track, stepIdx, track.steps.length),
          side: step.position || "bottom",
          align: "start",
          onPopoverRender: (popover) => {
            const nextBtn = popover.wrapper.querySelector("#cymbal-tour-next-btn");
            const prevBtn = popover.wrapper.querySelector("#cymbal-tour-prev-btn");
            const skipBtn = popover.wrapper.querySelector("#cymbal-tour-skip-btn");
            const actionBtn = popover.wrapper.querySelector("#cymbal-tour-action-btn");

            if (nextBtn) {
              nextBtn.addEventListener("click", () => {
                const nextIdx = stepIdx + 1;
                if (nextIdx < track.steps.length) {
                  const targetStep = track.steps[nextIdx];
                  setCurrentStepIndex(nextIdx);
                  if (targetStep.route !== pathname) {
                    driverObj.destroy();
                    setPendingStepIndex(nextIdx);
                    router.push(targetStep.route);
                  } else {
                    renderStepRef.current?.(nextIdx, track);
                  }
                } else {
                  endTour();
                }
              });
            }

            if (prevBtn && stepIdx > 0) {
              prevBtn.addEventListener("click", () => {
                const prevIdx = stepIdx - 1;
                const targetStep = track.steps[prevIdx];
                setCurrentStepIndex(prevIdx);
                if (targetStep.route !== pathname) {
                  driverObj.destroy();
                  setPendingStepIndex(prevIdx);
                  router.push(targetStep.route);
                } else {
                  renderStepRef.current?.(prevIdx, track);
                }
              });
            }

            if (skipBtn) {
              skipBtn.addEventListener("click", () => {
                endTour();
              });
            }

            if (actionBtn) {
              actionBtn.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLElement;
                const actionId = target.getAttribute("data-action-id");
                if (actionId) {
                  handleCustomAction(actionId);
                }
              });
            }
          },
        },
      });
    },
    [buildPopoverHtml, endTour, handleCustomAction, pathname, router]
  );

  useEffect(() => {
    renderStepRef.current = renderStep;
  }, [renderStep]);

  // Start a tour track
  const startTour = useCallback(
    (trackId: "judge" | "customer" | "manager", stepIndex = 0) => {
      const track = TOUR_TRACKS[trackId];
      if (!track || !track.steps.length) return;

      setIsTourActive(true);
      setActiveTrackId(trackId);
      setCurrentStepIndex(stepIndex);
      setIsTourModalOpen(false);

      const targetStep = track.steps[stepIndex];
      if (targetStep.route !== pathname) {
        setPendingStepIndex(stepIndex);
        router.push(targetStep.route);
      } else {
        setTimeout(() => {
          renderStepRef.current?.(stepIndex, track);
        }, 150);
      }
    },
    [pathname, router]
  );

  const nextStep = useCallback(() => {
    if (!activeTrack) return;
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < activeTrack.steps.length) {
      const targetStep = activeTrack.steps[nextIdx];
      setCurrentStepIndex(nextIdx);
      if (targetStep.route !== pathname) {
        if (driverRef.current) driverRef.current.destroy();
        setPendingStepIndex(nextIdx);
        router.push(targetStep.route);
      } else {
        renderStepRef.current?.(nextIdx, activeTrack);
      }
    } else {
      endTour();
    }
  }, [activeTrack, currentStepIndex, endTour, pathname, router]);

  const prevStep = useCallback(() => {
    if (!activeTrack || currentStepIndex <= 0) return;
    const prevIdx = currentStepIndex - 1;
    const targetStep = activeTrack.steps[prevIdx];
    setCurrentStepIndex(prevIdx);
    if (targetStep.route !== pathname) {
      if (driverRef.current) driverRef.current.destroy();
      setPendingStepIndex(prevIdx);
      router.push(targetStep.route);
    } else {
      renderStepRef.current?.(prevIdx, activeTrack);
    }
  }, [activeTrack, currentStepIndex, pathname, router]);

  // Handle route changes and pending step resume
  useEffect(() => {
    if (!isTourActive || !activeTrack || pendingStepIndex === null) return;

    const stepIdx = pendingStepIndex;
    const step = activeTrack.steps[stepIdx];
    if (step && pathname === step.route) {
      let retries = 0;
      const interval = setInterval(() => {
        retries++;
        const el = document.querySelector(step.selector);
        if (el || retries > 25) {
          clearInterval(interval);
          setPendingStepIndex(null);
          if (el) {
            renderStepRef.current?.(stepIdx, activeTrack);
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [activeTrack, isTourActive, pathname, pendingStepIndex]);

  // Support URL direct query param launch: ?tour=judge
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tourParam = urlParams.get("tour");
      if (tourParam && (tourParam === "judge" || tourParam === "customer" || tourParam === "manager")) {
        const timer = setTimeout(() => {
          startTour(tourParam);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [startTour]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        activeTrackId,
        currentStepIndex,
        isTourModalOpen,
        openTourModal,
        closeTourModal,
        startTour,
        endTour,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
