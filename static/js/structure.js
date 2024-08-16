const leftaside = document.querySelector('.body-left');
const csrfmiddlewaretoken = document.querySelector('nav input[name="csrfmiddlewaretoken"]').value


//function closeAllStructures() {
//        // Закрываем все открытые элементы
//        console.log('Удалить')
//        const openElements = leftaside.querySelectorAll('.struct-data.open');
//        openElements.forEach(el => {
//            el.classList.remove('open');
//            // Удаляем структуру из DOM, если требуется
//            removeStructure(el.querySelector('.struct-btn-1'));
//            removeStructure(el.querySelector('.struct-btn-2'));
//        });
//    };

function btnsClick() {

    const btns1 = leftaside.querySelectorAll('.struct-btn-1');
    const btns2 = leftaside.querySelectorAll('.struct-btn-2');
    if (btns1) {
        for (let btn1 of btns1) {
            btn1.onclick = function(e) {
//            closeAllStructures();
//               console.log('btn1')
            // Для компании и подкомпании
                if (btn1.parentElement.getAttribute("data-type") === 'company') {
                    if (btn1.parentElement.parentElement.classList.contains('open')) {
                        btn1.parentElement.parentElement.classList.remove('open');
                        removeStructure(btn1);
                    }
                    else {
                        btn1.parentElement.parentElement.classList.add('open');
                        getSubcompany(btn1.parentElement.getAttribute("data-id"), btn1);
                    };
                };
                 // Для проекта
                if (btn1.parentElement.getAttribute("data-type") === 'division') {
                    if (btn1.parentElement.parentElement.classList.contains('open')) {
                        btn1.parentElement.parentElement.classList.remove('open');
                        removeStructure(btn1);
                    } else {
                        btn1.parentElement.parentElement.classList.add('open');
                        getProject(btn1.parentElement.getAttribute("data-id"), btn1);
                 }
                };
                 // Для лицензии
                if (btn1.parentElement.getAttribute("data-type") === 'project') {
//                    console.log('ok')
                    if (btn1.parentElement.parentElement.classList.contains('open')) {
                        btn1.parentElement.parentElement.classList.remove('open');
                        removeStructure(btn1);
                    } else {
                        btn1.parentElement.parentElement.classList.add('open');
                        getLicense(btn1.parentElement.getAttribute("data-id"), btn1);
                 }
                };
              };
            };
          };
// Для подразделения и под подразделения
    if (btns2) {
        for (let btn2 of btns2) {
            btn2.onclick = function(e) {
//            closeAllStructures();

                if (btn2.parentElement.getAttribute("data-type") === 'company') {
                    if (btn2.parentElement.parentElement.classList.contains('open')) {
                        btn2.parentElement.parentElement.classList.remove('open');
                        removeStructure(btn2);
                    } else {
                        btn2.parentElement.parentElement.classList.add('open');
                        getDivision(btn2.parentElement.getAttribute("data-id"), btn2);
                    };
                };
                if (btn2.parentElement.getAttribute("data-type") === 'division') {
                    if (btn2.parentElement.parentElement.classList.contains('open')) {
                        btn2.parentElement.parentElement.classList.remove('open');
                        removeStructure(btn2);
                    } else {
                        btn2.parentElement.parentElement.classList.add('open');
                        getSubDivision(btn2.parentElement.getAttribute("data-id"), btn2);
                        getDivision(btn2.parentElement.getAttribute("data-id"), btn2);
                    };
                };
            };
        };
    };
};
btnsClick();


function getSubcompany(id, btn) {
    $.ajax({
            url: "/getsubcompanies/",
            method: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
            success: function(data) {
                addSubcompanies(data, btn);
//                location.reload(false);
            },
            error: function(data) {
                alert( 'Дочерние компании отсутствуют');
            },
        });
};

function getDivision(id, btn) {
    $.ajax({
            url: "/getdivisions/",
            method: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
            success: function(data) {
                addDivisions(data, btn);
//                location.reload(false);
            },
            error: function(data) {
                alert('Подразделения компании отсутствуют');
            },
        });
};

function getSubDivision(id, btn) {
    $.ajax({
            url: "/getsubdivisions/",
            method: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
            success: function(data) {
                addDivisions(data, btn);
//                location.reload(false);
            },
            error: function(data) {
                alert('Подразделения компании отсутствуют');
            },
        });
};

function getProject(id, btn) {
    $.ajax({
            url: "/getproject/",
            method: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
            success: function(data) {
                addProject(data, btn);
//                location.reload(false);
            },
            error: function(data) {
                alert('Проекты подразделения отсутствуют');
            },
        });
};

