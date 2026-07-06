document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById("comment-form");
    const commentList = document.getElementById("comment-list");

    if (commentForm && commentList) {
        commentForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const nameInput = document.getElementById("comment-name");
            const contentInput = document.getElementById("comment-content");

            const name = nameInput.value.trim();
            const content = contentInput.value.trim();

            if (name === "" || content === "") {
                alert("Vui lòng điền thông tin ý kiến!");
                return;
            }

            const newComment = document.createElement("div");
            newComment.classList.add("feedback-item");
            newComment.innerHTML = `
                <h5>${escapeText(name)}</h5>
                <p>${escapeText(content)}</p>
            `;

            commentList.appendChild(newComment);

            nameInput.value = "";
            contentInput.value = "";
        });
    }

    function escapeText(str) {
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }
});
