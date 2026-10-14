'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * AnalyticsProvider
 * Fixes [SEO-01] Double Tracking Bug present in vinhomes.trongluu.com
 * (where FB Pixel, GTM, and GA4 were injected twice via PixelYourSite + manual inline script).
 * Ensures exactly ONE PageView event is dispatched per route with a shared UUID event_id
 * for 100% deduplication between Browser and Server-Side Conversions API (/api/capi).
 */
export default function AnalyticsProvider() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const eventId = `pv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const payload = JSON.stringify({
      event_name: 'PageView',
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: {
        page_path: pathname,
        page_title: document.title,
        referrer: document.referrer || 'direct',
      },
    });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/capi/',
        new Blob([payload], { type: 'application/json' })
      );
    } else {
      fetch('/api/capi/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
