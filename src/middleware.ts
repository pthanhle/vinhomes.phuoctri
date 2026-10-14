import { NextRequest, NextResponse } from 'next/server';
import { SITE_CONFIG } from './config/site';

const BLOCKED_WP_PATHS = [
  '/wp-admin',
  '/wp-login.php',
  '/xmlrpc.php',
  '/wp-json/wp/v2/users',
  '/wp-json/elementor-mcp-composer',
  '/wp-json/mcp',
  '/wp-json/wp-abilities',
  '/wp-json/ai1wm',
  '/wp-content/webpc-passthru.php',
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const rawHost =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    '';
  const hostname = rawHost.split(',')[0].trim().split(':')[0].toLowerCase();

  // 1. [SEC-06 Fix] Redirect apex domain (phuoctri.com / www.phuoctri.com) -> https://vinhomes.phuoctri.com
  if (
    hostname === SITE_CONFIG.apexDomain ||
    hostname === `www.${SITE_CONFIG.apexDomain}` ||
    hostname === `www.${SITE_CONFIG.domain}`
  ) {
    const targetUrl = `https://${SITE_CONFIG.domain}${pathname}${search}`;
    return NextResponse.redirect(targetUrl, 301);
  }

  // 2. [SEC-03 & SEC-04 Fix] Block legacy WordPress / MCP / User Enumeration / Migration probes
  const lowerPath = pathname.toLowerCase();
  if (BLOCKED_WP_PATHS.some((prefix) => lowerPath.startsWith(prefix))) {
    return new NextResponse(
      JSON.stringify({
        code: 'security_access_denied',
        message:
          'Endpoint này đã được đóng và bảo vệ bởi kiến trúc Next.js Enterprise của vinhomes.phuoctri.com.',
        status: 403,
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-Protected-By', 'PhuocTri-Enterprise-Security');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|uploads|vendor-css|favicon.ico).*)',
  ],
};
