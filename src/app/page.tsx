import type { Metadata } from 'next';
import React from 'react';
import { LANDING_PAGES } from '@/data/pages';
import { SITE_CONFIG } from '@/config/site';
import { buildHomeSchema } from '@/lib/seo-schema';

export const metadata: Metadata = {
  title: {
    absolute: `Vinhomes Saigon Park Hóc Môn: Giá bán, CSBH 2026 | ${SITE_CONFIG.siteName}`,
  },
  description:
    'Vinhomes Saigon Park (Hóc Môn) 1.080ha – Ivy Park & Global Park đang mở bán, chỉ từ 3,5 tỷ, vay chỉ cần 1,2 tỷ. Nhận bảng giá, CSBH mới nhất từ PKD trực tiếp CĐT: 0909 888 999.',
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/`,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: `${SITE_CONFIG.siteUrl}/`,
    siteName: SITE_CONFIG.siteName,
    title: `Vinhomes Saigon Park Hóc Môn: Giá bán, CSBH 2026 | ${SITE_CONFIG.siteName}`,
    description:
      'Vinhomes Saigon Park (Hóc Môn) 1.080ha – Ivy Park & Global Park đang mở bán, chỉ từ 3,5 tỷ, vay chỉ cần 1,2 tỷ. Nhận bảng giá, CSBH mới nhất từ PKD trực tiếp CĐT: 0909 888 999.',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/uploads/2026/09/vinhomes-saigon-park-tong-quan.webp`,
        width: 1670,
        height: 941,
        alt: 'Tổng quan dự án Vinhomes Sài Gòn Park 1.080ha tại Hóc Môn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Vinhomes Saigon Park Hóc Môn: Giá bán, CSBH 2026 | ${SITE_CONFIG.siteName}`,
    description:
      'Vinhomes Saigon Park (Hóc Môn) 1.080ha – Ivy Park & Global Park đang mở bán, chỉ từ 3,5 tỷ, vay chỉ cần 1,2 tỷ. Liên hệ Phước Trí: 0909 888 999.',
    images: [
      `${SITE_CONFIG.siteUrl}/uploads/2026/09/vinhomes-saigon-park-tong-quan.webp`,
    ],
  },
};

export default function HomePage() {
  const pageData = LANDING_PAGES['trang-chu'];
  const schemaGraph = buildHomeSchema();

  return (
    <>
      <link rel="stylesheet" href="/vendor-css/post-15.css" />
      <link rel="stylesheet" href="/vendor-css/local-15-frontend-desktop.css" />
      <link
        rel="stylesheet"
        href="/vendor-css/local-15-frontend-mobile.css"
        media="(max-width: 767px)"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div
        data-elementor-type="wp-page"
        data-elementor-id="15"
        className="elementor elementor-15"
        dangerouslySetInnerHTML={{ __html: pageData.html }}
      />
    </>
  );
}
