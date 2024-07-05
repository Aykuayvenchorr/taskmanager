// comment.js

function addComment() {
//    const username = document.currentScript.getAttribute(data-username);
//    const username = document.currentScript.dataset.username
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}`;
    const date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;

    if (commentText !== '') {
        const commentContainer = document.getElementById('comments-container');

        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const commentAuthor = document.createElement('div');
        commentAuthor.className = 'comment-author';
        commentAuthor.textContent = username || 'Гость'; // Используем имя пользователя или "Гость", если имя не задано

        const commentTime = document.createElement('div');
        commentTime.className = 'comment-time';
        commentTime.textContent = `Добавлено ${time}`;

        const commentDate = document.createElement('div');
        commentDate.className = 'comment-date';
        commentDate.textContent = `Дата ${date}`;

        const commentContent = document.createElement('div');
        commentContent.className = 'comment-content';
        commentContent.textContent = commentText;

        commentDiv.appendChild(commentAuthor);
        commentDiv.appendChild(commentTime);
        commentDiv.appendChild(commentDate);
        commentDiv.appendChild(commentContent);

        commentContainer.appendChild(commentDiv);
        commentInput.value = '';
    }
}


function btnsClick() {
    const btnsName = leftaside.querySelectorAll('.struct-name');

    if (btnsName) {
        for (let btnName of btnsName) { btnName.onclick = clickBtnName; };
    };
};

function clickBtnName(e) {
    const btnName = e.currentTarget;
    var data_id = btnName.parentElement.getAttribute("data-id");
    loadComments(data_id);
};

// Функция для загрузки комментариев по data_id
function loadComments(data_id) {
    $.ajax({
        url: '/addcomment/',
        method: 'POST',
        dataType: 'json',
        data: {
                'id': data_id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
        success: function(data) {
            const commentsContainer = document.getElementsByClassName('comments-container');
            if (commentsContainer) {
                        commentsContainer.innerHTML = ''; // Очищаем контейнер комментариев
                        addComment(data_id, data);
            } else {
                console.error('commentsContainer not found');
            }
        },
        error: function(xhr, status, error) {
            console.error('Ошибка при загрузке комментариев:', error);
        }
    });
}

btnsClick();

function addComment(data_id, objs) {
    const commentsContainer = document.querySelector('.comments-container');
    console.log('commentsContainer:', commentsContainer);

    for (let obj of objs) {
        const commentElement = document.createElement('div');
        commentElement.classList.add("comments");
        commentElement.innerHTML = `<div class="comment-inner">${obj[1]}</div>`;
        commentsContainer.appendChild(commentElement);
    }

    btnsClick();
}