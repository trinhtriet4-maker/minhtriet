/* =========================================================================
   FASHION HUB - CORE INTERACTION LOGIC (2026)
   ========================================================================= */

// Kích hoạt ngay khi tải xong trang để đồng bộ trạng thái đăng nhập toàn hệ thống
document.addEventListener("DOMContentLoaded", function() {
    checkGlobalAuthStatus();
});

// 1. KIỂM TRA VÀ ĐỒNG BỘ TRẠNG THÁI THÀNH VIÊN
function checkGlobalAuthStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    
    const memberNav = document.getElementById("member-nav");
    const vipContent = document.getElementById("vip-content");
    const vipLock = document.getElementById("vip-lock");

    if (isLoggedIn === "true" && userEmail) {
        // Nếu đã đăng nhập: Đổi nút "Thành Viên" thành tên người dùng & Đăng xuất
        if (memberNav) {
            const shortName = userEmail.split('@')[0];
            memberNav.innerHTML = `<span class="user-welcome">Hi, ${shortName}</span> | <a href="#" onclick="processLogout(event)" class="logout-btn">Đăng xuất</a>`;
        }
        // Mở khóa phân vùng bảo mật VIP ở trang Xu Hướng
        if (vipContent) vipContent.style.display = "block";
        if (vipLock) vipLock.style.display = "none";
    } else {
        // Nếu chưa đăng nhập: Giữ nguyên trạng thái khóa bảo mật
        if (vipContent) vipContent.style.display = "none";
        if (vipLock) vipLock.style.display = "block";
    }
}

// 2. XỬ LÝ ĐĂNG NHẬP (CLIENT-SIDE SIMULATION)
function validateLogin(event) {
    event.preventDefault(); 
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');
    
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
        if (errorMsg) {
            errorMsg.style.display = "block";
            errorMsg.innerText = "Vui lòng nhập đầy đủ Email và Mật khẩu!";
        }
        return;
    }

    // Lưu trạng thái đăng nhập vào bộ nhớ trình duyệt
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    
    alert("Đăng nhập thành công! Hệ thống tự động chuyển hướng.");
    window.location.href = "index.html"; 
}

// 3. XỬ LÝ ĐĂNG XUẤT
function processLogout(event) {
    if (event) event.preventDefault();
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản thành viên?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        window.location.reload(); 
    }
}

// 4. BỘ LỌC CHUYỂN ĐỔI DANH MỤC XU HƯỚNG
function filterCategory(category, buttonElement) {
    const buttons = document.getElementsByClassName('filter-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    if (buttonElement) buttonElement.classList.add('active');

    const posts = document.getElementsByClassName('trend-post');
    for (let i = 0; i < posts.length; i++) {
        const postCategory = posts[i].getAttribute('data-cat');
        if (category === 'all' || postCategory === category) {
            posts[i].style.display = 'block'; // Hiển thị lại thẻ phù hợp
        } else {
            posts[i].style.display = 'none'; // Ẩn thẻ không phù hợp
        }
    }
}

// 5. HỆ THỐNG XỬ LÝ VÀ THÊM BÌNH LUẬN Ý KIẾN
function postComment() {
    const nameInput = document.getElementById('cmtName');
    const contentInput = document.getElementById('cmtContent');
    const commentList = document.getElementById('boxComments');
    const countSpan = document.getElementById('count');

    if (!nameInput || !contentInput || !commentList) return;

    const name = nameInput.value.trim();
    const text = contentInput.value.trim();

    if (name === "" || text === "") {
        alert("Vui lòng nhập đầy đủ Tên và Nội dung bình luận!");
        return;
    }

    const newComment = document.createElement('div');
    newComment.className = "comment-item";
    newComment.innerHTML = `<strong>${sanitizeHTML(name)}</strong><p>${sanitizeHTML(text)}</p>`;
    
    commentList.appendChild(newComment);

    // Xóa dữ liệu cũ trong form sau khi gửi
    nameInput.value = "";
    contentInput.value = "";

    // Cập nhật số lượng bình luận theo thời gian thực
    if (countSpan) {
        countSpan.innerText = commentList.getElementsByClassName('comment-item').length;
    }
}

// Hàm khử độc chuỗi nhập vào để chống lỗi bảo mật XSS
function sanitizeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
