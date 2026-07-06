/* =========================================================================
   FASHION HUB - CORE LOGIC & INTERCONNECTION
   ========================================================================= */

// Tự động chạy khi bất kỳ trang nào được tải để kiểm tra trạng thái thành viên
document.addEventListener("DOMContentLoaded", function() {
    checkLoginStatus();
});

// 1. KIỂM TRA VÀ ĐỒNG BỘ TRẠNG THÁI THÀNH VIÊN TRÊN MENU
function checkLoginStatus() {
    var isLoggedIn = localStorage.getItem("isLoggedIn");
    var userEmail = localStorage.getItem("userEmail");
    var memberNav = document.getElementById("member-nav");
    var vipContent = document.getElementById("vip-content");
    var vipLock = document.getElementById("vip-lock");

    if (isLoggedIn === "true" && userEmail) {
        // Nếu đã đăng nhập: Đổi chữ "Thành Viên" trên Menu thành Tên và nút Đăng xuất
        if (memberNav) {
            memberNav.innerHTML = `<span style="font-size:12px; color:#888;">Hi, ${userEmail.split('@')[0]}</span> | <a href="#" onclick="logout()" style="margin:0 0 0 10px; font-size:11px; color:red;">Đăng xuất</a>`;
        }
        // Mở khóa nội dung VIP (nếu có trên trang)
        if (vipContent) vipContent.style.display = "block";
        if (vipLock) vipLock.style.display = "none";
    } else {
        // Nếu chưa đăng nhập: Hiện nội dung khóa yêu cầu đến trang đăng nhập
        if (vipContent) vipContent.style.display = "none";
        if (vipLock) vipLock.style.display = "block";
    }
}

// 2. XỬ LÝ ĐĂNG NHẬP (Lưu vào bộ nhớ trình duyệt)
function validateLogin(event) {
    event.preventDefault();
    var email = document.getElementById('email').value.trim();
    var pass = document.getElementById('password').value.trim();
    var errorMsg = document.getElementById('errorMsg');

    if (email === "" || pass === "") {
        errorMsg.style.display = "block";
        errorMsg.innerText = "Vui lòng nhập đầy đủ Email và Mật khẩu!";
    } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        alert("Đăng nhập thành viên thành công!");
        window.location.href = "index.html"; // Điều hướng về trang chủ
    }
}

// 3. XỬ LÝ ĐĂNG XUẤT
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    alert("Đã đăng xuất tài khoản thành viên.");
    window.location.reload(); // Tải lại trang để cập nhật giao diện
}

// 4. BỘ LỌC XU HƯỚNG THEO SỰ KIỆN
function filterCategory(category, buttonElement) {
    var buttons = document.getElementsByClassName('filter-btn');
    for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
    if (buttonElement) buttonElement.classList.add('active');

    var posts = document.getElementsByClassName('trend-post');
    for (var i = 0; i < posts.length; i++) {
        var postCategory = posts[i].getAttribute('data-cat');
        if (category === 'all' || postCategory === category) {
            posts[i].style.display = 'block';
        } else {
            posts[i].style.display = 'none';
        }
    }
}

// 5. ĐĂNG BÌNH LUẬN PHẢN HỒI
function postComment() {
    var nameInput = document.getElementById('cmtName');
    var contentInput = document.getElementById('cmtContent');
    var commentList = document.getElementById('boxComments');
    var countSpan = document.getElementById('count');

    if (!nameInput || !contentInput || !commentList) return;

    var name = nameInput.value.trim();
    var text = contentInput.value.trim();

    if (name === "" || text === "") {
        alert("Vui lòng nhập tên và nội dung bình luận!");
        return;
    }

    var newComment = document.createElement('div');
    newComment.className = "comment-item";
    newComment.innerHTML = `<strong>${escapeHTML(name)}</strong><p>${escapeHTML(text)}</p>`;
    commentList.appendChild(newComment);

    nameInput.value = "";
    contentInput.value = "";
    if (countSpan) countSpan.innerText = document.getElementsByClassName('comment-item').length;
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
