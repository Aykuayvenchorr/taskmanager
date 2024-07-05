const leftaside = document.querySelector('.body-left');
const csrfmiddlewaretoken = document.querySelector('nav input[name="csrfmiddlewaretoken"]').value

const struct = {
    company: '/getsubcompanies/',
    division_company: '/getdivisions/',
    division: '/getsubdivisions/',
    project_division: '/getproject/',
    license_project: '/getlicense/',
    field_license: '/getfield/',
    facility_field: '/getfacility/',
    facility: '/getsubfacility/'
};
const structnext = {
    company: 'division',
    division: 'project',
    project: 'license',
    license: 'field',
    field: 'facility'
};
const structbtn1 = {
    company: true,
    division: true,
    project: false,
    license: false,
    field: false,
    facility: true
};
const structbtn2 = {
    company: true,
    division: true,
    project: true,
    license: true,
    field: true,
    facility: false
};
const structname = {
    company: 'Компания',
    division: 'Подразделение',
    project: 'Проект',
    license: 'Лицензия',
    field: 'Месторождение',
    facility: 'Объект'
};

function btnsClick() {
    const btns1 = leftaside.querySelectorAll('.struct-btn-1');
    const btns2 = leftaside.querySelectorAll('.struct-btn-2');
    const btnsTask = leftaside.querySelectorAll('.struct-task');
    const structNames = leftaside.querySelectorAll('.struct-name');

    if (btns1 && btns2 && btnsTask) {
    // for (let btn1 of btns1) { btn1.addEventListener("click", clickBtn1); };
        for (let btn1 of btns1) { btn1.onclick = clickBtn1; };
        for (let btn2 of btns2) { btn2.onclick = clickBtn2; };
        for (let btnTask of btnsTask) { btnTask.onclick = clickBtnTask; };
        for (let structName of structNames) { structName.onclick = clickStructName; };
    };
};
btnsClick();

function clickBtn1(e) {
    const btn1 = e.currentTarget;
    var data_type = btn1.parentElement.getAttribute("data-type");
    if (btn1.parentElement.parentElement.classList.contains('open')) {
        btn1.parentElement.parentElement.classList.remove('open');
        removeStructSubrow(btn1);
    } else {
        btn1.parentElement.parentElement.classList.add('open');
        ajaxGetSubrowData(btn1.parentElement.getAttribute("data-id"), btn1, data_type);
    };
};
function clickBtn2(e) {
    const btn2 = e.currentTarget;
    let prev = btn2.parentElement.getAttribute("data-type");
    if (btn2.parentElement.parentElement.classList.contains('open')) {
        btn2.parentElement.parentElement.classList.remove('open');
        removeStructSubrow(btn2);
    } else {
        btn2.parentElement.parentElement.classList.add('open');
        ajaxGetSubrowData(btn2.parentElement.getAttribute("data-id"), btn2, structnext[prev], prev);
    };
};
function clickBtnTask(e) {
    const btnTask = e.currentTarget;
    const data_type = btnTask.parentElement.getAttribute("data-type");
    const data_id = btnTask.parentElement.getAttribute("data-id");
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_comment';
    popup.innerHTML = "<div class=\"comment-add-popup\">" +
                      "  <div class=\"signin-header\"><span>&#10006</span></div>" +
                      "    <form class=\"comment-form\" id=\"comment-form\" action=\"#\">" +
                      "      <textarea class=\"comment-name\" name=\"name\" placeholder=\"Краткое описание\" required></textarea>" +
                      "      <textarea name=\"full_name\" placeholder=\"Комментарий\" required></textarea>" +
                      "      <button type=\"submit\">Отправить</button>" +
                      "    </form>" +
                      "</div>";
    body.prepend(popup);

    const formElement = document.getElementById('comment-form'); // извлекаем элемент формы
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formElement); // создаём объект FormData, передаём в него элемент формы
        // теперь можно извлечь данные
        const name = formData.get('name');
        const full_name = formData.get('full_name');
        $.ajax({
            url: '/addcomment/',
            method: 'POST',
            dataType: 'json',
                data: {
                    'id': data_id,
                    'type': data_type,
                    'csrfmiddlewaretoken': csrfmiddlewaretoken,
                    'name': name,
                    'full_name': full_name,
                },
                success: function(data) {
                    const addcommentpopup = document.getElementById('add_comment');
                    addcommentpopup.parentElement.removeChild(addcommentpopup);
                },
                error: function(data) {
                    alert( 'Ошибка записи комментария!');
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
function addStructSubrow(btn, data_type, objs) {
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
                              "            <div class=\"struct-name\">" + obj[1] + "</div>" +
                              "            <div class=\"struct-task\"><img src=\"/static/img/task.png\" title=\"Добавить комментарий\"/></div>"
                              "        </div>" +
                              "    </div>"
        btn.parentElement.parentElement.appendChild(pointMenu);
    };
    btnsClick();
};
function removeStructSubrow(btn) {
    const childs = btn.parentElement.parentElement.querySelectorAll('.struct-external');
    for (let child of childs){
        btn.parentElement.parentElement.removeChild(child);
    };
};
function ajaxGetSubrowData(id, btn, data_type, prev='') {
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
                addStructSubrow(btn, data_type, data);
                // location.reload(false);
            },
            error: function(data) {
                alert( 'Ошибка в ajaxGetSubrowData');
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

