# Hệ Thống Multi-Landing Page, Blog SEO & CRM Bất Động Sản: `vinhomes.phuoctri.com`

Dự án **`vinhomes.phuoctri`** là phiên bản nâng cấp toàn diện về công nghệ, kiến trúc, bảo mật và SEO từ hệ thống `vinhomes.trongluu.com`, được tái cấu trúc từ nền tảng **WordPress + Elementor + Tablesome + PixelYourSite** sang kiến trúc **Next.js 15 App Router (SSG/SSR) + TypeScript + Edge Middleware + Server-Side CRM & Conversions API (CAPI)**.

- **Thương hiệu & Chủ sở hữu**: **Nguyễn Phước Trí (`Phước Trí Vinhomes`)** – Trưởng phòng kinh doanh trực tiếp Chủ đầu tư Vinhomes
- **Tên miền mục tiêu**: `https://vinhomes.phuoctri.com` (kèm tự động chuyển hướng `301` từ `https://phuoctri.com`)
- **Hotline / Zalo 24/7**: `0909.888.999` (`https://zalo.me/0909888999`)
- **Email**: `contact@phuoctri.com`

---

## 1. Cấu Trúc Thư Mục Chuẩn Hóa

```text
vinhomes.phuoctri/
├── README.md                                          # Tài liệu tổng quan & hướng dẫn chạy nhanh
├── package.json / tsconfig.json / next.config.ts      # Cấu hình Next.js 15 + TypeScript + Security Headers
├── .env.example                                       # Mẫu biến môi trường (Tách biệt Public & Server Secrets)
├── Dockerfile & docker-compose.yml                    # Đóng gói Container Production
├── ecosystem.config.cjs                               # Cấu hình chạy Cluster đa nhân với PM2
├── deploy/
│   └── nginx-vinhomes.phuoctri.com.conf               # Cấu hình Nginx SSL/SNI + 301 Apex Redirect + WAF
├── docs/                                              # Bộ tài liệu phân tích lỗi & kiến trúc chuyên sâu
│   ├── 01_BAO_CAO_AUDIT_VA_KHAC_PHUC_18_LO_HONG.md    # Giải phẫu 18 lỗi bảo mật, UI, hiệu năng & SEO đã khắc phục
│   ├── 02_KIEN_TRUC_NEXTJS_CRM_CAPI_VA_SEO_GEO.md     # Kiến trúc kỹ thuật Next.js, CRM, Server CAPI & GEO
│   └── 03_HUONG_DAN_VAN_HANH_VA_DEPLOY_PHUOCTRI_COM.md# Hướng dẫn triển khai tên miền vinhomes.phuoctri.com
├── standalone-widgets/                                # Bộ 4 Widget HTML/CSS/JS độc lập (Đã fix lỗi & đổi sang Phước Trí)
│   ├── mortgage-calculator.html                       # Bảng tính lãi vay mua nhà Vinhomes (#tinh-vay / .tlc)
│   ├── kyhoa-landing-page.html                        # Trang Landing Page Vinhomes Kỳ Hòa Quận 10 (.kh)
│   ├── floating-contact-widget.html                   # Cụm nút liên hệ nổi Hotline & Zalo (.tb-floating-contact)
│   └── pt-custom-blog-theme.css                       # Bộ CSS giao diện bài viết Blog (PT BLOG)
├── data/
│   └── leads.json                                     # Cơ sở dữ liệu CRM lưu trữ Lead khách hàng nội bộ
├── public/
│   ├── uploads/                                       # 187 tệp Media (Ảnh, WebP, SVG, Video MP4) tự chủ 100%
│   ├── vendor-css/                                    # 26 tệp CSS giao diện gốc đã nội địa hóa URL
│   └── phuoctri2026indexnowkey888999.txt              # Khóa xác thực IndexNow cho Bing / AI Search
└── src/
    ├── config/site.ts                                 # Cấu hình định danh tập trung (Phước Trí Vinhomes)
    ├── middleware.ts                                  # Edge Middleware: 301 Apex Redirect & Chặn dò quét WP/MCP
    ├── lib/seo-schema.ts                              # Trình sinh JSON-LD @graph chuẩn Schema.org không xung đột
    ├── data/
    │   ├── pages.ts                                   # Dữ liệu 3 Landing Pages (/, /beverly/, /kyhoa/) đã làm sạch
    │   └── posts.ts                                   # Dữ liệu 7 Bài viết Blog chuyên sâu đã chuẩn hóa SEO
    ├── components/
    │   ├── PageEnhancer.tsx                           # Bộ điều khiển tương tác Zero-jQuery (Tính vay, Swiper, Lightbox, Form)
    │   ├── FloatingContactWidget.tsx                  # Cụm nút nổi Hotline/Zalo kèm theo dõi chuyển đổi CAPI
    │   └── AnalyticsProvider.tsx                      # Bộ phát sự kiện đơn nhất chống Double Tracking
    └── app/
        ├── layout.tsx                                 # Root Layout + Speculation Rules Prefetch
        ├── page.tsx                                   # [Landing Page 1] / (Vinhomes Saigon Park Hóc Môn)
        ├── beverly/page.tsx                           # [Landing Page 2] /beverly/ (Shop Khối Đế The Beverly)
        ├── kyhoa/page.tsx                             # [Landing Page 3] /kyhoa/ (Vinhomes Kỳ Hòa Quận 10)
        ├── category/tin-tuc/page.tsx                  # [Chuyên mục Blog] /category/tin-tuc/ (Giao diện PT BLOG)
        ├── [slug]/page.tsx                            # [7 Bài viết SEO] /[slug]/ (Kèm Author Box & Bảng tính vay)
        ├── admin/leads/page.tsx                       # [CRM Dashboard] /admin/leads/ (Quản lý & Xuất CSV Lead)
        ├── sitemap.ts                                 # Tự động sinh /sitemap.xml (Đầy đủ 100% Pages & Posts)
        ├── robots.ts                                  # Tự động sinh /robots.txt (Mở quyền cho Google & AI Bots)
        ├── llms.txt/route.ts                          # Tự động sinh /llms.txt (Tối ưu AI Visibility / GEO)
        └── api/
            ├── leads/route.ts                         # API Thu thập & Xác thực Lead (Chống Bot, Rate Limit, Webhook)
            ├── capi/route.ts                          # API Server-Side Conversions (Băm SHA-256 & Khử trùng event_id)
            ├── indexnow/route.ts                      # API Bắn chỉ mục tức thời lên công cụ tìm kiếm
            └── health/route.ts                        # API Kiểm tra sức khỏe & trạng thái bảo mật hệ thống
```

