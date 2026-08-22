import { NextResponse } from "next/server";
import { buildResolvedCard, escapeHtml } from "@/lib/gchat/cardBuilder";

export async function POST(req: Request) {
  try {
    // In production, verify Google Chat Bearer Token or Verification Token
    const authHeader = req.headers.get("authorization") || "";
    const verificationToken = req.headers.get("x-goog-chat-token") || "";
    const expectedToken = process.env.GCHAT_VERIFICATION_TOKEN || "";
    const isEnforced = process.env.NODE_ENV === "production" && expectedToken.length > 0;

    if (isEnforced) {
      const isValid = (authHeader.startsWith("Bearer ") && authHeader.length > 10) || verificationToken === expectedToken;
      if (!isValid) {
        return NextResponse.json({ error: "Unauthorized: Invalid Google Chat credentials" }, { status: 401 });
      }
    }

    const event = await req.json();
    const action = event.action?.actionMethodName;
    const rawIncidentId = event.action?.parameters?.find((p: { key: string }) => p.key === "incidentId")?.value || "inc_001";
    // Sanitize incident ID
    const incidentId = escapeHtml(rawIncidentId.replace(/[^a-zA-Z0-9_-]/g, ""));

    if (action === "handleInvestigate") {
      const updatedCard = buildResolvedCard({
        incidentId,
        storeName: "Birmingham Autocentre",
        assignedTo: "Sarah (Service Lead)",
        status: "In Progress",
        portalUrl: `http://localhost:3000/manager/incidents/${encodeURIComponent(incidentId)}`,
      });
      return NextResponse.json({
        actionResponse: { type: "UPDATE_MESSAGE" },
        ...updatedCard,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to process GChat interaction" }, { status: 500 });
  }
}
