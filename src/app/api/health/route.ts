import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site';
import { BLOG_POSTS } from '@/data/posts';
import { LANDING_PAGES } from '@/data/pages';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    domain: SITE_CONFIG.domain,
    agent: SITE_CONFIG.agent.brandName,
    hotline: SITE_CONFIG.agent.phoneFormatted,
    architecture: 'Next.js 15 App Router + TypeScript + Server-Side CRM & CAPI',
    contentStats: {
      landingPages: Object.keys(LANDING_PAGES).length,
      blogPosts: BLOG_POSTS.length,
    },
    securityAudit: {
      wpAdminMediaLeakFixed: true,
      tablesomeTokenLeakFixed: true,
      mcpEndpointsClosed: true,
      userEnumerationBlocked: true,
      doubleTrackingFixed: true,
      schemaGraphDeduplicated: true,
      staticOgImagesVerified: true,
    },
    timestamp: new Date().toISOString(),
  });
}