function getLicense(id, btn) {
    $.ajax({
            url: "/getlicense/",
            method: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            },
            success: function(data) {
                addLicense(data, btn);
            },
            error: function(data) {
                alert('Лицензии проекта отсутствуют');
            },
        });
};
function addSubcompanies(data, btn) {
    for (let company of data) {

        const structExternal = document.createElement('div');
        structExternal.classList.add("struct-external");
        btn.parentElement.parentElement.appendChild(structExternal);

        const structBranch = document.createElement('div');
        structBranch.classList.add("struct-branch");
        structExternal.appendChild(structBranch);

        const structInner = document.createElement('div');
        structInner.classList.add("struct-inner");
        structExternal.appendChild(structInner);

        const structData = document.createElement('div');
        structData.classList.add("struct-data");
        structData.setAttribute("data-type", "company");
        structData.setAttribute("data-id", company[0]);
        structData.innerHTML = "<div class=\"struct-btn-1\"><svg class=\"struct-btn-1\" fill=\"white\"><path d=\"M 0,0 10,0 5,5 Z\"/></svg></div>" +
                               "<div class=\"struct-btn-2\"><svg class=\"struct-btn-2\" fill=\"white\"><path d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>" +
                               "<div class=\"struct-name\">" + company[1] + "</div>" +
                               "<div class=\"struct-task\"><img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>";
        structInner.appendChild(structData);
    };
    btnsClick();
};

function addDivisions(data, btn) {
    for (let division of data) {

        const structExternal = document.createElement('div');
        structExternal.classList.add("struct-external");
        btn.parentElement.parentElement.appendChild(structExternal);

        structExternal.innerHTML = "<div class=\"struct-branch\"></div>"

        const structInner = document.createElement('div');
        structInner.classList.add("struct-inner");
        structExternal.appendChild(structInner);

        const structData = document.createElement('div');
        structData.classList.add("struct-data");
        structData.setAttribute("data-type", "division");
        structData.setAttribute("data-id", division[0]);
        structData.innerHTML = "<div class=\"struct-btn-1\"><svg class=\"struct-btn-1\" fill=\"white\"><path d=\"M 0,0 10,0 5,5 Z\"/></svg></div>" +
                               "<div class=\"struct-btn-2\"><svg class=\"struct-btn-2\" fill=\"white\"><path d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>" +
                               "<div class=\"struct-name\">" + division[1] + "</div>" +
                               "<div class=\"struct-task\"><img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>";
        structInner.appendChild(structData);
    };
    btnsClick();
};

function addProject(data, btn) {
    for (let project of data) {

        const structExternal = document.createElement('div');
        structExternal.classList.add("struct-external");
        btn.parentElement.parentElement.appendChild(structExternal);

        structExternal.innerHTML = "<div class=\"struct-branch\"></div>"

        const structInner = document.createElement('div');
        structInner.classList.add("struct-inner");
        structExternal.appendChild(structInner);

        const structData = document.createElement('div');
        structData.classList.add("struct-data");
        structData.setAttribute("data-type", "project");
        structData.setAttribute("data-id", project[0]);
        structData.innerHTML = "<div class=\"struct-btn-2\"><svg class=\"struct-btn-2\" fill=\"white\"><path d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>" +
                               "<div class=\"struct-name\">" + project[1] + "</div>" +
                               "<div class=\"struct-task\"><img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>";
        structInner.appendChild(structData);
    };
    btnsClick();
};

function addLicense(data, btn) {
    for (let license of data) {

        const structExternal = document.createElement('div');
        structExternal.classList.add("struct-external");
        btn.parentElement.parentElement.appendChild(structExternal);

        structExternal.innerHTML = "<div class=\"struct-branch\"></div>"

        const structInner = document.createElement('div');
        structInner.classList.add("struct-inner");
        structExternal.appendChild(structInner);

        const structData = document.createElement('div');
        structData.classList.add("struct-data");
        structData.setAttribute("data-type", "license");
        structData.setAttribute("data-id", license[0]);
        structData.innerHTML = "<div class=\"struct-btn-2\"><svg class=\"struct-btn-2\" fill=\"white\"><path d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>" +
                               "<div class=\"struct-name\">" + license[1] + "</div>" +
                               "<div class=\"struct-task\"><img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>";
        structInner.appendChild(structData);
    };
    btnsClick();
};
function removeStructure(btn) {
    const childs = btn.parentElement.parentElement.querySelectorAll('.struct-external');
    for (let child of childs){
        btn.parentElement.parentElement.removeChild(child);
    }
};


                //  Для проекта
//                if (btn1.parentElement.getAttribute("data-type") === 'division') {
//                    if (btn1.parentElement.parentElement.classList.contains('open')) {
//                        btn1.parentElement.parentElement.classList.remove('open');
//                        removeProject(btn1);
//                    } else {
//                        btn1.parentElement.parentElement.classList.add('open');
//                        getProject(btn1.parentElement.getAttribute("data-id"), btn1);