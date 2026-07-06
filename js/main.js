/* =========================================================================
   FASHION HUB - CORE CORE INTERACTION LOGIC (2026)
   ========================================================================= */

// Tự động kích hoạt khi cấu trúc DOM hoàn thành để đồng bộ trạng thái hệ thống
document.addEventListener("DOMContentLoaded", function() {
    checkGlobalAuthStatus();
});

/**
 * 1. ĐỒNG BỘ TRẠNG THÁI THÀNH VIÊN TOÀN HỆ THỐNG
 */
function checkGlobalAuthStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    
    const memberNav = document.getElementById("member-nav");
    const vipContent = document.getElementById("vip-content");
    const vipLock = document.getElementById("vip-lock");

    if (isLoggedIn === "true" && userEmail) {
        // Cập nhật thanh điều hướng thông minh khi đã đăng nhập
        if (memberNav) {
            const shortName = userEmail.split('@')[0];
            memberNav.innerHTML = `<span class="user-welcome">Hi, ${shortName}</span> | <a href="#" onclick="processLogout(event)" class="logout-btn">Đăng xuất</a>`;
        }
        // Mở khóa phân vùng dữ liệu đặc quyền (VIP) tại trang Xu hướng
        if (vipContent) vipContent.style.display = "block";
        if (vipLock) vipLock.style.display = "none";
    } else {
        // Trạng thái mặc định khi chưa xác thực tài khoản
        if (vipContent) vipContent.style.display = "none";
        if (vipLock) vipLock.style.display = "block";
    }
}

/**
 * 2. XỬ LÝ ĐĂNG NHẬP CLIENT-SIDE
 */
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
            errorMsg.innerText = "Vui lòng không để trống Email và Mật khẩu!";
        }
        return;
    }

    // Cơ chế lưu trạng thái phiên đăng nhập vào bộ nhớ trình duyệt
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    
    alert("Đăng nhập thành công! Hệ thống đang chuyển hướng về Trang Chủ.");
    window.location.href = "index.html"; 
}

/**
 * 3. XỬ LÝ ĐĂNG XUẤT AN TOÀN
 */
function processLogout(event) {
    if (event) event.preventDefault();
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản thành viên?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        alert("Đã đăng xuất tài khoản thành công.");
        window.location.reload(); 
    }
}

/**
 * 4. BỘ LỌC TƯƠNG TÁC DANH MỤC XU HƯỚNG & LÀM ĐẸP
 */
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
            posts[i].style.display = 'block';
        } else {
            posts[i].style.display = 'none';
        }
    }
}

/**
 * 5. TRÌNH QUẢN LÝ BÌNH LUẬN & PHẢN HỒI Ý KIẾN CHỐNG XSS
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
        alert("Vui lòng nhập đầy đủ Tên và Nội dung bình luận phản hồi!");
        return;
    }

    const newComment = document.createElement('div');
    newComment.className = "comment-item";
    
    // Khử độc chuỗi nhập vào bằng escapeHTML để tránh tấn công Cross-Site Scripting (XSS)
    newComment.innerHTML = `<strong>${sanitizeHTML(name)}</strong><p>${sanitizeHTML(text)}</p>`;
    
    commentList.appendChild(newComment);

    // Reset Form nhập liệu
    nameInput.value = "";
    contentInput.value = "";

    // Cập nhật bộ đếm bình luận thời gian thực
    if (countSpan) {
        countSpan.innerText = commentList.getElementsByClassName('comment-item').length;
    }
}

function sanitizeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
