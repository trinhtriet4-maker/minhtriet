/* =========================================================================
   FASHION HUB - XỬ LÝ LOGIC TƯƠNG TÁC (CLIENT-SIDE)
   ========================================================================= */

// 1. CHỨC NĂNG XÁC THỰC FORM ĐĂNG NHẬP
function validateLogin(event) {
    event.preventDefault(); // Chặn hành vi tải lại trang của thẻ form mặc định
    
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var errorMsg = document.getElementById('errorMsg');
    
    if (!emailInput || !passwordInput) return;

    var email = emailInput.value.trim();
    var pass = passwordInput.value.trim();

    // Kiểm tra dữ liệu trống phía Client
    if (email === "" || pass === "") {
        errorMsg.style.display = "block";
        errorMsg.innerText = "Tài khoản hoặc mật khẩu không được để trống!";
    } else {
        errorMsg.style.display = "none";
        alert("Đăng nhập thành công với tài khoản: " + email);
        window.location.href = "index.html"; // Chuyển hướng về trang chủ sau khi xác thực đạt yêu cầu
    }
}

// 2. CHỨC NĂNG BỘ LỌC DANH MỤC PHÂN VÙNG CHỦ ĐỀ XU HƯỚNG (TAB FILTER)
function filterCategory(category, buttonElement) {
    // Xử lý đổi class hoạt động (active) trên các nút nhấn
    var buttons = document.getElementsByClassName('filter-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    // Lọc các khối bài viết dựa vào thuộc tính 'data-cat'
    var posts = document.getElementsByClassName('trend-post');
    for (var i = 0; i < posts.length; i++) {
        var postCategory = posts[i].getAttribute('data-cat');
        
        if (category === 'all') {
            posts[i].style.display = 'block'; // Hiển thị hết nếu chọn 'Tất cả'
        } else {
            if (postCategory === category) {
                posts[i].style.display = 'block'; // Hiện nếu trùng khớp danh mục
            } else {
                posts[i].style.display = 'none';  // Ẩn nếu không khớp
            }
        }
    }
}

// 3. CHỨC NĂNG ĐĂNG BÌNH LUẬN PHẢN HỒI (COMMENT SECTION)
function postComment() {
    var nameInput = document.getElementById('cmtName');
    var contentInput = document.getElementById('cmtContent');
    var commentList = document.getElementById('boxComments');
    var countSpan = document.getElementById('count');

    if (!nameInput || !contentInput || !commentList) return;

    var name = nameInput.value.trim();
    var text = contentInput.value.trim();

    // Ràng buộc điều kiện nhập
    if (name === "" || text === "") {
        alert("Vui lòng điền đầy đủ tên và nội dung phản hồi!");
        return;
    }

    // Tạo cấu trúc thẻ div comment mới bằng JS
    var newCommentItem = document.createElement('div');
    newCommentItem.className = "comment-item";
    newCommentItem.innerHTML = "<strong>" + escapeHTML(name) + "</strong><p>" + escapeHTML(text) + "</p>";
    
    // Đẩy phần tử mới vào danh sách hiển thị
    commentList.appendChild(newCommentItem);

    // Xóa sạch ô nhập liệu (Reset form) sau khi gửi thành công
    nameInput.value = "";
    contentInput.value = "";

    // Đồng bộ lại tổng số lượng bình luận trên tiêu đề bài viết
    if (countSpan) {
        var currentCount = document.getElementsByClassName('comment-item').length;
        countSpan.innerText = currentCount;
    }
}

// Hàm mã hóa ký tự đặc biệt giúp ngăn chặn lỗ hổng bảo mật XSS cơ bản khi render comment
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
