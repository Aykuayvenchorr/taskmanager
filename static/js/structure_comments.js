function btnsClickComment() {

    const btns1 = leftaside.querySelectorAll('.struct-btn-1');
    const btns2 = leftaside.querySelectorAll('.struct-btn-2');
    const btnsComment = leftaside.querySelectorAll('.struct-comment');
    const commentsName = leftaside.querySelectorAll('.struct-comment-name');


    if (btns1 && btns2 && btnsComment && (commentsName.length > 0)) {
    // for (let btn1 of btns1) { btn1.addEventListener("click", clickBtn1); };
        for (let btn1 of btns1) { btn1.onclick = clickBtnComment1; };
        for (let btn2 of btns2) { btn2.onclick = clickBtnComment2; };
        for (let btnComment of btnsComment) { btnComment.onclick = clickBtnComment; };
        for (let commentName of commentsName) { commentName.onclick = clickStructName; };
    };
};
btnsClickComment();

function openPopupComment(e) {
    const comment_view_name = e.currentTarget;
    const commentId = comment_view_name.getAttribute('data-commentid');
    const comment_view_fullname = e.currentTarget.nextSibling.nextSibling;
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_comment';
    console.log(comment_view_name.innerHTML)
//    comment_view_name.textContent = comment_view_name.innerText; // Не интерпретирует HTML
//    comment_view_fullname.textContent = comment_view_fullname.innerText; // Не интерпретирует HTML


    popup.innerHTML = "<div class=\"comment-add-popup\">" +
                    " <div class=\"signin-header\"><span>&#10006</span></div>" +
                    " <form class=\"comment-form\" id=\"comment-form\" action=\"#\" enctype=\"multipart/form-data\">" +
                    " <textarea class=\"comment-name\" name=\"name\">" + comment_view_name.innerText + "</textarea>" +
                    " <textarea name=\"full_name\">" + comment_view_fullname.innerText + "</textarea>" +
                     " <label for=\"file-upload\" class=\"file-upload-label\">Загрузить файл</label>" +
                     " <input type=\"file\" id=\"file-upload\" name=\"file\" class=\"file-upload-input\" multiple/>" +
                    " <div id=\"file-list\"></div>" +
                     " <button type=\"submit\">Обновить комментарий</button>" +
                    " </form>" +
                    "</div>";
    body.prepend(popup);

    const nameTextarea = document.querySelector('textarea[name="name"]');
    const fullNameTextarea = document.querySelector('textarea[name="full_name"]');

    nameTextarea.value = comment_view_name.innerText;
    fullNameTextarea.value = comment_view_fullname.innerText;

    // Инициализация CKEditor после вставки текстов
    ClassicEditor
        .create(nameTextarea, {
                toolbar: ckeditorConfig.extends.toolbar,
                heading: ckeditorConfig.extends.heading,
                image: ckeditorConfig.extends.image,
                table: ckeditorConfig.extends.table
                })
        .then(editor => {
                // Store the editor instance for later use
                nameTextarea.editor = editor;
            })
        .catch(error => {
            console.error(error);
        });

    ClassicEditor
        .create(fullNameTextarea, {
                toolbar: ckeditorConfig.extends.toolbar,
                heading: ckeditorConfig.extends.heading,
                image: ckeditorConfig.extends.image,
                table: ckeditorConfig.extends.table
                })
        .then(editor => {
                // Store the editor instance for later use
                fullNameTextarea.editor = editor;
        })
        .catch(error => {
            console.error(error);
        });


    let deletedFiles = []; // Массив для хранения ID удаленных файлов

    // Запрос на получение списка документов
    $.ajax({
        url: `/get_docs/${commentId}/`,
        method: 'GET',
        dataType: 'json',
        success: function(files) {
            const selectDoc = document.getElementById('file-list');
            selectDoc.innerHTML = ''; // Очищаем существующий контент перед добавлением новых данных

            // Проверяем, что files - это массив
            if (Array.isArray(files)) {
                files.forEach((file, index) => {
                    const fileItem = document.createElement('div');
                    fileItem.classList.add('file-item');

                    const fileLink = document.createElement('a');
                    fileLink.href = file.url;
                    fileLink.target = '_blank';
                    fileLink.textContent = file.name;

                    const removeBtn = document.createElement('span');
                    removeBtn.innerHTML = ' &#10006;';
                    removeBtn.style.cursor = 'pointer';
                    removeBtn.style.color = '#ffffff';
                    removeBtn.style.marginLeft = '10px';

                    removeBtn.onclick = () => {
                        fileItem.remove(); // Удаляем элемент из DOM
                        deletedFiles.push(file.id); // Добавляем ID файла в массив удаленных
                    };

                    fileItem.appendChild(fileLink);
                    fileItem.appendChild(removeBtn);
                    selectDoc.appendChild(fileItem);
                });
            } else {
                console.error('Ошибка: files не является массивом или пуст.', files);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка получения списка документов:', textStatus, errorThrown);
        }
    });

    // Обработка отправки формы
    const formElement = document.getElementById('comment-form');
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
    // Получаем HTML-контент из CKEditor
        const nameHtml = nameTextarea.editor.getData();
        const fullNameHtml = fullNameTextarea.editor.getData();

        // Функция для преобразования HTML в текст без тегов
        function htmlToText(html) {
            const temporaryElement = document.createElement('div');
            temporaryElement.innerHTML = html;
            console.log(html)
            return temporaryElement.textContent || temporaryElement.innerText || '';
        }

        // Преобразуем HTML-контент в текст
        const nameText = htmlToText(nameHtml);
        const fullNameText = htmlToText(fullNameHtml);

        // Обновляем значения textarea с текстом
        nameTextarea.value = nameText;
        fullNameTextarea.value = fullNameText;
        // Update the textarea with CKEditor content before form submission
//        nameTextarea.editor.updateSourceElement();
//        fullNameTextarea.editor.updateSourceElement();
        // Update the textarea with CKEditor content before form submission
//        ClassicEditor.instances[nameTextarea].updateSourceElement();
//        ClassicEditor.instances[fullNameTextarea].updateSourceElement();


        const formData = new FormData(formElement);

        // Добавляем массив с ID удаленных файлов в данные формы
        formData.append('deleted_files', JSON.stringify(deletedFiles));
//        formData.append('name', nameText);
//        formData.append('full_name', fullNameText);

        // Отправляем данные на сервер
        $.ajax({
            url:  `/updatecomment/${commentId}/`,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': csrfmiddlewaretoken
            },
            success: function(response) {

                document.querySelector(`[data-commentid="${commentId}"]`).innerText = response.name;
                document.querySelector(`[data-commentid="${commentId}"]`).nextSibling.nextSibling.innerText = response.full_name;

                const addcommentpopup = document.getElementById('add_comment');
                addcommentpopup.parentElement.removeChild(addcommentpopup);
                console.log('Комментарий успешно обновлен');
            },
            error: function(data) {
                alert('Ошибка обновления комментария!');
            }
        });
    });


    const fileInput = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');

    let selectedFiles = []; // Массив для хранения всех выбранных файлов

    fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(fileInput.files); // Массив новых файлов
        selectedFiles = selectedFiles.concat(newFiles); // Добавляем новые файлы к уже существующим
        updateFileList(); // Обновляем отображение списка файлов
    });

    function updateFileList() {
        fileList.innerHTML = ''; // Очищаем предыдущий список файлов
        selectedFiles.forEach((file, index) => {
            const fileLink = document.createElement('a');
            fileLink.href = URL.createObjectURL(file);
            fileLink.target = '_blank';
            fileLink.textContent = file.name;

            // Добавляем возможность удаления файла
            const removeBtn = document.createElement('span');
            removeBtn.innerHTML = ' &#10006;';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.color = 'red';
            removeBtn.style.marginLeft = '10px';

            removeBtn.onclick = () => {
                selectedFiles.splice(index, 1); // Удаляем файл из массива
                updateFileList(); // Обновляем список файлов
            };

            fileList.appendChild(fileLink);
            fileList.appendChild(removeBtn);
            fileList.appendChild(document.createElement('br'));
        });
    }

    // Обработка закрытия попапа
    const btnClose = popup.querySelector('.signin-header>span');
    btnClose.onclick = () => {
        const addcommentpopup = document.getElementById('add_comment');
        addcommentpopup.parentElement.removeChild(addcommentpopup);
    };
}


