# Báo Cáo Kiểm Toán Chuyên Sâu & Khắc Phục 18 Lỗ Hổng Từ `vinhomes.trongluu.com` Sang `vinhomes.phuoctri.com`

Tài liệu này tổng hợp toàn bộ **18 điểm yếu kỹ thuật, lỗ hổng bảo mật, lỗi chức năng giao diện (UI/UX bugs), và khiếm khuyết SEO** được phát hiện qua quá trình dịch ngược chuyên sâu thư mục `vinhomes.trongluu.com`, cùng giải pháp khắc phục triệt để đã được triển khai trong `vinhomes.phuoctri`.

---

## Nhóm A: 7 Lỗ Hổng Bảo Mật & Rò Rỉ Cấu Hình (Security & Privacy Fixes)

| Mã lỗi | Mô tả Lỗ hổng trên `vinhomes.trongluu.com` | Giải pháp Khắc phục trên `vinhomes.phuoctri.com` |
| :--- | :--- | :--- |
| **`SEC-01`** | **Rò rỉ thư viện Quản trị Media (`wp-media` / `plupload` / `backbone`) ra trang công khai**: Plugin Tablesome gọi `wp_enqueue_media()` không kiểm tra `is_admin()`, làm lộ 11 file JS/CSS quản trị, 25+ template `<script id="tmpl-media-...">` (~55 KB HTML) và biến `_wpPluploadSettings` (`max_file_size: 64MB`). | **Loại bỏ 100%**: Chuyển sang kiến trúc Next.js 15 App Router. Không nạp bất kỳ thư viện quản trị hay template thừa nào ra trang khách hàng. |
| **`SEC-02`** | **Phơi bày `tablesome_ajax_object` kèm `redirect_token` và 20+ API OAuth/Spreadsheet trong `<head>`**: Bất kỳ ai mở View Source đều thấy `redirect_token`, `rest_nonce` và cấu trúc bảng nội bộ. | **Chuyển 100% vào Server Route (`/api/leads/`)**: Toàn bộ khóa kết nối Google Sheets Webhook, Telegram Bot và lưu trữ CRM nằm trong biến môi trường phía Server (`.env`), tuyệt đối không xuất hiện trên trình duyệt. |
| **`SEC-03`** | **Mở công khai 401 routes REST API (`/wp-json/`), bao gồm cổng điều khiển AI MCP (`elementor-mcp-composer/v1.0.19`, `/wp-json/mcp`) và xuất dữ liệu (`ai1wm/v1`)**. | **Đóng toàn bộ bằng Edge Middleware (`src/middleware.ts`)**: Mọi truy vấn dò quét `/wp-json/*`, `/wp-admin`, `/xmlrpc.php` đều bị chặn ngay tại tầng Edge với HTTP `403 Forbidden`. |
| **`SEC-04`** | **Lộ tên tài khoản Admin (`admin-vinhome`) trong JSON-LD Schema**: Dù chặn `/wp-json/wp/v2/users`, Rank Math vẫn in đường dẫn `/author/admin-vinhome/` trong `@graph` trên trang `/beverly/`, `/kyhoa/` và các bài blog. | **Tách biệt định danh công khai**: Trong `src/lib/seo-schema.ts`, thực thể `Person` chỉ sử dụng định danh chuẩn `https://vinhomes.phuoctri.com/#person` (`Nguyễn Phước Trí`), không lộ bất kỳ tài khoản hệ thống nào. |
| **`SEC-05`** | **Khởi tạo Cookie `PHPSESSID` thiếu cờ bảo mật & Lặp 3 lần HTTP Security Headers**: Phản hồi HTTP của `vinhomes.trongluu.com` sinh `PHPSESSID` không có `HttpOnly`/`SameSite`, đồng thời lặp 3 lần các header `x-frame-options`, `x-content-type-options`, `x-xss-protection`. | **Chuẩn hóa Header đơn nhất trong `next.config.ts` & Nginx**: Khai báo đúng 1 lần bộ header bảo mật (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`) và hoạt động hoàn toàn Stateless (không tạo `PHPSESSID`). |
| **`SEC-06`** | **Lỗi bắt tay SSL (`remote error: tls: unrecognized name`) khi truy cập tên miền gốc `https://trongluu.com/`**: Máy chủ chỉ cấu hình SNI cho subdomain mà bỏ quên apex domain. | **Xử lý kép tại `src/middleware.ts` & `deploy/nginx-vinhomes.phuoctri.com.conf`**: Cấp chứng chỉ TLS cho cả `phuoctri.com` và tự động chuyển hướng `301 Moved Permanently` từ `https://phuoctri.com/*` về `https://vinhomes.phuoctri.com/*`. |
| **`SEC-07`** | **Biểu mẫu chỉ kiểm tra số điện thoại bằng biểu thức lỏng lẻo `pattern="[0-9()#&+*-=.]+"` & khóa cứng Google reCAPTCHA v2 theo domain cũ**: Gõ `...` vẫn qua được HTML validation, và reCAPTCHA v2 cũ sẽ báo lỗi đỏ `Invalid domain for site key` khi đổi tên miền. | **Xác thực 2 lớp (Client + Server) trong `PageEnhancer.tsx` & `/api/leads/`**: Kiểm tra chính quy số di động Việt Nam 10 số (`^(0|\+84)(3|5|7|8|9)[0-9]{8}$`), kết hợp bẫy Bot ẩn (**Honeypot `website_url`**), lọc XSS và giới hạn tần suất theo IP (**Rate Limiting**). |

---

## Nhóm B: 6 Lỗi Giao Diện & Chức Năng (UI/UX & Functional Bugs) Đã Được Sửa

1. **`BUG-01` — Nút "Zalo" bị gắn nhầm link gọi điện `tel:%200938977890` (có chứa dấu cách `%20`)**:
   - **Hiện trạng cũ**: Trên cả Trang chủ (`/`, tại 2 cụm CTA giữa trang) và trang `/beverly/`, nút mang nhãn **"Zalo"** lại có thuộc tính `href="tel:%200938977890"` thay vì mở ứng dụng Zalo!
   - **Đã khắc phục**: Toàn bộ các nút Zalo đã được sửa thành `href="https://zalo.me/0909888999" target="_blank" rel="noopener"`, và các nút gọi điện được làm sạch thành `href="tel:0909888999"`.
2. **`BUG-02` — Trang Chuyên mục Tin tức (`/category/tin-tuc/`) bị vỡ giao diện trắng trơn**:
   - **Hiện trạng cũ**: Trong `wp-custom-blog-theme.css` (`TL BLOG`), tác giả đặt selector `body.single-post` cho mọi quy tắc CSS. Khi khách bấm *"Xem tất cả bài viết →"* (`/category/tin-tuc/`), trang chuyên mục mang class `body.archive.category` nên không nhận được bất kỳ dòng CSS nào, hiển thị nền trắng thô kệch của Hello Elementor.
   - **Đã khắc phục**: Xây dựng trang `/category/tin-tuc/` (`src/app/category/tin-tuc/page.tsx`) đồng bộ hoàn hảo với bảng màu Xanh Ngọc Lục Bảo & Vàng Gold (`#0E403C` / `#05332F` / `#E3B873` / `#F7D8CD`), có thẻ điều hướng 3 dự án và lưới 7 bài viết chuẩn tạp chí.
3. **`BUG-03` — Thiếu phần tử HTML `<div class="kh-bar">` cho thanh công cụ đáy màn hình di động trên `/kyhoa/`**:
   - **Hiện trạng cũ**: CSS của `/kyhoa/` định nghĩa đầy đủ `.kh-bar` (thanh cố định 3 nút ở đáy màn hình điện thoại `@media(max-width:640px)`) và chừa sẵn `body { padding-bottom: 50px }`, nhưng trong quá trình 10 lần sửa trang bằng AI, thẻ `<div class="kh-bar">` đã bị sót khỏi HTML!
   - **Đã khắc phục**: Khôi phục đầy đủ `<div class="kh-bar">` gồm 3 nút: `☎ Gọi 0909.888.999`, `💬 Chat Zalo`, và `Đăng ký sớm` (`#lien-he`).
4. **`BUG-04` — Lỗi dư chuỗi văn bản HTML `"background:#05332F;padding:60px 16px">` phía trên Bảng tính vay `#tinh-vay` & Biểu đồ SVG trống trơn trong 5 năm đầu**:
   - **Hiện trạng cũ**: Trên cả `/` và `/beverly/` (cùng file `recovered-src/mortgage-calculator.html` dòng 11), thẻ mở `<div style=` bị cắt mất phần đầu, khiến chuỗi `"background:#05332F;padding:60px 16px">` hiển thị lộ thiên ra màn hình. Ngoài ra, khi chọn HTLS 0% trong 60 tháng + Ân hạn nợ gốc, 5 cột đầu tiên của biểu đồ `#tlc-svg` có chiều cao bằng `0`, tạo khoảng trống khó hiểu.
   - **Đã khắc phục**: Đóng gói lại thẻ `<div style="...">` chuẩn xác, đồng thời nâng cấp thuật toán vẽ SVG trong `PageEnhancer.tsx` để hiển thị các cột viền nét đứt (`stroke-dasharray="2,2"`) minh họa trực quan giai đoạn **HTLS 0% + Ân hạn gốc (0đ/tháng)**.
5. **`BUG-05` — Danh sách bài viết ở cuối Trang chủ (`/`) bị thiếu bài mới nhất (`Post 643`) & Form Trang chủ thiếu trường ẩn `du_an`**:
   - **Hiện trạng cũ**: Phần *"Kiến thức & tin mới Vinhomes Saigon Park"* ở cuối trang chủ chỉ liệt kê cứng 6 bài cũ, bỏ sót bài thứ 7 (*Kinh nghiệm chọn vị trí shop khối đế: 5 tiêu chí khi mua Shop The Beverly*). Đồng thời Form ở trang chủ không có `<input type="hidden" name="form_fields[du_an]">` như trang Beverly và Kỳ Hòa.
   - **Đã khắc phục**: Cập nhật đầy đủ cả 7 bài viết (gắn nhãn `MỚI` cho bài số 7) và bổ sung trường ẩn `du_an="Vinhomes Saigon Park"` vào Form trang chủ.
6. **`BUG-06` — Form bình luận WordPress mặc định (`#respond`) bị bỏ ngỏ dưới chân các bài viết Blog**:
   - **Hiện trạng cũ**: Cả 7 bài viết đều mở `comment_status: "open"`, hiển thị form bình luận mặc định của WordPress ở cuối bài (dễ bị bot spam link rác và lệch tông thiết kế).
   - **Đã khắc phục**: Thay thế bằng **Hộp Hồ sơ Chuyên gia Tư vấn (Nguyễn Phước Trí – Trưởng PKD trực tiếp CĐT)** kèm nút chuyển đổi Zalo/Hotline và lưới **Bài viết phân tích liên quan**.

---

## Nhóm C: 5 Khiếm Khuyết SEO, Schema & Tracking Đã Được Tối Ưu Hóa

1. **`SEO-01` — Khắc phục lỗi Bắn đúp sự kiện (Double Tracking Facebook Pixel, GTM & GA4)**:
   - Trên `vinhomes.trongluu.com`, mã theo dõi được nạp 2 lần (qua plugin PixelYourSite và qua thẻ `<script>` dán tay), làm nhân đôi lượt `PageView` và làm hỏng số liệu Bounce Rate.
   - Trên `vinhomes.phuoctri.com`, component `<AnalyticsProvider />` kết hợp `/api/capi/` đảm bảo mỗi lượt xem trang hoặc gửi Form chỉ phát **đúng 1 sự kiện duy nhất** kèm mã `event_id` đồng bộ để khử trùng lặp (Deduplication).
2. **`SEO-02` — Hợp nhất JSON-LD `@graph` tránh xung đột trùng lặp `@id: ".../#person"`**:
   - Trên `vinhomes.trongluu.com`, `/` và `/beverly/` xuất 2 thẻ `<script type="application/ld+json">` rời rạc cùng định nghĩa `@id: "https://vinhomes.trongluu.com/#person"`.
   - Trên `vinhomes.phuoctri.com`, module `src/lib/seo-schema.ts` kết xuất một đồ thị `@graph` hợp nhất, chuẩn xác cho từng trang (`Person`, `RealEstateAgent`, `WebSite`, `WebPage`, `Place`, `FAQPage`, `BlogPosting`, `BreadcrumbList`).
3. **`SEO-03` — Sửa lỗi ảnh OpenGraph (`og:image`) trỏ vào script động `webpc-passthru.php?src=...&nocache=1`**:
   - Toàn bộ thẻ `og:image`, `twitter:image` và `ImageObject` trên `vinhomes.phuoctri.com` trỏ trực tiếp tới đường dẫn tệp ảnh tĩnh tốc độ cao (`/uploads/...`), giúp hiển thị ảnh thu nhỏ 100% khi chia sẻ qua Zalo, Facebook, iMessage và Telegram.
4. **`SEO-04` — Đồng bộ Sitemap XML động (`/sitemap.xml`) chứa đủ 100% bài viết**:
   - Khắc phục lỗi `post-sitemap.xml` trên `vinhomes.trongluu.com` chỉ có 3/7 bài viết do nghẽn bộ nhớ đệm.
5. **`PERF-01` & `GEO-01` — Cắt giảm từ 100 thẻ `<script>` xuống kiến trúc Zero-jQuery & Bổ sung `/llms.txt` cho AI Search**:
   - Loại bỏ toàn bộ jQuery, jQuery Migrate, Backbone, Moxie, Plupload, Elementor Frontend runtime; bổ sung chuẩn `/llms.txt` giúp ChatGPT, Claude, Gemini và Perplexity trích dẫn chính xác dữ liệu dự án của **Phước Trí Vinhomes**.
