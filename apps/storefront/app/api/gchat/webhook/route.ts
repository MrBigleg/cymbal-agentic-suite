import { NextResponse } from "next/server";
import { buildResolvedCard } from "@/lib/gchat/cardBuilder";

export async function POST(req: Request) {
  try {
    const event = await req.json();
    const action = event.action?.actionMethodName;
    const incidentId = event.action?.parameters?.find((p: { key: string }) => p.key === "incidentId")?.value || "inc_001";

    if (action === "handleInvestigate") {
      const updatedCard = buildResolvedCard({
        incidentId,
        storeName: "Birmingham Autocentre",
        assignedTo: "Sarah (Service Lead)",
        status: "In Progress",
        portalUrl: `http://localhost:3000/manager/incidents/${incidentId}`,
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