function clickBtnComment1(e) {
    const btn1 = e.currentTarget;

    var data_type = btn1.parentElement.getAttribute("data-type");
    if (btn1.parentElement.parentElement.classList.contains('open')) {
        btn1.parentElement.parentElement.classList.remove('open');
        removeStructSubrowComment(btn1);
    } else {
        btn1.parentElement.parentElement.classList.add('open');
        ajaxGetSubrowDataComment(btn1.parentElement.getAttribute("data-id"), btn1, data_type);
    };
};
function clickBtnComment2(e) {
    const btn2 = e.currentTarget;

    let prev = btn2.parentElement.getAttribute("data-type");
    if (btn2.parentElement.parentElement.classList.contains('open')) {
        btn2.parentElement.parentElement.classList.remove('open');
        removeStructSubrowComment(btn2);
    } else {
        btn2.parentElement.parentElement.classList.add('open');
        ajaxGetSubrowDataComment(btn2.parentElement.getAttribute("data-id"), btn2, structnext[prev], prev);
    };
};
function clickBtnComment(e) {
    const btnTask = e.currentTarget;
    const data_type = btnTask.parentElement.getAttribute("data-type");
    const data_id = btnTask.parentElement.getAttribute("data-id");

    const structData = btnTask.parentElement;
    let listParents = [];
    if (data_type != "company") {
        let struct_external = structData.parentElement.parentElement;
        let parentType = data_type;
        let parentId = data_id;
        while (parentType != "company") {
            let structInner = struct_external.parentElement;
            if (structInner.classList.contains('struct-inner')) {
                if (parentType != structInner.childNodes[1].getAttribute('data-type')) {
                    parentType = structInner.childNodes[1].getAttribute('data-type');
                    parentId = structInner.childNodes[1].getAttribute('data-id');
                    listParents.push({
                        'id': parentId,
                        'type': parentType
                    });
                } else {
                    parentType = structInner.childNodes[1].getAttribute('data-type');
                }
            } else { parentType = "company"; };
            struct_external = structInner.parentElement;
        }
    };
//    console.log(listParents)




    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_comment';
    popup.innerHTML = "<div class=\"comment-add-popup\">" +
                      "  <div class=\"signin-header\"><span>&#10006</span></div>" +
                      "    <form class=\"comment-form\" id=\"comment-form\" action=\"#\"enctype=\"multipart/form-data\">" +
                      "      <textarea class=\"comment-name\" name=\"name\" placeholder=\"Краткое описание\" required></textarea>" +
                      "      <textarea name=\"full_name\" placeholder=\"Комментарий\" required></textarea>" +
                      "      <label for=\"file-upload\" class=\"file-upload-label\">Загрузить файл</label>" +
                      "      <input type=\"file\" id=\"file-upload\" name=\"file\" class=\"file-upload-input\" multiple/>" +
                      "      <div id=\"file-list\"></div>" +
                      "      <button type=\"submit\">Отправить</button>" +
                      "    </form>" +
                      "</div>";
    body.prepend(popup);

    const fileInput = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');

    let selectedFiles = []; // Массив для хранения всех выбранных файлов

    fileInput.addEventListener('change', (e) => {
        const newFiles = Array.from(fileInput.files); // Массив новых файлов
        selectedFiles = selectedFiles.concat(newFiles); // Добавляем новые файлы к уже существующим
        updateFileList(); // Обновляем отображение списка файлов
    });

    function updateFileList() {
        fileList.innerHTML = ''; // Очищаем предыдущий список файлов
        selectedFiles.forEach((file, index) => {
            const fileLink = document.createElement('a');
            fileLink.href = URL.createObjectURL(file);
            fileLink.target = '_blank';
            fileLink.textContent = file.name;

            // Добавляем возможность удаления файла
            const removeBtn = document.createElement('span');
            removeBtn.innerHTML = ' &#10006;';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.color = '#ffffff';
            removeBtn.onclick = () => {
                selectedFiles.splice(index, 1); // Удаляем файл из массива
                updateFileList(); // Обновляем список файлов
            };

            fileList.appendChild(fileLink);
            fileList.appendChild(removeBtn);
            fileList.appendChild(document.createElement('br'));
        });
    }

    const formElement = document.getElementById('comment-form'); // извлекаем элемент формы
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formElement); // создаём объект FormData, передаём в него элемент формы
        // теперь можно извлечь данные
        const name = formData.get('name');
        const full_name = formData.get('full_name');
        // Добавляем id и type в formData
        formData.append('id', data_id);
        formData.append('type', data_type);
        formData.append('structures', JSON.stringify(listParents));
        $.ajax({
                url: '/addcomment/',
                method: 'POST',
                data: formData, // Отправляем объект FormData, содержащий файлы
                processData: false, // Не обрабатываем данные, т.к. это FormData
                contentType: false, // Устанавливаем contentType в false, чтобы браузер автоматически установил boundary
                headers: {
                    'X-CSRFToken': csrfmiddlewaretoken // Передаем CSRF-токен в заголовках
                },
                success: function(data) {
                    const addcommentpopup = document.getElementById('add_comment');
                    addcommentpopup.parentElement.removeChild(addcommentpopup);
                },
                error: function(data) {
                    alert('Ошибка записи комментария!');
                },
            });
        });

    const btnClose = popup.querySelector('.signin-header>span');
    btnClose.onclick = () => {
        const addcommentpopup = document.getElementById('add_comment');
        addcommentpopup.parentElement.removeChild(addcommentpopup);
    };
};
function clickStructName(e) {
    const btnStructName = e.currentTarget;
    const data_type = btnStructName.parentElement.getAttribute("data-type");
    const data_id = btnStructName.parentElement.getAttribute("data-id");
    $.ajax({
        url: '/getcomments/',
        method: 'POST',
        dataType: 'json',
        data: {
                'id': data_id,
                'type': data_type,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
              },
        success: function(data) {
            viewComments(data, data_type, data_id, btnStructName.innerHTML);
        },
        error: function(xhr, status, error) {
            console.error('Ошибка загрузки комментариев:', error);
        },
    });
};
function viewComments(comments, type, id, name) {
    const commentsData = document.getElementById('comments-data');
    const commentsRel = document.getElementById('comments-all');
    commentsData.innerHTML = '';
    const commentsHeader = document.getElementById('comments-header-name');
    commentsHeader.setAttribute('data-type', type);
    commentsHeader.setAttribute('data-id', id);
    const commentsHeaderTitle = document.getElementById('comments-header-name-title');
    commentsHeaderTitle.innerHTML = structname[type] + ': ';
    const commentsHeaderTxt = document.getElementById('comments-header-name-txt');
    commentsHeaderTxt.innerHTML = name;
    for (let i=0; i<comments.length; i++) {
        if (commentsRel.checked || comments[i]['actual']) {
            const commentBlock = document.createElement('div');
            commentBlock.classList.add("comment-view-block");
            const commentName = document.createElement('div');
            commentName.classList.add("comment-view-name");
            commentName.dataset.commentid = comments[i]['id']; // создает data-commentid="id комментария"
            commentName.innerHTML = comments[i]['name'];
            commentBlock.appendChild(commentName);

            const commentFooter = document.createElement('div');
            commentFooter.classList.add("comment-view-footer");
            commentFooter.innerHTML = "<div class=\"comment-view-info\">" +
                      "<div class=\"comment-view-btn\" title=\"Развернуть комментарий\"><svg fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 Z\"/></svg></div>" +
                      "<div class=\"comment-view-user\">" + comments[i]['user'] + "</div>" +
                      "<div class=\"comment-view-date\">" + comments[i]['created'] + "</div>" +
                      "</div>" +
                      "<div class=\"comment-view-relevance\">" +
                      "<label for=\"" + comments[i]['id'] + "\">Актуальность</label>" +
                      "<input id=\"" + comments[i]['id'] + "\" type=\"checkbox\">" +
                      "</div>";
            commentBlock.appendChild(commentFooter);
            const commentFullname = document.createElement('div');
            commentFullname.classList.add("comment-view-fullname");
            commentFullname.innerHTML = comments[i]['full_name'];
            commentBlock.appendChild(commentFullname);
            commentsData.appendChild(commentBlock);
            const check = document.getElementById(comments[i]['id']);
            check.checked = comments[i]['actual'];
        };
    };
    openComment();
    changeCommentCheck();

    const commentsViewName = comments_data.querySelectorAll('.comment-view-name');
    for (let commentViewName of commentsViewName) { commentViewName.onclick = openPopupComment; };
};
function changeCommentsCheck() {
    const commentsCheck = document.getElementById('comments-all');
    if (commentsCheck) {
        commentsCheck.onchange = loadComments;
    };
};
changeCommentsCheck();

