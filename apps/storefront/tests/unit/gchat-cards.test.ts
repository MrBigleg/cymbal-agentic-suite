import { describe, it, expect } from "vitest";
import { buildExperienceAlertCard, buildResolvedCard } from "../../lib/gchat/cardBuilder";

describe("Google Chat In-Place Card Builder", () => {
  it("builds actionable alert card with Investigate, Assign, and Dismiss actions", () => {
    const card = buildExperienceAlertCard({
      incidentId: "inc_901",
      storeName: "Birmingham Autocentre",
      rating: 2,
      feedback: "Fitting delayed by 45m",
      portalUrl: "http://localhost:3000/manager/incidents/inc_901"
    });

    expect(card.cardsV2[0].card.header.title).toContain("Birmingham Autocentre Experience Alert");
    const widgets = card.cardsV2[0].card.sections[0].widgets;
    expect(widgets.some(w => w.buttonList?.buttons.some(b => b.text === "⚡ Open Investigation"))).toBe(true);
  });

  it("builds in-place updated card upon manager action", () => {
    const updatedCard = buildResolvedCard({
      incidentId: "inc_901",
      storeName: "Birmingham Autocentre",
      assignedTo: "Sarah (Service Lead)",
      status: "In Progress",
      portalUrl: "http://localhost:3000/manager/incidents/inc_901"
    });

    expect(updatedCard.cardsV2[0].card.header.subtitle).toBe("Status: ✓ In Progress (Assigned: Sarah (Service Lead))");
    const widgets = updatedCard.cardsV2[0].card.sections[0].widgets;
    expect(widgets.some(w => w.buttonList?.buttons.some(b => b.text === "🔍 View Full Investigation"))).toBe(true);
  });
});
