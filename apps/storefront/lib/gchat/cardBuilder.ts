export interface ExperienceIncident {
  incidentId: string;
  storeName: string;
  rating?: number;
  feedback?: string;
  assignedTo?: string;
  status?: string;
  portalUrl: string;
}

/**
 * Escapes HTML entities to prevent formatting injection or tag breakage in Google Chat cards.
 */
export function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildExperienceAlertCard(incident: ExperienceIncident) {
  const safeStoreName = escapeHtml(incident.storeName);
  const safeFeedback = escapeHtml(incident.feedback || "No additional feedback provided.");
  const safeIncidentId = escapeHtml(incident.incidentId);

  return {
    cardsV2: [
      {
        cardId: safeIncidentId,
        card: {
          header: {
            title: `⚠️ ${safeStoreName} Experience Alert`,
            subtitle: `Detractor Survey: ${incident.rating ?? "N/A"}/10`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<b>Feedback:</b> "${safeFeedback}"`,
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: "⚡ Open Investigation",
                        onClick: {
                          action: {
                            function: "handleInvestigate",
                            parameters: [{ key: "incidentId", value: safeIncidentId }],
                          },
                        },
                      },
                      {
                        text: "👤 Assign",
                        onClick: {
                          action: {
                            function: "handleAssign",
                            parameters: [{ key: "incidentId", value: safeIncidentId }],
                          },
                        },
                      },
                      {
                        text: "✕ Dismiss",
                        onClick: {
                          action: {
                            function: "handleDismiss",
                            parameters: [{ key: "incidentId", value: safeIncidentId }],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

export function buildResolvedCard(incident: ExperienceIncident) {
  const safeStoreName = escapeHtml(incident.storeName);
  const safeStatus = escapeHtml(incident.status || "Investigating");
  const safeAssigned = escapeHtml(incident.assignedTo || "Unassigned");
  const safeIncidentId = escapeHtml(incident.incidentId);

  return {
    cardsV2: [
      {
        cardId: safeIncidentId,
        card: {
          header: {
            title: `⚠️ ${safeStoreName} Experience Alert`,
            subtitle: `Status: ✓ ${safeStatus} (Assigned: ${safeAssigned})`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<i>Investigation opened by manager. Tracked in Cymbal Corporate Portal.</i>`,
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: "🔍 View Full Investigation",
                        onClick: {
                          openLink: {
                            url: incident.portalUrl,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

