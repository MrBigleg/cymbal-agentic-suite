import { NextResponse } from "next/server";
import { parseA2AMessage } from "@cymbal/commerce-protocol";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseA2AMessage(body);
    if (!parsed.valid) {
      return NextResponse.json({ jsonrpc: "2.0", error: { code: -32600, message: parsed.error } }, { status: 400 });
    }
    return NextResponse.json({ jsonrpc: "2.0", id: body.id ?? "1", result: { status: "RECEIVED", processedAt: new Date().toISOString() } });
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }
}
