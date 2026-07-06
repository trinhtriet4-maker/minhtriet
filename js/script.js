$(document).ready(function() {

    // --- CHỨC NĂNG 1: ĐIỀU HƯỚNG CHUYỂN TRANG MƯỢT MÀ (SPA ROUTING) ---
    // Bắt sự kiện click vào các thẻ có class .nav-link (ở cả Menu chính và Sitemap dưới Footer)
    $(document).on('click', '.nav-link', function(e) {
        e.preventDefault(); // Chặn hành vi tải lại trang của thẻ a mặc định

        var targetPage = $(this).attr('data-target'); // Lấy id trang đích

        // Ẩn tất cả các view trang hiện tại, dùng hiệu ứng fadeIn cho trang mới
        $('.page-view').hide();
        $('#' + targetPage).fadeIn(350);

        // Đồng bộ cập nhật trạng thái hiển thị tích cực (active) trên menu thanh điều hướng chính
        $('.nav-link').removeClass('active');
        $('nav ul.menu li a[data-target="' + targetPage + '"]').addClass('active');

        // Tự động cuộn màn hình lên đầu trang nhằm mang lại trải nghiệm hợp lý nhất
        $('html, body').animate({ scrollTop: 0 }, 200);
    });


    // --- CHỨC NĂNG 2: XEM CHI TIẾT BÀI VIẾT TỪ TRANG CHỦ HOẶC DANH MỤC ---
    $('.btn-read-article').click(function() {
        // Thu thập thông tin từ thuộc tính data- của thẻ được click
        var title = $(this).attr('data-title');
        var category = $(this).attr('data-category');
        var imgUrl = $(this).attr('data-img');

        // Gán động các thông tin này vào giao diện cấu trúc trang chi tiết
        $('#detail-title').text(title);
        $('#detail-category').text(category);
        $('#detail-image').css('background-image', 'url(' + imgUrl + ')');

        // Ẩn trang hiện tại để chuyển sang trang chi tiết
        $('.page-view').hide();
        $('#page-detail').fadeIn(350);
        
        $('html, body').animate({ scrollTop: 0 }, 200);
    });


    // --- CHỨC NĂNG 3: HỆ THỐNG PHẢN HỒI Ý KIẾN BÌNH LUẬN KHÔNG LOAD TRANG ---
    $('#comment-form').submit(function(e) {
        e.preventDefault(); // Chặn reload trang khi submit form

        // Thu thập thông tin người dùng nhập vào
        var username = $('#cmt-user').val().trim();
        var commentContent = $('#cmt-msg').val().trim();

        if (username !== "" && commentContent !== "") {
            // Khởi tạo khối HTML cấu trúc cho bình luận mới
            var newCommentHtml = `
                <div class="comment-item" style="display: none;">
                    <div class="comment-meta">
                        <span class="comment-name">${username}</span>
                        <span class="comment-date">• Vừa xong</span>
                    </div>
                    <p class="comment-content">${commentContent}</p>
                </div>
            `;

            // Đẩy bình luận lên đầu danh sách với hiệu ứng slideDown từ từ hạ xuống
            $('#comment-list').prepend(newCommentHtml);
            $('.comment-item').first().slideDown(400);

            // Xóa sạch nội dung trong các ô input để người dùng tiếp tục sử dụng
            $('#cmt-user').val('');
            $('#cmt-msg').val('');
        }
    });


    // --- CHỨC NĂNG 4: KIỂM TRA DỮ LIỆU ĐĂNG NHẬP (CLIENT-SIDE VALIDATION) ---
    $('#login-form').submit(function(e) {
        var isFormValid = true;
        var emailInput = $('#login-email').val().trim();
        var passwordInput = $('#login-password').val();

        // Biểu thức Regex chuẩn kiểm tra cấu trúc Email hợp lệ
        var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        // 1. Kiểm tra Email
        if (!emailRegex.test(emailInput)) {
            $('#error-email').slideDown(200); // Hiển thị thông báo lỗi bằng hiệu ứng trượt xuống
            isFormValid = false;
        } else {
            $('#error-email').slideUp(200);   // Ẩn lỗi nếu đã sửa đúng
        }

        // 2. Kiểm tra Mật khẩu (độ dài tối thiểu từ 6 ký tự)
        if (passwordInput.length < 6) {
            $('#error-password').slideDown(200);
            isFormValid = false;
        } else {
            $('#error-password').slideUp(200);
        }

        // Nếu dữ liệu đầu vào không hợp lệ, chặn không cho form xử lý tiếp gửi đi
        if (!isFormValid) {
            e.preventDefault();
        } else {
            e.preventDefault(); // Tạm thời chặn reload mẫu trong môi trường thi/thực hành
            alert('Đăng nhập hệ thống thành công với tài khoản thành viên!');
        }
    });

});
