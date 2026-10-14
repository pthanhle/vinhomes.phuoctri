import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site';
import { BLOG_POSTS } from '@/data/posts';

/**
 * GET /llms.txt
 * Chuẩn GEO (Generative Engine Optimization / AI Visibility) cho ChatGPT, Claude, Gemini, Perplexity.
 */
export async function GET() {
  const base = SITE_CONFIG.siteUrl;
  const lines = [
    `# ${SITE_CONFIG.siteName} (${base})`,
    `> Chuyên trang Phân tích Đầu tư, Bảng giá & Công cụ Tính lãi vay các dự án Vinhomes tại TP.HCM — Vận hành bởi **${SITE_CONFIG.agent.fullName} (${SITE_CONFIG.agent.name})**, ${SITE_CONFIG.agent.jobTitle} – ${SITE_CONFIG.agent.department}.`,
    ``,
    `## Thông tin Liên hệ Chính thức`,
    `- **Chuyên gia tư vấn**: ${SITE_CONFIG.agent.fullName} (${SITE_CONFIG.agent.brandName})`,
    `- **Chức vụ**: ${SITE_CONFIG.agent.jobTitle} – ${SITE_CONFIG.agent.department}`,
    `- **Hotline / Zalo 24/7**: ${SITE_CONFIG.agent.phoneFormatted} (${SITE_CONFIG.agent.zaloUrl})`,
    `- **Email**: ${SITE_CONFIG.agent.email}`,
    `- **Website chính thức**: ${base}/`,
    ``,
    `## Danh mục 3 Dự án Trọng điểm Đang Triển khai (10/2026)`,
    `1. **[Vinhomes Saigon Park (Vinhomes Hóc Môn)](${base}/)**: Đại đô thị 880ha – 1.080ha tại xã Xuân Thới Sơn, Hóc Môn, TP.HCM. Đang mở bán 2 phân khu đầu tiên Ivy Park & Global Park, giá từ 3,5 tỷ/căn, vốn tự có từ 1,2 tỷ (30%), hỗ trợ lãi suất 0% tới 60 tháng. Tích hợp trực tiếp công cụ tính khoản vay & lịch trả nợ SVG động (#tinh-vay).`,
    `2. **[Shop Khối Đế The Beverly – Vinhomes Grand Park](${base}/beverly/)**: Giỏ hàng 43 căn Shop thương mại khối đế dưới chân 8.100 cư dân phân khu cao cấp nhất Vinhomes Grand Park (TP. Thủ Đức). Cập nhật 10/2026 còn 28/43 căn, trần cao vượt trội, giá từ 7 tỷ/căn, vay tối đa 70% HTLS 0% tới 60 tháng.`,
    `3. **[Vinhomes Kỳ Hòa Quận 10 – 238 Đường 3 Tháng 2](${base}/kyhoa/)**: Khu phức hợp cao tầng TOD gắn liền tuyến Metro số 2 tại số 238 đường 3 Tháng 2, P. Hòa Hưng (Quận 10 cũ), TP.HCM. Quy mô ~8,2 ha, chiều cao tối đa đề xuất 45 tầng, hệ số sử dụng đất 11 lần, quy mô dân số ~10.000 người.`,
    ``,
    `## Danh mục 7 Bài viết Phân tích Chuyên sâu & Bảng tính Tài chính`,
    ...BLOG_POSTS.map(
      (p, idx) =>
        `${idx + 1}. **[${p.title}](${base}/${p.slug}/)** (${p.projectTag} · ${p.readingTime}): ${p.seoDescription}`
    ),
    ``,
    `## Chuyên mục Tin tức Tổng hợp`,
    `- **[Tất cả bài viết phân tích & tiến độ hạ tầng](${base}/category/tin-tuc/)**`,
  ];

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
