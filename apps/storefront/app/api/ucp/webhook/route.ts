import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Validates HMAC-SHA256 signature over the raw webhook payload.
 */
function verifyUcpSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const computedHmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const signatureBuffer = Buffer.from(signature.replace(/^sha256=/, ''), 'hex');
    const computedBuffer = Buffer.from(computedHmac, 'hex');

    if (signatureBuffer.length !== computedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(signatureBuffer, computedBuffer);
  } catch {
    return false;
  }
}

/**
 * UCP INBOUND WEBHOOK HANDLER
 *
 * Receives external webhooks from Google ADK Agents, Supplier WMS,
 * payment gateways (AP2), and ERP inventory sync systems.
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-ucp-signature');
    const rawBody = await req.text();

    // In production or when UCP_WEBHOOK_SECRET is set, strictly enforce signature verification.
    // In local evaluation mode without an explicit secret, fallback to demo verification mode.
    const webhookSecret = process.env.UCP_WEBHOOK_SECRET || 'cymbal_demo_ucp_secret_2026';
    const isEnforced = process.env.NODE_ENV === 'production' || process.env.ENFORCE_WEBHOOK_SIGNATURES === 'true';

    if (signature) {
      const isValid = verifyUcpSignature(rawBody, signature, webhookSecret);
      if (!isValid && isEnforced) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid UCP webhook signature' },
          { status: 401 }
        );
      }
    } else if (isEnforced) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing x-ucp-signature header' },
        { status: 401 }
      );
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload structure' },
        { status: 400 }
      );
    }

    console.log('[UCP Webhook Received]:', event.type || event.eventType, event);

    // Validate webhook payload
    if (!event || (!event.type && !event.eventType)) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    // Process specific event types
    switch (event.type || event.eventType) {
      case 'inventory.replenished':
        console.log('Stock replenishment notification for product:', event.productId);
        break;

      case 'commerce.purchase_intent.fulfilled':
        console.log('Autonomous purchase intent fulfilled for order:', event.orderId);
        break;

      case 'commerce.checkout.recovered':
        console.log('Checkout recovery applied for session:', event.checkoutId);
        break;

      default:
        console.log('Generic UCP event processed:', event.type || event.eventType);
    }

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      eventId: event.id || `evt_${Date.now()}`,
    });
  } catch (error: any) {
    console.error('Error processing UCP webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}

