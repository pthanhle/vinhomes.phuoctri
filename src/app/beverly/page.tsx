import type { Metadata } from 'next';
import React from 'react';
import { LANDING_PAGES } from '@/data/pages';
import { SITE_CONFIG } from '@/config/site';
import { buildBeverlySchema } from '@/lib/seo-schema';

export const metadata: Metadata = {
  title: {
    absolute: `Shop Khối Đế The Beverly – Vinhomes Grand Park | Mở bán 10/10 | ${SITE_CONFIG.siteName}`,
  },
  description:
    'Shop khối đế The Beverly – Vinhomes Grand Park chính thức mở bán 10/10/2026. 8.100 cư dân sẵn có, trần cao vượt trội, số lượng giới hạn (còn 28/43 căn). Nhận bảng giá & booking: 0909 888 999.',
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/beverly/`,
  },
  openGraph: {
    type: 'article',
    locale: 'vi_VN',
    url: `${SITE_CONFIG.siteUrl}/beverly/`,
    siteName: SITE_CONFIG.siteName,
    title: `Shop Khối Đế The Beverly – Vinhomes Grand Park | Mở bán 10/10`,
    description:
      'Shop khối đế The Beverly – Vinhomes Grand Park chính thức mở bán 10/10/2026. 8.100 cư dân sẵn có, trần cao vượt trội, số lượng giới hạn. Nhận bảng giá & booking: 0909 888 999.',
    // Fixes [SEO-03]: Direct static image URL instead of webpc-passthru.php?src=...&nocache=1
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/uploads/2026/09/01-banner-beverly-mo-ban-10-10.jpg`,
        width: 1920,
        height: 960,
        alt: 'Chính thức 10/10 mở bán Shop khối đế The Beverly Vinhomes Grand Park',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Shop Khối Đế The Beverly – Vinhomes Grand Park | Mở bán 10/10`,
    description:
      'Shop khối đế The Beverly – Vinhomes Grand Park: 8.100 cư dân sẵn có, còn 28/43 căn. Liên hệ Phước Trí: 0909 888 999.',
    images: [
      `${SITE_CONFIG.siteUrl}/uploads/2026/09/01-banner-beverly-mo-ban-10-10.jpg`,
    ],
  },
};

export default function BeverlyPage() {
  const pageData = LANDING_PAGES['beverly'];
  const schemaGraph = buildBeverlySchema();

  return (
    <>
      <link rel="stylesheet" href="/vendor-css/post-515.css" />
      <link rel="stylesheet" href="/vendor-css/local-515-frontend-desktop.css" />
      <link
        rel="stylesheet"
        href="/vendor-css/local-515-frontend-mobile.css"
        media="(max-width: 767px)"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div
        data-elementor-type="wp-page"
        data-elementor-id="515"
        className="elementor elementor-515"
        dangerouslySetInnerHTML={{ __html: pageData.html }}
      />
    </>
  );
}
