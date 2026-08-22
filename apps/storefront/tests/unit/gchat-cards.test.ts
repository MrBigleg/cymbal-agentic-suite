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

  it("escapes malicious HTML tags in customer feedback and store names", () => {
    const maliciousCard = buildExperienceAlertCard({
      incidentId: "inc_xss_01",
      storeName: "London <script>alert('pwn')</script>",
      rating: 1,
      feedback: 'Very bad service <img src="x" onerror="alert(1)"/> & "quotes"',
      portalUrl: "http://localhost:3000/manager/incidents/inc_xss_01"
    });

    const headerTitle = maliciousCard.cardsV2[0].card.header.title;
    expect(headerTitle).not.toContain("<script>");
    expect(headerTitle).toContain("&lt;script&gt;");

    const feedbackText = maliciousCard.cardsV2[0].card.sections[0].widgets[0].textParagraph?.text;
    expect(feedbackText).not.toContain('<img src="x"');
    expect(feedbackText).toContain('&lt;img src=&quot;x&quot;');
    expect(feedbackText).toContain('&amp;');
  });
});

