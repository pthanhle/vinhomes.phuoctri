# Hướng Dẫn Vận Hành & Triển Khai Tên Miền `vinhomes.phuoctri.com`

Tài liệu này hướng dẫn chi tiết từng bước để đưa hệ thống **`vinhomes.phuoctri`** chạy thực tế trên tên miền **`https://vinhomes.phuoctri.com/`** (và chuyển hướng chuẩn xác từ tên miền gốc **`https://phuoctri.com/`**).

---

## 1. Cấu Hình Bản Ghi DNS Trên Cloudflare

Trên trang quản trị DNS của tên miền **`phuoctri.com`**, khai báo 3 bản ghi sau (Bật đám mây cam **Proxied** để kích hoạt CDN và chống DDoS):

| Loại (Type) | Tên (Name) | Giá trị (Target / IPv4) | Trạng thái Proxy | Mục đích |
| :--- | :--- | :--- | :--- | :--- |
| **`A`** | **`vinhomes`** | `<IP_MAY_CHU_VPS>` | Proxied (Đám mây cam) | Tên miền chính chạy ứng dụng `vinhomes.phuoctri.com` |
| **`A`** | **`@`** (`phuoctri.com`) | `<IP_MAY_CHU_VPS>` | Proxied (Đám mây cam) | Tên miền gốc (để cấp SSL hợp lệ và chuyển hướng 301) |
| **`CNAME`** | **`www`** | `vinhomes.phuoctri.com` | Proxied (Đám mây cam) | Chuyển hướng `www.phuoctri.com` về trang chính |

---

## 2. Triển Khai Trên Máy Chủ (VPS Ubuntu/Debian hoặc macOS Server)

### Cách 1: Chạy trực tiếp bằng PM2 Cluster + Nginx (Khuyên dùng cho hiệu năng tối đa)

```bash
# 1. Cài đặt phụ thuộc và đóng gói bản Production
cd /Users/lephuocthanh/development/vinhomes.phuoctri
cp .env.example .env
npm ci
npm run build

# 2. Khởi chạy bằng PM2 ở chế độ Cluster đa nhân (Port 3000)
npx pm2 start ecosystem.config.cjs
npx pm2 save

# 3. Cấp chứng chỉ SSL Let's Encrypt cho cả 2 tên miền (Tránh lỗi TLS Unrecognized Name)
sudo certbot --nginx -d phuoctri.com -d www.phuoctri.com -d vinhomes.phuoctri.com

# 4. Kích hoạt cấu hình Nginx chuẩn hóa
sudo cp deploy/nginx-vinhomes.phuoctri.com.conf /etc/nginx/sites-available/vinhomes.phuoctri.com.conf
sudo ln -s /etc/nginx/sites-available/vinhomes.phuoctri.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Cách 2: Chạy bằng Docker Compose (Đóng gói độc lập)

```bash
cd /Users/lephuocthanh/development/vinhomes.phuoctri
docker compose up -d --build
```

---

## 3. Kiểm Tra Giả Lập Tên Miền `vinhomes.phuoctri.com` Ngay Trên Máy Mac

Nếu bạn muốn trải nghiệm tên miền `http://vinhomes.phuoctri.com:3000` ngay trên trình duyệt máy Mac trước khi trỏ DNS quốc tế:

1. Thêm dòng sau vào tệp `/etc/hosts`:
   ```text
   127.0.0.1 vinhomes.phuoctri.com phuoctri.com
   ```
2. Hoặc kiểm tra trực tiếp bằng lệnh `curl` với cờ `--resolve`:
   ```bash
   curl -I -H "Host: phuoctri.com" http://127.0.0.1:3000/
   # Kết quả trả về: HTTP/1.1 301 Moved Permanently -> Location: https://vinhomes.phuoctri.com/
   ```

---

## 4. Hướng Dẫn Kết Nối Google Sheets & Facebook CAPI Thực Tế

1. **Đồng bộ Lead tự động sang Google Sheets**:
   - Mở một bảng tính Google Sheet mới $\rightarrow$ **Tiện ích mở rộng (Extensions)** $\rightarrow$ **Apps Script**.
   - Dán hàm `doPost(e)` nhận JSON từ `/api/leads/` và ghi vào dòng mới, chọn **Deploy as Web App** rồi dán URL vào biến `GOOGLE_SHEETS_WEBHOOK_URL` trong file `.env`.
2. **Kích hoạt Facebook Conversions API (Server-Side CAPI)**:
   - Điền mã Pixel của bạn vào `NEXT_PUBLIC_FB_PIXEL_ID` và mã System User Access Token vào `FB_CAPI_ACCESS_TOKEN` trong file `.env`.
   - Mọi sự kiện `PageView`, `Contact` (bấm nút Gọi/Zalo) và `Lead` (gửi Form) sẽ được băm SHA-256 ở phía Server và gửi thẳng lên Meta Graph API kèm mã `event_id` chống trùng lặp.
