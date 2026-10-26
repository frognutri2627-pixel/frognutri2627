FROGNUTRI WEB — BẢN ĐỒNG BỘ GIAO DIỆN VÀ TÀI KHOẢN

MỞ WEBSITE
- Mở toàn bộ thư mục `frognutri web` trong VS Code.
- Chạy bằng Live Server hoặc deploy toàn bộ thư mục lên hosting HTTPS/GitHub Pages.

ĐỒNG BỘ
- Dùng chung styles.css và script.js; header tự gắn biểu tượng Facebook/TikTok bên cạnh logo FrogNutri và trên thanh menu.
- Website không dùng giỏ hàng nội bộ; nút mua hàng dẫn đến hồ sơ TikTok FrogNutri. Chủ shop cần đăng sản phẩm và bật TikTok Shop để khách thanh toán.
- Khi mở website hoặc trang nội dung khi chưa đăng nhập, người dùng được chuyển tới account.html. Sau khi đăng nhập thành công, website tự chuyển về index.html (Trang chủ).

TÀI KHOẢN VÀ LƯU TRỮ
- Đăng ký/đăng nhập dùng Supabase Auth. Tài khoản được lưu ở dịch vụ Supabase; phiên đăng nhập được duy trì qua các lần tải lại/trình duyệt theo cơ chế phiên của Supabase. Không lưu mật khẩu trong localStorage.
- Cần internet và Supabase project còn hoạt động. Trong Supabase Dashboard, kiểm tra Authentication > URL Configuration: đặt Site URL là URL website đang triển khai và thêm URL redirect của website vào Redirect URLs. Nếu bật xác minh email, người dùng phải bấm link xác minh trước khi đăng nhập.
- Không đưa service-role key vào mã frontend; chỉ dùng publishable/anon key. RLS phải được bật cho bảng dữ liệu riêng tư.
- Trang theo dõi đơn hàng phụ thuộc các RPC/database policies hiện có (`get_my_frognutri_orders`, `mark_frognutri_order_received`).

LƯU Ý
- Đây là website tĩnh; bảo vệ trang phía trình duyệt không thay thế quyền truy cập ở backend. Mọi dữ liệu nhạy cảm cần được bảo vệ bằng RLS/API phía server.

KHẮC PHỤC “FAILED TO FETCH”
- Không mở HTML bằng cách nhấp đúp (file://). Hãy chạy bằng VS Code Live Server hoặc deploy HTTPS.
- Kiểm tra máy có Internet và không bị extension/chặn mạng chặn cdn.jsdelivr.net hoặc *.supabase.co.
- Mở supabase-config.js và kiểm tra Project URL cùng Publishable/anon key thuộc đúng một Supabase project đang hoạt động.
- Trong Supabase Dashboard > Authentication > URL Configuration, đặt Site URL là URL website đang chạy và thêm URL index.html/account.html vào Redirect URLs.
- Nếu dự án Supabase đã pause/xóa hoặc URL/key không còn đúng, chỉ sửa code không thể khôi phục dịch vụ; cần khởi động dự án hoặc cập nhật thông tin chính xác.
