import type { Metadata } from 'next';
import React from 'react';
import { LANDING_PAGES } from '@/data/pages';
import { SITE_CONFIG } from '@/config/site';
import { buildKyHoaSchema } from '@/lib/seo-schema';

export const metadata: Metadata = {
  title: {
    absolute: `Vinhomes Kỳ Hòa Quận 10 – 238 Đường 3/2 | Thông tin mới nhất 2026 | ${SITE_CONFIG.siteName}`,
  },
  description:
    'Vinhomes Kỳ Hòa 238 đường 3 Tháng 2, Quận 10 cũ: quy mô 8,2ha, cao 45 tầng, mô hình TOD gắn Metro số 2. Đăng ký nhận mặt bằng & bảng giá sớm: 0909 888 999.',
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/kyhoa/`,
  },
  openGraph: {
    type: 'article',
    locale: 'vi_VN',
    url: `${SITE_CONFIG.siteUrl}/kyhoa/`,
    siteName: SITE_CONFIG.siteName,
    title: 'Vinhomes Kỳ Hòa Quận 10 – 238 Đường 3/2 | Thông tin mới nhất 2026',
    description:
      'Vinhomes Kỳ Hòa 238 đường 3 Tháng 2, Quận 10 cũ: quy mô 8,2ha, cao 45 tầng, mô hình TOD gắn Metro số 2. Đăng ký nhận mặt bằng & bảng giá sớm: 0909 888 999.',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/uploads/2026/10/vinhomes-ky-hoa-vi-tri-ban-do.webp`,
        width: 1280,
        height: 816,
        alt: 'Vị trí Vinhomes Kỳ Hòa 238 đường 3 Tháng 2 gần chợ Bến Thành',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinhomes Kỳ Hòa Quận 10 – 238 Đường 3/2 | Thông tin mới nhất 2026',
    description:
      'Vinhomes Kỳ Hòa 238 đường 3 Tháng 2, Quận 10 cũ: quy mô 8,2ha, cao 45 tầng, TOD Metro số 2. Liên hệ Phước Trí: 0909 888 999.',
    images: [
      `${SITE_CONFIG.siteUrl}/uploads/2026/10/vinhomes-ky-hoa-vi-tri-ban-do.webp`,
    ],
  },
};

export default function KyHoaPage() {
  const pageData = LANDING_PAGES['kyhoa'];
  const schemaGraph = buildKyHoaSchema();

  return (
    <>
      <link rel="stylesheet" href="/vendor-css/post-616.css" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div
        data-elementor-type="wp-page"
        data-elementor-id="616"
        className="elementor elementor-616"
        dangerouslySetInnerHTML={{ __html: pageData.html }}
      />
    </>
  );
}
