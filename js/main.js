$(document).ready(function() {
    // 1. Hiệu ứng menu: Thêm class 'active' cho menu tương ứng với trang hiện tại
    var currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "") currentPath = "index.html"; // Xử lý trường hợp ở root

    $('nav a').each(function() {
        var linkPath = $(this).attr('href');
        if (linkPath === currentPath) {
            $(this).addClass('active');
        }
    });

    // 2. Xử lý gửi bình luận (Trang Detail)
    $('#submit-comment').click(function() {
        var commentText = $('#comment-input').val();

        if (commentText.trim() !== "") {
            // Lấy thời gian hiện tại
            var now = new Date();
            var dateString = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN');

            // Tạo HTML cho bình luận mới
            var newComment = '<div class="comment-item">' +
                             '<strong>Khách hàng</strong>' +
                             '<span>' + dateString + '</span>' +
                             '<p>' + commentText + '</p>' +
                             '</div>';

            // Thêm vào danh sách và hiệu ứng fadein
            $('#comment-list').append(newComment);
            $('.comment-item:last').hide().fadeIn(500);

            // Reset ô nhập liệu
            $('#comment-input').val('');
        } else {
            alert("Vui lòng nhập nội dung bình luận!");
        }
    });

    // 3. Xác thực form đăng nhập đơn giản (Trang Login)
    $('.btn-login').click(function(e) {
        var email = $('#email').val();
        var password = $('#password').val();

        if (email === "" || password === "") {
            alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
            e.preventDefault(); // Ngăn không cho submit form
        } else if (!isValidEmail(email)) {
            alert("Email không đúng định dạng!");
            e.preventDefault();
        }
    });

    function isValidEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
});
