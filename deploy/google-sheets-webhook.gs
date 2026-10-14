/**
 * GOOGLE APPS SCRIPT - WEBHOOK NHẬN KHÁCH HÀNG (CRM MIỄN PHÍ 100%)
 * Dự án: vinhomes.phuoctri.com
 *
 * HƯỚNG DẪN CÀI ĐẶT (CHỈ MẤT 1 PHÚT):
 * 1. Mở https://sheets.new để tạo 1 file Google Trang tính mới.
 * 2. Đặt tên file: "CRM Khách Hàng - Vinhomes Phước Trí".
 * 3. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 4. Xóa đoạn code mặc định, dán toàn bộ nội dung file này vào và bấm Lưu (Ctrl+S / Cmd+S).
 * 5. Bấm nút "Triển khai" (Deploy) ở góc phải trên -> "Tùy chọn triển khai mới" (New deployment).
 * 6. Chọn loại: "Ứng dụng web" (Web app):
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 7. Bấm "Triển khai" (Deploy) -> Copy đường dẫn URL Web App (có dạng https://script.google.com/macros/s/.../exec).
 * 8. Dán URL đó vào biến môi trường GOOGLE_SHEETS_WEBHOOK_URL trên Vercel (hoặc file .env.local).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Tự động tạo hàng tiêu đề nếu trang tính đang trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Mã Lead",
        "Thời gian (VN)",
        "Họ và Tên",
        "Số điện thoại",
        "Email",
        "Nhu cầu tư vấn",
        "Dự án quan tâm",
        "Trang nguồn (URL)",
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "Trạng thái xử lý"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#05332F").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);
    var vnTime = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    sheet.appendRow([
      data.id || "",
      vnTime,
      data.name || "",
      "'" + (data.phone || ""), // Giữ số 0 ở đầu số điện thoại
      data.email || "",
      data.need || "",
      data.project || "",
      data.sourcePage || "",
      data.utmSource || "",
      data.utmMedium || "",
      data.utmCampaign || "",
      "Mới tiếp nhận"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, leadId: data.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
