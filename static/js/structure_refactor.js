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

function btnsClick() {
    const btns1 = leftaside.querySelectorAll('.struct-btn-1');
    const btns2 = leftaside.querySelectorAll('.struct-btn-2');
    const btnsTask = leftaside.querySelectorAll('.struct-task');

    if (btns1 && btns2 && btnsTask) {
    // for (let btn1 of btns1) { btn1.addEventListener("click", clickBtn1); };
        for (let btn1 of btns1) { btn1.onclick = clickBtn1; };
        for (let btn2 of btns2) { btn2.onclick = clickBtn2; };
        for (let btnTask of btnsTask) { btnTask.onclick = clickBtnTask; };
    };
};
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
    $.ajax({
        url: '/addcomment/',
        method: 'POST',
        dataType: 'json',
            data: {
                'id': data_id,
                'type': data_type,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            }
    });
};

btnsClick();


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


