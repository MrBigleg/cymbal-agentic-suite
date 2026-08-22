import { NextRequest, NextResponse } from 'next/server';
import { eventPublisher } from '@/lib/services/mockCommerceService';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.INTERNAL_EVENT_API_KEY;
  // In development or demo mode without explicit key, allow local access
  if (!secret || process.env.NODE_ENV !== 'production') {
    return true;
  }
  const providedKey = req.headers.get('x-internal-api-key') || req.headers.get('authorization')?.replace(/^Bearer /, '');
  return providedKey === secret;
}

/**
 * SERVER EVENT QUERY & DISPATCH ENDPOINT
 *
 * Used by internal tools or external monitor dashboards to query recent domain events.
 */
export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized event bus query' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const events = await eventPublisher.getEvents(limit);

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized event dispatch' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.eventType || typeof body.eventType !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid eventType' }, { status: 400 });
    }

    const safeEventType = body.eventType.slice(0, 100).replace(/[^a-zA-Z0-9._-]/g, '');

    const event = {
      eventId: body.eventId || body.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      eventType: safeEventType,
      payload: body.payload || body.data || {},
    };

    await eventPublisher.publish(event);

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to publish event' },
      { status: 500 }
    );
  }
}

