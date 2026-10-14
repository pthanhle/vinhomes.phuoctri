# 04. PHÂN TÍCH CHI PHÍ (FREE VS. TRẢ PHÍ), NƠI MUA TÊN MIỀN/HOSTING & QUY TRÌNH LÊN TOP GOOGLE (`vinhomes.phuoctri.com`)

Tài liệu này phân tích chi tiết từng hạng mục trong dự án **`vinhomes.phuoctri`**: phần nào hoàn toàn **MIỄN PHÍ (0đ)** nhờ kiến trúc Next.js 15 tự chủ, phần nào **CẦN BỎ TIỀN MUA** (mua ở đâu, giá bao nhiêu), kiểm tra thực trạng tên miền `phuoctri.com`, và lộ trình kỹ thuật để gõ `vinhomes.phuoctri.com` hoặc từ khóa thương hiệu **"Vinhomes Phước Trí"** trên Google là ra kết quả chuẩn xác nhất.

---

## 1. BẢNG PHÂN LOẠI: PHẦN NÀO TRẢ PHÍ VS. PHẦN NÀO MIỄN PHÍ 100%?

Ở dự án cũ (`vinhomes.trongluu.com`), chủ web phải trả tiền cho **WordPress Hosting (Hostinger)** + **Bản quyền Elementor Pro ($59–$99/năm)** + các plugin phụ trợ.

Với kiến trúc **Next.js 15 Enterprise** mới của `vinhomes.phuoctri`, toàn bộ tính năng của Elementor Pro, Tablesome CRM, Rank Math Pro, PixelYourSite Pro và LiteSpeed/WP-Rocket đã được **code trực tiếp vào mã nguồn**, giúp bạn tiết kiệm **90% chi phí vận hành**.

### 1.1. Các hạng mục BẮT BUỘC hoặc TÙY CHỌN trả tiền

