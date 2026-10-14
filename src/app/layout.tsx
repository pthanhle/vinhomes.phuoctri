import type { Metadata } from 'next';
import React from 'react';
import { SITE_CONFIG } from '@/config/site';
import FloatingContactWidget from '@/components/FloatingContactWidget';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import PageEnhancer from '@/components/PageEnhancer';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: `Vinhomes Saigon Park Hóc Môn: Giá bán, CSBH 2026 | ${SITE_CONFIG.siteName}`,
    template: `%s | ${SITE_CONFIG.siteName}`,
  },
  description:
    'Vinhomes Saigon Park (Hóc Môn) 1.080ha – Ivy Park & Global Park đang mở bán, chỉ từ 3,5 tỷ, vay chỉ cần 1,2 tỷ. Nhận bảng giá, CSBH mới nhất từ PKD trực tiếp CĐT: 0909 888 999.',
  applicationName: SITE_CONFIG.siteName,
  authors: [
    {
      name: `${SITE_CONFIG.agent.fullName} (${SITE_CONFIG.agent.brandName})`,
      url: SITE_CONFIG.siteUrl,
    },
  ],
  creator: SITE_CONFIG.agent.brandName,
  publisher: SITE_CONFIG.agent.brandName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
  },
  verification: {
    google: SITE_CONFIG.analytics.googleSiteVerification,
  },
  icons: {
    icon: '/uploads/2026/05/cropped-logo-du-an-vinhomes-saigon-park-32x32.png',
    apple: '/uploads/2026/05/cropped-logo-du-an-vinhomes-saigon-park-180x180.png',
  },
};

const GLOBAL_INLINE_CSS = `
  :root {
    --wp--preset--aspect-ratio--square: 1;
    --wp--preset--aspect-ratio--4-3: 4/3;
    --wp--preset--aspect-ratio--3-4: 3/4;
    --wp--preset--aspect-ratio--3-2: 3/2;
    --wp--preset--aspect-ratio--2-3: 2/3;
    --wp--preset--aspect-ratio--16-9: 16/9;
    --wp--preset--aspect-ratio--9-16: 9/16;
  }
  html {
    scroll-behavior: smooth;
  }
  .e-heading-base a, .e-paragraph-base a {
    all: unset;
    cursor: pointer;
  }
  .elementor-screen-only, .screen-reader-text {
    position: absolute;
    top: -10000em;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap&subset=vietnamese"
          rel="stylesheet"
        />
        {/* Core Layout & Elementor Atomic V4 Stylesheets (Self-hosted locally in /vendor-css/) */}
        <link rel="stylesheet" href="/vendor-css/reset.css" />
        <link rel="stylesheet" href="/vendor-css/theme.css" />
        <link rel="stylesheet" href="/vendor-css/header-footer.css" />
        <link rel="stylesheet" href="/vendor-css/frontend.min.css" />
        <link rel="stylesheet" href="/vendor-css/post-6.css" />
        <link rel="stylesheet" href="/vendor-css/widget-image.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-nav-menu.min.css" />
        <link rel="stylesheet" href="/vendor-css/sticky.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-heading.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-divider.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-icon-list.min.css" />
        <link rel="stylesheet" href="/vendor-css/fadeInUp.min.css" />
        <link rel="stylesheet" href="/vendor-css/swiper.min.css" />
        <link rel="stylesheet" href="/vendor-css/e-swiper.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-image-carousel.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-video.min.css" />
        <link rel="stylesheet" href="/vendor-css/widget-form.min.css" />
        <link rel="stylesheet" href="/vendor-css/base-desktop.css" />
        <link
          rel="stylesheet"
          href="/vendor-css/base-mobile.css"
          media="(max-width: 767px)"
        />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_INLINE_CSS }} />
        {/* Feature #12: Speculation Rules API for instant conservative prefetching */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prefetch: [
                {
                  source: 'document',
                  where: {
                    and: [
                      { href_matches: '/*' },
                      { not: { href_matches: ['/api/*', '/admin/*'] } },
                    ],
                  },
                  eagerness: 'conservative',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="wp-embed-responsive wp-theme-hello-elementor hello-elementor-default elementor-default elementor-kit-6">
        {children}
        <FloatingContactWidget />
        <PageEnhancer />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