---

## 2. Khởi Chạy Nhanh Trên Máy Local

```bash
# 1. Di chuyển vào thư mục dự án
cd /Users/lephuocthanh/development/vinhomes.phuoctri

# 2. Chạy môi trường Development (Port 3000)
npm run dev

# 3. Hoặc Build & Chạy bản Production siêu tốc
npm run build
npm run start
```

### Các Đường Dẫn Kiểm Tra Trực Tiếp:
- **Trang chủ (Vinhomes Saigon Park Hóc Môn)**: `http://localhost:3000/`
- **Landing Page Shop Khối Đế The Beverly**: `http://localhost:3000/beverly/`
- **Landing Page Vinhomes Kỳ Hòa Quận 10**: `http://localhost:3000/kyhoa/`
- **Chuyên mục Tin tức & Phân tích (Đã fix giao diện)**: `http://localhost:3000/category/tin-tuc/`
- **7 Bài viết Blog SEO chuyên sâu**:
  1. `http://localhost:3000/kinh-nghiem-chon-vi-tri-shop-khoi-de/`
  2. `http://localhost:3000/vay-mua-vinhomes-hoc-mon-tra-gop/` *(Tích hợp Bảng tính lãi vay)*
  3. `http://localhost:3000/metro-so-2-hoc-mon/`
  4. `http://localhost:3000/gia-shop-the-beverly/`
  5. `http://localhost:3000/so-sanh-shop-khoi-de-va-nha-pho/`
  6. `http://localhost:3000/dau-tu-shop-khoi-de-cho-thue-the-beverly/`
  7. `http://localhost:3000/vanh-dai-3-hoc-mon-tien-do-vinhomes-saigon-park/`
- **Bảng Quản Trị Khách Hàng (Phước Trí CRM)**: `http://localhost:3000/admin/leads/` (Khóa mặc định: `phuoctri-admin-2026`)
- **SEO & GEO Endpoints**:
  - Sitemap XML: `http://localhost:3000/sitemap.xml`
  - Robots.txt: `http://localhost:3000/robots.txt`
  - AI Visibility (`llms.txt`): `http://localhost:3000/llms.txt`
  - Health & Security Audit API: `http://localhost:3000/api/health/`