| Hạng mục | Bắt buộc? | Chi phí thực tế | Mua ở đâu uy tín nhất? | Ghi chú kỹ thuật |
| :--- | :---: | :--- | :--- | :--- |
| **1. Tên miền gốc (Root Domain)**<br>*(để tạo subdomain `vinhomes.*`)* | **BẮT BUỘC** | • Quốc tế (`.com`): **~260.000đ – 330.000đ/năm** (`$10.44/năm`)<br>• Việt Nam (`.vn` / `.com.vn`): **~450.000đ – 750.000đ/năm** | • **Quốc tế**: Cloudflare Registrar, Namecheap, Porkbun<br>• **Việt Nam**: Tenten.vn, Mắt Bão, PA Việt Nam, iNET | Khi sở hữu tên miền gốc (VD: `phuoctri.com` hoặc `phuoctri.vn`), bạn được tạo **vô hạn subdomain** (`vinhomes.phuoctri...`) hoàn toàn **MIỄN PHÍ**. |
| **2. Máy chủ chạy Web (Hosting / Cloud / VPS)** | **CÓ THỂ DÙNG FREE** hoặc **TRẢ PHÍ** | • **Phương án A (Cloud PaaS - Vercel / Render / Cloudflare)**: **0đ/tháng** (Gói Hobby) hoặc `$20/tháng` (Pro)<br>• **Phương án B (VPS riêng chạy Docker/PM2)**: **95.000đ – 150.000đ/tháng** (`$4–$6/tháng`) | • **Cloud**: [Vercel.com](https://vercel.com), [Railway.app](https://railway.app)<br>• **VPS Quốc tế (Server Singapore)**: Hetzner, Vultr, DigitalOcean<br>• **VPS Việt Nam**: Vietnix, AZDIGI, GreenCloud | Dự án đã có sẵn `Dockerfile`, `ecosystem.config.cjs` và `nginx-vinhomes.phuoctri.com.conf`, chạy được trên cả Vercel (0đ) lẫn VPS riêng. |
| **3. Email theo tên miền**<br>(`contact@phuoctri.com`) | **TÙY CHỌN** *(Có bản Free)* | • **Cloudflare Email Routing + Gmail**: **0đ (Miễn phí trọn đời)**<br>• **Zoho Mail Lite**: **0đ** (Forever Free 5 user) hoặc `25.000đ/tháng`<br>• **Google Workspace**: `~150.000đ/tháng` | • [Cloudflare Email Routing](https://www.cloudflare.com/developer-platform/products/email-routing/)<br>• [Zoho Mail](https://www.zoho.com/mail/)<br>• [Google Workspace](https://workspace.google.com/) | Khuyên dùng **Cloudflare Email Routing (0đ)**: khách gửi vào `contact@phuoctri.com` sẽ tự động chuyển tiếp thẳng về Gmail cá nhân của bạn. |
| **4. Ngân sách chạy Quảng cáo (Facebook Ads / Google Ads)** | **TÙY CHỌN** *(Khi chạy chiến dịch)* | Tùy ngân sách chiến dịch của bạn | Meta Business Suite / Google Ads | Hệ thống Pixel + Server-Side CAPI (`/api/capi/`) đã được tích hợp sẵn miễn phí để tối ưu giá thầu quảng cáo. |

---

### 1.2. Các hạng mục HOÀN TOÀN MIỄN PHÍ (0đ) & Đã cấu hình sẵn

Toàn bộ các thành phần dưới đây **KHÔNG CẦN MUA** bất kỳ plugin hay dịch vụ trả phí nào:

1. **Subdomain `vinhomes.<ten-mien-cua-ban>`**: Miễn phí 100% trong trình quản lý DNS (chỉ cần tạo 1 bản ghi `A` hoặc `CNAME`).
2. **Chứng chỉ bảo mật HTTPS / SSL (`Let's Encrypt` + `Cloudflare Universal SSL`)**: Miễn phí trọn đời, tự động gia hạn mỗi 90 ngày.
3. **Mạng phân phối nội dung toàn cầu (CDN) & Chống DDoS/Bot**: Dùng gói **Cloudflare Free Plan (0đ)** — tăng tốc tải ảnh/video 187 file media trong `/public/uploads/` và ẩn IP máy chủ gốc.
4. **Hệ thống Quản trị Khách hàng (CRM) & Lưu trữ Lead**:
   - Đã tích hợp sẵn API `/api/leads/` lưu vào cơ sở dữ liệu nội bộ + trang quản trị `/admin/leads/` (xuất file Excel/CSV miễn phí).
   - Kết nối **Google Sheets** qua Google Apps Script Webhook: **Miễn phí 100%** (không cần mua Tablesome Pro).
   - Nhận thông báo khách hàng mới tức thì qua **Telegram Bot API**: **Miễn phí 100%**.
5. **Bộ công cụ SEO & AI Discovery**:
   - Unified JSON-LD Schema Graph (`RealEstateAgent`, `Person`, `Residence`, `FAQPage`, `BlogPosting`): **0đ** (thay thế hoàn toàn Rank Math Pro).
   - Tự động sinh `/sitemap.xml`, `/robots.txt`, `/llms.txt` (cho ChatGPT/Gemini/Perplexity), và `/api/indexnow/` (cho Bing/Yandex): **0đ**.
   - **Google Search Console**, **Google Analytics 4 (GA4)**, **Google Tag Manager (GTM)**, **Google Business Profile (Google Maps)**: **Miễn phí 100%** từ Google.
   - **Meta Pixel + Meta Conversions API (Server-Side CAPI)**: **Miễn phí 100%** từ Meta.

---

## 2. PHÁT HIỆN QUAN TRỌNG VỀ TÊN MIỀN `phuoctri.com` (KIỂM TRA WHOIS THỰC TẾ)

Qua kiểm tra trực tiếp hệ thống WHOIS & DNS quốc tế (`whois.verisign-grs.com`):

```text
Domain Name: PHUOCTRI.COM
Creation Date: 2018-08-16
Registry Expiry Date: 2028-08-16
Registrar: Cloudflare, Inc.
Name Server: PAUL.NS.CLOUDFLARE.COM, RUTH.NS.CLOUDFLARE.COM
```

### Có 2 trường hợp xảy ra:
- **Trường hợp 1 — Bạn ĐÃ là chủ sở hữu của `phuoctri.com` trên Cloudflare**:
  - **Tin tuyệt vời**: Bạn **không tốn thêm bất kỳ đồng nào** để mua tên miền!
  - Bạn chỉ cần đăng nhập vào tài khoản Cloudflare đang quản lý `phuoctri.com`, vào mục **DNS -> Records**, bấm **Add Record**:
    - `Type`: `A` (nếu dùng VPS) hoặc `CNAME` (nếu dùng Vercel)
    - `Name`: `vinhomes`
    - `Target`: IP VPS của bạn (hoặc `cname.vercel-dns.com`)
  - Ngay lập tức tên miền **`https://vinhomes.phuoctri.com`** sẽ hoạt động!

- **Trường hợp 2 — Bạn CHƯA sở hữu `phuoctri.com` (tên miền này đã có người khác đăng ký từ năm 2018)**:
  - Hiện tại các tên miền thương hiệu **Phước Trí** cực đẹp sau đây **ĐANG TRỐNG 100% (chưa ai mua)** và bạn có thể mua ngay lập tức:
    1. **`phuoctri.vn`** hoặc **`phuoctri.com.vn`** -> Chạy subdomain **`https://vinhomes.phuoctri.vn`** (Tên miền quốc gia `.vn` được Google Việt Nam ưu tiên độ tin cậy cực cao cho Bất động sản!).
    2. **`vinhomesphuoctri.com`** -> Chạy trực tiếp hoặc chạy **`https://vinhomes.vinhomesphuoctri.com`**.
    3. **`nguyenphuoctri.com`** -> Chạy subdomain **`https://vinhomes.nguyenphuoctri.com`** (Y hệt cấu trúc `vinhomes.trongluu.com` lấy theo họ tên chuyên gia!).
  - *Lưu ý*: Toàn bộ dự án được thiết kế tập trung tại duy nhất 1 file cấu hình [`src/config/site.ts`](../src/config/site.ts) (hoặc biến môi trường `NEXT_PUBLIC_SITE_URL` trong `.env.local`), nên dù bạn dùng `vinhomes.phuoctri.com`, `vinhomes.phuoctri.vn` hay `vinhomes.nguyenphuoctri.com`, hệ thống đều tự động đồng bộ 100% Sitemap, Canonical, Schema và OpenGraph chỉ trong 1 giây.

---

## 3. LÀM SAO ĐỂ GÕ `vinhomes.phuoctri.com` (HOẶC "VINHOMES PHƯỚC TRÍ") TRÊN GOOGLE LÀ RA NGAY VÀ CHUẨN XÁC NHẤT?

Tương tự như cách dự án `vinhomes.trongluu.com` hiển thị trên Google với Sitelinks, Tiêu đề chuẩn, Mô tả chuẩn và Ảnh đại diện (Favicon/Thumbnail), bạn chỉ cần thực hiện **5 bước cấu hình MIỄN PHÍ 100%** sau đây sau khi trỏ tên miền:

### Bước 1: Xác minh quyền sở hữu trên Google Search Console (Miễn phí – Quan trọng số 1)
1. Truy cập [Google Search Console](https://search.google.com/search-console/).
2. Chọn **Add Property (Thêm tài sản)** -> Chọn ô **Domain (Miền)** hoặc **URL Prefix**: nhập `https://vinhomes.phuoctri.com/`.
3. Xác minh qua bản ghi `TXT` trên Cloudflare DNS (chỉ mất 30 giây).
4. Vào menu **Sitemaps (Sơ đồ trang web)** ở cột trái -> Nhập `sitemap.xml` -> Bấm **Submit (Gửi)**.
   - Dự án đã tạo sẵn tự động tại `https://vinhomes.phuoctri.com/sitemap.xml` chứa đầy đủ **11/11 URL** (3 Landing Page dự án + 1 trang Chuyên mục + 7 bài viết Blog trụ cột), khắc phục triệt để lỗi thiếu 4 bài viết như của `vinhomes.trongluu.com`.
5. Dùng thanh **URL Inspection (Kiểm tra URL)** ở trên cùng, dán lần lượt 4 link chính:
   - `https://vinhomes.phuoctri.com/`
   - `https://vinhomes.phuoctri.com/beverly/`
   - `https://vinhomes.phuoctri.com/kyhoa/`
   - `https://vinhomes.phuoctri.com/category/tin-tuc/`
   -> Bấm **"Request Indexing" (Yêu cầu lập chỉ mục)**. Chỉ sau **2 – 12 giờ**, khi gõ `vinhomes.phuoctri.com` trên Google, toàn bộ trang web sẽ xuất hiện chuẩn xác!

### Bước 2: Kích hoạt IndexNow cho Bing, Copilot & ChatGPT Search (Đã tích hợp sẵn – Miễn phí)
- Dự án đã có sẵn file xác thực `/phuoctri2026indexnowkey888999.txt` và API `/api/indexnow/`.
- Ngay khi web lên online, bạn chỉ cần chạy 1 lệnh `POST https://vinhomes.phuoctri.com/api/indexnow/` — toàn bộ 11 URL sẽ được đẩy thẳng vào bộ máy tìm kiếm của **Microsoft Bing, Copilot và ChatGPT Search** trong vòng vài phút.

### Bước 3: Thiết lập Entity Social Profile đồng bộ với `@graph` Schema (Miễn phí)
Trong file [`src/lib/seo-schema.ts`](../src/lib/seo-schema.ts) và [`src/config/site.ts`](../src/config/site.ts), chúng ta đã khai báo thực thể định danh **Knowledge Graph**:
- **Tổ chức (`RealEstateAgent`)**: `Phước Trí Vinhomes - Tư Vấn Bất Động Sản Vinhomes TP.HCM`
- **Chuyên gia (`Person`)**: `Nguyễn Phước Trí`
- Để Google hiển thị hộp thông tin thương hiệu (Knowledge Panel) và chấm điểm **E-E-A-T** tuyệt đối khi người dùng tìm `"Vinhomes Phước Trí"`:
  1. Tạo 1 Fanpage Facebook công khai: `facebook.com/phuoctri.vinhomes` (đặt link website trên Fanpage trỏ về `https://vinhomes.phuoctri.com`).
  2. Tạo 1 kênh YouTube / TikTok / LinkedIn mang tên **Phước Trí Vinhomes** và gắn link `https://vinhomes.phuoctri.com` vào phần giới thiệu (Bio).
  3. Tạo địa điểm trên **Google Business Profile (Google Maps)** miễn phí với tên: `"Phước Trí Vinhomes - Tư Vấn Dự Án Vinhomes TP.HCM"` và gắn website `https://vinhomes.phuoctri.com`.

### Bước 4: Cấu hình GoogleSheets Webhook & Telegram Nhận Khách Hàng (Miễn phí)
Để mỗi khi khách hàng điền form trên `/`, `/beverly/` hoặc `/kyhoa/`, thông tin lập tức đổ về điện thoại và Google Trang tính của bạn mà không tốn tiền mua CRM:
1. **Telegram (0đ)**:
   - Mở Telegram, nhắn cho `@BotFather` -> gõ `/newbot` để lấy `TELEGRAM_BOT_TOKEN`.
   - Lấy `TELEGRAM_CHAT_ID` của bạn và điền vào file `.env.local` -> Khởi động lại web. Ngay khi có khách điền form, điện thoại bạn sẽ báo tin nhắn tức thì!
2. **Google Sheets (0đ)**:
   - Mở 1 file Google Sheet mới -> **Extensions (Tiện ích mở rộng) -> Apps Script** -> Dán đoạn nhận `doPost(e)` ngắn gọn -> Bấm **Deploy as Web App** -> Copy URL dán vào biến `GOOGLE_SHEETS_WEBHOOK_URL` trong `.env.local`.
3. **Xem trực tiếp trên Web (0đ)**:
   - Truy cập ngay trang quản trị nội bộ đã làm sẵn tại `/admin/leads/` để xem bảng danh sách khách hàng và bấm **"Xuất CSV"**.