function openComment() {
    const btnsOpenComment = document.querySelectorAll('.comment-view-btn');
    if (btnsOpenComment) {
        for (let btnOpenComment of btnsOpenComment) { btnOpenComment.onclick = (e) => {
            const btn = e.currentTarget;
            const commentfull = btn.parentElement.parentElement.nextSibling;
            commentfull.classList.toggle('open');
        }};
    };
};
function addStructSubrowComment(btn, data_type, objs) {
    /*
    btn - элемент html (элементы классов struct-btn-1 или struct-btn-2), на котором нажата кнопка мыши
    data_type - тип данных (data-attribute): company / division / project / license / field / facility
    objs - список списков [
                            [id, name],
                            ...
                          ] - столько полей меню будет добавлено
    */
    for (let obj of objs) {
        const pointMenu = document.createElement('div');
        pointMenu.classList.add("struct-external");
        if (structbtn1[data_type]) {
            htmlBtn1 = "<div class=\"struct-btn-1\" title=\"Подчиненная структура\"><svg class=\"struct-btn-1\" fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 Z\"/></svg></div>";
        } else { htmlBtn1 = ''; };
        if (structbtn2[data_type]) {
            htmlBtn2 = "<div class=\"struct-btn-2\" title=\"Уровень ниже\"><svg class=\"struct-btn-2\" fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>";
        } else { htmlBtn2 = ''; };
        pointMenu.innerHTML = "    <div class=\"struct-branch\"></div>" +
                              "    <div class=\"struct-inner\">" +
                              "        <div class=\"struct-data\" data-type=" + data_type + " data-id=" + obj[0] + ">" +
                                            htmlBtn1 + htmlBtn2 +
                              "            <div class=\"struct-comment-name\">" + obj[1] + "</div>" +
                              "            <div class=\"struct-comment\"><img src=\"/static/img/task.png\" title=\"Добавить комментарий\"/></div>"
                              "        </div>" +
                              "    </div>"
        btn.parentElement.parentElement.appendChild(pointMenu);
    };
    btnsClickComment();
};
function removeStructSubrowComment(btn) {
    const childs = btn.parentElement.parentElement.querySelectorAll('.struct-external');
    for (let child of childs){
        btn.parentElement.parentElement.removeChild(child);
    };
};
function ajaxGetSubrowDataComment(id, btn, data_type, prev='') {
    if (!prev) {
        // prev - пустая строка, null или undefined
        keyStruct = data_type;
    } else { keyStruct = data_type + '_' + prev; };
    if (struct[keyStruct]) {
        $.ajax({
            url: struct[keyStruct],
            method: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
            success: function(data) {
                addStructSubrowComment(btn, data_type, data);
                // location.reload(false);
            },
            error: function(data) {
                alert( 'Ошибка в ajaxGetSubrowDataComment');
            },
        });
    };
};
function loadComments() {
    const headerName = document.getElementById('comments-header-name');
    const data_type = headerName.getAttribute('data-type');
    const data_id = headerName.getAttribute('data-id');
    const name = document.getElementById('comments-header-name-txt').innerHTML;
    if (data_type && data_id) {
        $.ajax({
            url: '/getcomments/',
            method: 'POST',
            dataType: 'json',
            data: {
                'id': data_id,
                'type': data_type,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
                },
            success: function(data) {
                viewComments(data, data_type, data_id, name);
            },
            error: function(xhr, status, error) {
                console.error('Ошибка загрузки комментариев:', error);
            },
        });
    };
};
function changeCommentCheck() {
    const commentsRel = document.querySelectorAll('.comment-view-relevance > input');
    if (commentsRel) {
        for (let commentRel of commentsRel) {
            commentRel.onchange = (e) => {
                $.ajax({
                    url: '/checkcomment/',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                            'id': e.currentTarget.id,
                            'value': commentRel.checked,
                            'csrfmiddlewaretoken': csrfmiddlewaretoken,
                          },
                    success: function(data) {
                        commentRel.checked = data['check'];
                        loadComments();
                    },
                    error: function(xhr, status, error) {
                        console.error('Ошибка изменения актуальности комментария:', error);
                    },
                });
            };
        };
    };
};


//const config = {};
//window.ClassicEditor
//   .create( document.querySelector( '#editor' ), config )
//   .catch( error => {
//       console.error( error );
//   } );