export interface ExperienceIncident {
  incidentId: string;
  storeName: string;
  rating?: number;
  feedback?: string;
  assignedTo?: string;
  status?: string;
  portalUrl: string;
}

export function buildExperienceAlertCard(incident: ExperienceIncident) {
  return {
    cardsV2: [
      {
        cardId: incident.incidentId,
        card: {
          header: {
            title: `⚠️ ${incident.storeName} Experience Alert`,
            subtitle: `Detractor Survey: ${incident.rating}/10`,
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<b>Feedback:</b> "${incident.feedback}"`,
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
                            parameters: [{ key: "incidentId", value: incident.incidentId }],
                          },
                        },
                      },
                      {
                        text: "👤 Assign",
                        onClick: {
                          action: {
                            function: "handleAssign",
                            parameters: [{ key: "incidentId", value: incident.incidentId }],
                          },
                        },
                      },
                      {
                        text: "✕ Dismiss",
                        onClick: {
                          action: {
                            function: "handleDismiss",
                            parameters: [{ key: "incidentId", value: incident.incidentId }],
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
  return {
    cardsV2: [
      {
        cardId: incident.incidentId,
        card: {
          header: {
            title: `⚠️ ${incident.storeName} Experience Alert`,
            subtitle: `Status: ✓ ${incident.status} (Assigned: ${incident.assignedTo})`,
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
