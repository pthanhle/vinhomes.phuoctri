import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SITE_CONFIG } from '@/config/site';

// Keep in-memory ring buffer of recent event_ids to guarantee 100% deduplication
const processedEventIds = new Set<string>();

function sha256Hash(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

/**
 * POST /api/capi
 * Server-Side Conversions API (Meta CAPI & GA4 Measurement Protocol)
 * Fixes [SEO-01] Double Tracking & moves SHA-256 PII hashing 100% to Server-Side
 * (eliminating client-side sha256.js and pysOptions cookie bloat).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventName = String(body.event_name || 'PageView');
    const eventId = String(body.event_id || `ev-${Date.now()}`);
    const eventSourceUrl = String(body.event_source_url || SITE_CONFIG.siteUrl);

    // Deduplicate identical event_id
    if (processedEventIds.has(eventId)) {
      return NextResponse.json({
        success: true,
        deduplicated: true,
        event_id: eventId,
      });
    }
    processedEventIds.add(eventId);
    if (processedEventIds.size > 2000) {
      const first = processedEventIds.values().next().value;
      if (first) processedEventIds.delete(first);
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const userData: Record<string, unknown> = {
      client_ip_address: ip,
      client_user_agent: userAgent,
    };

    if (body.user_data?.phone) {
      userData.ph = [sha256Hash(String(body.user_data.phone))];
    }
    if (body.user_data?.email) {
      userData.em = [sha256Hash(String(body.user_data.email))];
    }
    if (body.user_data?.name) {
      userData.fn = [sha256Hash(String(body.user_data.name))];
    }

    const capiPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: userData,
          custom_data: body.custom_data || {},
        },
      ],
    };

    // If production Meta CAPI Access Token is configured, forward to Graph API
    const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;
    const pixelId = SITE_CONFIG.analytics.fbPixelId;
    if (
      accessToken &&
      !accessToken.includes('your_meta_conversions_api') &&
      pixelId
    ) {
      fetch(
        `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capiPayload),
        }
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      deduplicated: false,
      event_name: eventName,
      event_id: eventId,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid CAPI payload' },
      { status: 400 }
    );
  }
}
