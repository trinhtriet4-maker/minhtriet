/* =========================================================================
   FASHION HUB - CORE LOGIC & INTERCONNECTION (2026)
   ========================================================================= */

// Tự động chạy khi bất kỳ trang nào được tải để đồng bộ trạng thái hệ thống
document.addEventListener("DOMContentLoaded", function() {
    syncNavigationAndVIP();
});

/**
 * 1. ĐỒNG BỘ MENU & TRẠNG THÁI NỘI DUNG VIP THÀNH VIÊN
 */
function syncNavigationAndVIP() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    
    const memberNav = document.getElementById("member-nav");
    const vipContent = document.getElementById("vip-content");
    const vipLock = document.getElementById("vip-lock");

    // Nếu đã đăng nhập thành công
    if (isLoggedIn === "true" && userEmail) {
        // Đổi chữ "Thành Viên" trên thanh Menu thành Tên và Nút đăng xuất nhanh
        if (memberNav) {
            const shortName = userEmail.split('@')[0];
            memberNav.innerHTML = `<span class="user-welcome">Hi, ${shortName}</span> | <a href="#" onclick="handleLogout(event)" class="logout-btn">Đăng xuất</a>`;
        }
        // Mở khóa phân vùng VIP (Hiển thị nội dung ẩn tại trang Xu Hướng)
        if (vipContent) vipContent.style.display = "block";
        if (vipLock) vipLock.style.display = "none";
    } else {
        // Nếu chưa đăng nhập hoặc đã đăng xuất
        if (vipContent) vipContent.style.display = "none";
        if (vipLock) vipLock.style.display = "block";
    }
}

/**
 * 2. XỬ LÝ ĐĂNG NHẬP (Form Submission)
 */
function validateLogin(event) {
    event.preventDefault(); // Chặn hành vi tải lại trang mặc định của form
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');
    
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (email === "" || password === "") {
        if (errorMsg) {
            errorMsg.style.display = "block";
            errorMsg.innerText = "Tài khoản và mật khẩu không được để trống!";
        }
        return;
    }

    // Giả lập tài khoản đúng (Cho phép đăng nhập với mọi tài khoản hợp lệ phía Client)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    
    alert("Đăng nhập thành viên thành công! Hệ thống đang chuyển hướng...");
    window.location.href = "index.html"; // Điều hướng thẳng về trang chủ sau khi xử lý xong
}

/**
 * 3. XỬ LÝ ĐĂNG XUẤT (Logout)
 */
function handleLogout(event) {
    if (event) event.preventDefault();
    
    if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản thành viên không?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        alert("Đã đăng xuất tài khoản an toàn.");
        window.location.reload(); // Làm mới trang để cập nhật lại giao diện menu
    }
}

/**
 * 4. BỘ LỌC TƯƠNG TÁC XU HƯỚNG (Category Filter Tabs)
 */
function filterCategory(category, buttonElement) {
    // Đổi trạng thái hiển thị "active" của các nút bấm bộ lọc
    const buttons = document.getElementsByClassName('filter-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    // Ẩn hoặc Hiện các Card bài viết dựa theo thuộc tính data-cat
    const posts = document.getElementsByClassName('trend-post');
    for (let i = 0; i < posts.length; i++) {
        const postCategory = posts[i].getAttribute('data-cat');
        
        if (category === 'all') {
            posts[i].style.display = 'block'; // Hiện tất cả
        } else {
            if (postCategory === category) {
                posts[i].style.display = 'block'; // Trùng khớp danh mục -> Hiện
            } else {
                posts[i].style.display = 'none';  // Không trùng khớp -> Ẩn
            }
        }
    }
}

/**
 * 5. CHỨC NĂNG ĐĂNG BÌNH LUẬN (Comment Management)
 */
function postComment() {
    const nameInput = document.getElementById('cmtName');
    const contentInput = document.getElementById('cmtContent');
    const commentList = document.getElementById('boxComments');
    const countSpan = document.getElementById('count');

    if (!nameInput || !contentInput || !commentList) return;

    const name = nameInput.value.trim();
    const text = contentInput.value.trim();

    if (name === "" || text === "") {
        alert("Vui lòng điền đầy đủ tên và nội dung ý kiến phản hồi!");
        return;
    }

    // Tạo phần tử div mới chứa bình luận
    const newCommentItem = document.createElement('div');
    newCommentItem.className = "comment-item";
    
    // Sử dụng hàm escapeHTML để xử lý lọc chuỗi độc hại, ngăn ngừa lỗi bảo mật XSS
    newCommentItem.innerHTML = `<strong>${escapeHTML(name)}</strong><p>${escapeHTML(text)}</p>`;
    
    // Đẩy bình luận mới vào danh sách hiển thị
    commentList.appendChild(newCommentItem);

    // Xóa dữ liệu cũ trong form để người dùng có thể nhập tiếp bình luận khác
    nameInput.value = "";
    contentInput.value = "";

    // Đồng bộ và đếm lại tổng số lượng bình luận hiện có trên trang
    if (countSpan) {
        const totalComments = commentList.getElementsByClassName('comment-item').length;
        countSpan.innerText = totalComments;
    }
}

/**
 * Hàm hỗ trợ mã hóa ký tự đặc biệt, bảo vệ website khỏi tấn công Scripting (XSS)
 */
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
