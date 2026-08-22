import { describe, it, expect } from "vitest";
import { TOUR_TRACKS } from "../../lib/tour-config";

describe("Driver.js Multi-Track Tour Configuration", () => {
  it("should define all three required tracks: judge, customer, manager", () => {
    expect(TOUR_TRACKS).toHaveProperty("judge");
    expect(TOUR_TRACKS).toHaveProperty("customer");
    expect(TOUR_TRACKS).toHaveProperty("manager");
  });

  describe("Judge Architecture Tour (Track 1)", () => {
    const judgeTrack = TOUR_TRACKS.judge;

    it("should contain exactly 6 cross-route steps", () => {
      expect(judgeTrack.steps).toHaveLength(6);
    });

    it("should properly cover all 6 routes in sequence", () => {
      const routes = judgeTrack.steps.map((s) => s.route);
      expect(routes).toEqual([
        "/",
        "/",
        "/shop",
        "/cart",
        "/demo-controls",
        "/manager/incidents/inc_001",
      ]);
    });

    it("should include protocol badges for key steps", () => {
      const protocolBadges = judgeTrack.steps.map((s) => s.protocolBadge);
      expect(protocolBadges).toContain("OKF PROTOCOL");
      expect(protocolBadges).toContain("GOOGLE ADK 2.5");
      expect(protocolBadges).toContain("AP2 v0.2");
      expect(protocolBadges).toContain("A2A + UCP");
    });

    it("should provide action triggers for live interactive steps", () => {
      const aiAssistantStep = judgeTrack.steps.find((s) => s.id === "judge-step-2-ai-assistant");
      expect(aiAssistantStep?.action?.actionId).toBe("OPEN_AI_ASSISTANT");

      const demoControlsStep = judgeTrack.steps.find((s) => s.id === "judge-step-5-demo-controls");
      expect(demoControlsStep?.action?.actionId).toBe("TRIGGER_STOCK_REPLENISH");
    });
  });

  describe("Customer Experience Tour (Track 2)", () => {
    const customerTrack = TOUR_TRACKS.customer;

    it("should contain 4 customer onboarding steps", () => {
      expect(customerTrack.steps).toHaveLength(4);
    });

    it("should have valid DOM selectors for all steps", () => {
      customerTrack.steps.forEach((step) => {
        expect(step.selector).toMatch(/^\[data-tour="[^"]+"\]$/);
        expect(step.title.length).toBeGreaterThan(3);
        expect(step.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe("Store Manager & HITL Tour (Track 3)", () => {
    const managerTrack = TOUR_TRACKS.manager;

    it("should contain 3 operational incident steps on /manager/incidents/inc_001", () => {
      expect(managerTrack.steps).toHaveLength(3);
      managerTrack.steps.forEach((step) => {
        expect(step.route).toBe("/manager/incidents/inc_001");
      });
    });

    it("should highlight BigQuery anomaly and Places Insights sentiment", () => {
      const selectors = managerTrack.steps.map((s) => s.selector);
      expect(selectors).toContain('[data-tour="incident-metrics-panel"]');
      expect(selectors).toContain('[data-tour="sentiment-insights-panel"]');
      expect(selectors).toContain('[data-tour="hitl-action-buttons"]');
    });
  });
});
