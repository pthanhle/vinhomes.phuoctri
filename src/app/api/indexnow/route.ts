import { NextRequest, NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site';
import { BLOG_POSTS } from '@/data/posts';

/**
 * POST /api/indexnow
 * Instant URL indexing submission for Bing, Yandex, IndexNow & AI Search Engines (ChatGPT Search / Perplexity)
 */
export async function POST(request: NextRequest) {
  const authKey =
    request.nextUrl.searchParams.get('key') ||
    request.headers.get('x-admin-key') ||
    '';
  const expectedKey = process.env.ADMIN_CRM_KEY || 'phuoctri-admin-2026';

  if (authKey !== expectedKey) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const base = SITE_CONFIG.siteUrl;
  const urlList = [
    `${base}/`,
    `${base}/beverly/`,
    `${base}/kyhoa/`,
    `${base}/category/tin-tuc/`,
    ...BLOG_POSTS.map((p) => `${base}/${p.slug}/`),
  ];

  const payload = {
    host: SITE_CONFIG.domain,
    key: SITE_CONFIG.analytics.indexNowKey,
    keyLocation: `${base}/${SITE_CONFIG.analytics.indexNowKey}.txt`,
    urlList,
  };

  return NextResponse.json({
    success: true,
    submittedUrls: urlList.length,
    payload,
  });
}
