<div>My Portfolio HTML Static webpage with React, Vite, Lucid, TailwindCSS backend.<br /><br />
Thanks for supporting of Gemini AI<br /><br />
<a href="https://hub.docker.com/r/gnolnos/my-portfolio">Docker Hub link</a><br /><br />
<code>docker pull gnolnos/my-portfolio</code></div>
<br /> <br />
<p>Note:</p>
<ul>
<li>Regist a free account on <a href="https://formspree.io">Formspree</a> and add Formspree ID to <code>data/config.json/personalInfo/contact/formspreeId</code> to using contact form.</li>
<li>If using Jellyfin video, please create an user with viewing permission and add user's API to <code>data/config.json/personalInfo/socials/jellyfin/apiKey</code></li>
</ul>
<h1>Hướng dẫn cách lấy Token (API) của user chỉ xem (không có quyền admin) của Jellyfin</h1>
<h2>Bước 1: Tạo User mới</h2>
<ol>
<li>Đăng nhập Admin vào Jellyfin.</li>

<li>Vào Bảng điều khiển (Dashboard) -> Người dùng (Users).</li>

<li>Tạo User mới (Ví dụ: tên là portfolio_demo, không cần đặt mật khẩu hoặc đặt mật khẩu đơn giản).</li>
</ol>
<h2>Bước 2: Giới hạn quyền (Quan trọng)</h2>
<ol>
<li>Bấm vào User vừa tạo -> Thư viện (Libraries).</li>

<li>Bỏ chọn "Enable access to all libraries" (Cho phép truy cập tất cả thư viện).</li>

<li>Chỉ tích chọn thư viện chứa video Portfolio của bạn.</li>

<li>Bỏ chọn các quyền Admin, quyền xóa file, quản lý server... ở các tab khác.</li>
</ol>

<h2>Bước 3: Lấy API Key (Access Token) của User này</h2>
<i>Vì Jellyfin không hiện key này trong Dashboard, ta sẽ lấy nó thông qua trình duyệt:</i>
<ol>
<li>Mở một trình duyệt khác (hoặc Tab ẩn danh).</li>

<li>Đăng nhập vào Jellyfin bằng tài khoản portfolio_demo vừa tạo.</li>

<li>Sau khi vào được trang chủ, nhấn F12 để mở Developer Tools.</li>

<li>Chuyển sang tab Network.</li>

<li>Nhấn F5 để tải lại trang Jellyfin.</li>

<li>Trong danh sách Network, tìm bất kỳ request nào (thường có tên là Full, Items, System, hoặc me..).</li>

<li>Nhìn sang phần Headers (bên phải) hoặc Request URL.</li>

<li>Bạn sẽ thấy một chuỗi ký tự dài đi kèm với X-Emby-Token hoặc api_key.<li>
<ul>
<li>Ví dụ header: Authorization: MediaBrowser Client="Jellyfin Web", Device="Chrome", DeviceId="...", Version="10.8.10", Token="4d4f45s6..."</li>

<li>Chuỗi trong phần Token="..." chính là API Key riêng của User này.</li></ul></ol>