# WeWine – Hệ thống quản lý bán hàng rượu ngoại

Tổ chức theo cấu trúc D:\CLOUD\StudentManagement, giữ nguyên nội dung, giao diện, dữ liệu và JavaScript của WeWine.

## Cấu trúc

- public/index.html: năm màn hình WeWine.
- public/style.css: CSS tách nguyên vẹn từ HTML gốc.
- public/script.js: logic và dữ liệu mẫu giữ nguyên.
- server.js: Express phục vụ public/ và GET /api/health.
- db.js: kết nối Azure SQL tùy chọn.
- schema.sql: khung bảng sản phẩm, đơn hàng, chi tiết đơn hàng.
- test/api.test.js: kiểm tra HTTP, tài nguyên và health check.
- .github/workflows/main.yml: kiểm thử và đóng gói trên GitHub Actions.
- .env.example: mẫu cấu hình, không chứa thông tin bí mật.
- package.json, package-lock.json: dependency và lệnh chạy.

## Chạy

Yêu cầu Node.js 22 trở lên. Mở terminal tại thư mục project:

```powershell
npm ci
npm start
```

Truy cập http://localhost:3000. Dùng npm run dev để tự khởi động lại server khi sửa mã;
npm test để kiểm tra. Có thể mở trực tiếp public/index.html để xem giao diện.

## Phạm vi giữ nguyên

Đăng nhập/đăng ký; danh mục rượu, tìm kiếm, lọc và sắp xếp; giỏ hàng và đặt hàng;
xem, duyệt, hủy đơn mẫu; thống kê và biểu đồ.

Các chức năng vẫn mô phỏng ở trình duyệt như bản gốc. Đăng nhập chưa xác thực tài khoản;
đăng nhập mạng xã hội và xuất Excel vẫn chỉ hiện thông báo. Giỏ hàng và trạng thái đơn
không lưu sau khi tải lại. Đặt hàng chưa ghi cơ sở dữ liệu. Không bổ sung API nghiệp vụ
trong lần tổ chức lại cấu trúc này.

## Azure SQL tùy chọn

Sao chép .env.example thành .env và điền DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD
của cơ sở dữ liệu riêng. Không sử dụng .env hoặc tài khoản của project mẫu.
GET /api/health trả trạng thái demo khi chưa cấu hình đủ SQL; khi đã cấu hình đủ,
endpoint kiểm tra kết nối SQL. Giao diện vẫn dùng dữ liệu mẫu trong cả hai trường hợp.

schema.sql dành cho bước phát triển backend sau này. Chạy thủ công trên cơ sở dữ liệu
riêng khi cần. Server không tự tạo bảng hoặc thêm dữ liệu. Kết nối SQL yêu cầu mã hóa
và chứng chỉ hợp lệ.

## CI và Azure App Service

Workflow chạy npm ci, npm test và tạo artifact WeWine; chưa tự triển khai Azure.
Không sao chép đích triển khai cloud-pnt của project mẫu. Khi triển khai riêng, cấu hình
Node.js 22, startup command npm start, biến môi trường và cài dependency khi build
trên App Service. PORT do nền tảng cung cấp.