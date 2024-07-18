function btnsClickTask() {
    const btns1 = leftaside.querySelectorAll('.struct-btn-1');
    const btns2 = leftaside.querySelectorAll('.struct-btn-2');
    const btnsTask = leftaside.querySelectorAll('.struct-task');
    const tasksName = leftaside.querySelectorAll('.struct-task-name');
    const subTasks = body_data.querySelectorAll('.task-btn-open');


    if (btns1 && btns2 && btnsTask && (tasksName.length > 0)) {
    // for (let btn1 of btns1) { btn1.addEventListener("click", clickBtn1); };
        for (let btn1 of btns1) { btn1.onclick = clickBtnTask1; };
        for (let btn2 of btns2) { btn2.onclick = clickBtnTask2; };
        for (let btnTask of btnsTask) { btnTask.onclick = clickBtnTask; };
        for (let taskName of tasksName) { taskName.onclick = clickStructNameTask; };
        for (let subTask of subTasks) { subTask.onclick = clickSubTasks; };
    };
};
btnsClickTask();

function clickBtnTask1(e) {
    const btn1 = e.currentTarget;
    var data_type = btn1.parentElement.getAttribute("data-type");
    if (btn1.parentElement.parentElement.classList.contains('open')) {
        btn1.parentElement.parentElement.classList.remove('open');
        removeStructSubrowTask(btn1);
    } else {
        btn1.parentElement.parentElement.classList.add('open');
        ajaxGetSubrowDataTask(btn1.parentElement.getAttribute("data-id"), btn1, data_type);
    };
};
function clickBtnTask2(e) {
    const btn2 = e.currentTarget;
    let prev = btn2.parentElement.getAttribute("data-type");
    if (btn2.parentElement.parentElement.classList.contains('open')) {
        btn2.parentElement.parentElement.classList.remove('open');
        removeStructSubrowTask(btn2);
    } else {
        btn2.parentElement.parentElement.classList.add('open');
        ajaxGetSubrowDataTask(btn2.parentElement.getAttribute("data-id"), btn2, structnext[prev], prev);
    };
};

//    const btn = e.currentTarget;
//    let prev = btn.getAttribute("data-type");
//    if (btn.closest('.task-view-block').classList.contains('open')) {
//        btn.closest('.task-view-block').classList.remove('open');
//        removeTaskSubtasks(btn);
//    } else {
//        btn.closest('.task-view-block').classList.add('open');
//        ajaxGetSubtaskData(btn.getAttribute("data-taskid"), btn, prev);
//    }
//}
function clickBtnTask(e) {
    const btnTask = e.currentTarget;
//   const data_type = btnTask.parentElement.getAttribute("data-type");


    let data_type;
    if (btnTask.parentElement.getAttribute("data-type")) {
        data_type = btnTask.parentElement.getAttribute("data-type");
    } else {
        data_type = btnTask.getAttribute("data-type");
    }

    let data_id;
    if (btnTask.parentElement.getAttribute("data-id")) {
        data_id = btnTask.parentElement.getAttribute("data-id");
//        console.log(data_id)
    } else {
        const tasksHeader = document.getElementById('tasks-header-name');
        data_id = tasksHeader.getAttribute("data-id");
    }
    let data_taskid;
    if (btnTask.getAttribute("data-taskid")) {
        data_taskid = btnTask.getAttribute("data-taskid")
    } else {
        data_taskid = null
    }


    console.log("data_type:", data_type);
    console.log("data_id:", data_id);
    console.log("data_taskid:", data_taskid);
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_task';
    popup.innerHTML = "<div class=\"task-add-popup\">" +
                      "  <div class=\"signin-header\"><span>&#10006</span></div>" +
                      "    <form class=\"task-form\" id=\"task-form\" action=\"#\">" +
                      "      <textarea class=\"task-name\" name=\"name\" placeholder=\"Краткое описание\" required></textarea>" +
                      "      <textarea name=\"descr_task\" placeholder=\"Задача\" required></textarea>" +
                      "      <label for=\"date\">Дата начала: </label>" +
                      "      <input type=\"date\" id=\"date\" name=\"date\"/>" +
                      "      <textarea style=\"min-height: 7px;\" name=\"term\" placeholder=\"Введите срок задачи в днях\" required></textarea>" +
                      "      <label for=\"select_importance\">Важность задачи: </label>" +
                      "      <select id=\"select_importance\" name=\"importance\"><option>Высокая степень важности</option><option>Средняя степень важности</option><option>Низкая степень важности</option></select>" +
                      "      <label for=\"date_dev\">Дата освоения: </label>" +
                      "      <input type=\"date\" id=\"date\" name=\"date_dev\"/>" +
                      "      <label for=\"date_fund\">Дата финансирования: </label>" +
                      "      <input type=\"date\" id=\"date_fund\" name=\"date_fund\"/>" +
                      "      <textarea style=\"min-height: 7px;\" name=\"cost\" placeholder=\"Введите стоимость\"></textarea>" +
                      "      <label for=\"select_status\">Статус задачи: </label>" +
                      "      <select id=\"select_status\" name=\"status\"><option>В работе</option><option>Отложена</option><option>Завершена</option></select>" +
                      "      <label for=\"select_user\">Ответственный: </label>" +
                      "      <select id=\"select_user\" name=\"select_user\"></select>" +
                      "      <button type=\"submit\">Отправить</button>" +
                      "    </form>" +
                      "</div>";
    body.prepend(popup);


    // Запрос на получение списка пользователей
    $.ajax({
        url: '/get_users/',
        method: 'GET',
        dataType: 'json',
        success: function(users) {
            const selectUser = document.getElementById('select_user');
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.name + ' ' + user.surname;
                selectUser.appendChild(option);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка получения списка пользователей:', textStatus, errorThrown);
        }
    });


    const formElement = document.getElementById('task-form'); // извлекаем элемент формы
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formElement); // создаём объект FormData, передаём в него элемент формы
        // теперь можно извлечь данные
        const name = formData.get('name');
        const descr_task = formData.get('descr_task');
        const date_begin = formData.get('date');
        const term = formData.get('term');
        const importance = formData.get('importance');
        const status = formData.get('status');

        const select_user = formData.get('select_user');


        var data = {
                    'id': data_id,
                    'task_id': data_taskid,
                    'type': data_type,
                    'csrfmiddlewaretoken': csrfmiddlewaretoken,
                    'name': name,
                    'descr_task': descr_task,
                    'date_begin': date_begin,
                    'term': term,
                    'importance': importance,
                    'status': status,
                    'select_user': select_user
            };

         // Проверка значений перед добавлением
        const date_develop = formData.get('date_dev');
        if (date_develop) data['date_develop'] = date_develop;

        const date_funding = formData.get('date_fund');
        if (date_funding) data['date_funding'] = date_funding;

        const cost = formData.get('cost');
        if (cost) data['cost'] = cost;

        $.ajax({
            url: '/addtask/',
            method: 'POST',
            dataType: 'json',
                data: data,
                success: function(data) {
                    const addtaskpopup = document.getElementById('add_task');
                    addtaskpopup.parentElement.removeChild(addtaskpopup);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                // Выводим подробности ошибки в консоль для отладки
                console.error('Ошибка записи задачи:', textStatus, errorThrown);
                console.error('Ответ сервера:', jqXHR.responseText);
                alert('Ошибка записи задачи! Заполните все поля');
            },
        });
    });

    const btnClose = popup.querySelector('.signin-header>span');
    btnClose.onclick = () => {
        const addtaskpopup = document.getElementById('add_task');
        addtaskpopup.parentElement.removeChild(addtaskpopup);
    };
};
function clickStructNameTask(e) {
    const btnStructName = e.currentTarget;
    const data_type = btnStructName.parentElement.getAttribute("data-type");
    const data_id = btnStructName.parentElement.getAttribute("data-id");
    $.ajax({
        url: '/gettasks/',
        method: 'POST',
        dataType: 'json',
        data: {
                'id': data_id,
                'type': data_type,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
              },
        success: function(data) {
            viewTasks(data, data_type, data_id, btnStructName.innerHTML);
        },
        error: function(xhr, status, error) {
            console.error('Ошибка загрузки задач:', error);
        },
    });
};
function viewTasks(tasks, type, id, name) {
    const tasksData = document.getElementById('tasks-data');
    const tasksRel = document.getElementById('tasks-all');
    tasksData.innerHTML = '';
    const tasksHeader = document.getElementById('tasks-header-name');
    tasksHeader.setAttribute('data-type', type);
    tasksHeader.setAttribute('data-id', id);
    const tasksHeaderTitle = document.getElementById('tasks-header-name-title');
    tasksHeaderTitle.innerHTML = structname[type] + ': ';
    const tasksHeaderTxt = document.getElementById('tasks-header-name-txt');
    tasksHeaderTxt.innerHTML = name;
    for (let i=0; i<tasks.length; i++) {
            const taskExternal = document.createElement('div');
            taskExternal.classList.add("task-external");
            const taskBlock = document.createElement('div');
            taskBlock.classList.add("task-view-block");
            taskExternal.innerHTML = "<div class=\"task-branch\"></div>"
            const taskName = document.createElement('div');
            taskName.classList.add("task-view-name");
            taskName.innerHTML = tasks[i]['name'];
            taskBlock.appendChild(taskName);

            const taskFooter = document.createElement('div');
            taskFooter.classList.add("task-view-footer");
            taskFooter.innerHTML = "<div class=\"task-view-info\">" +
                      "<div class=\"task-view-btn\" title=\"Развернуть описание задачи\"><svg fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 Z\"/></svg></div>" +
                      "<div class=\"task-btn-open\" title=\"Развернуть подзадачу\"><svg fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>" +
                      "<div class=\"task-view-user-created\">" + "Создал: " + tasks[i]['user_created'] + "</div>" +
                      "<div class=\"task-view-user-responsible\">" + "Ответственный: " + tasks[i]['user_responsible'] + "</div>" +
                      "</div>" +
//                      "<div class=\"task-view-relevance\">" +
                      "<div class=\"task-view-status\">" + "Статус: " + tasks[i]['status'] + "</div>" +
                      "<div class=\"task-view-importance\">" + "Важность: " + tasks[i]['importance'] + "</div>" +
                      "<div class=\"task-view-date-begin\">" + "Дата начала: " + tasks[i]['date_begin'] + "</div>" +
                      "<div class=\"task-view-term\">" + "Срок: " + tasks[i]['term'] + "</div>" +
//                      "<label for=\"" + tasks[i]['id'] + "\">Актуальность</label>" +
//                      "<input id=\"" + tasks[i]['id'] + "\" type=\"checkbox\">" +
                      "</div>";
            taskBlock.appendChild(taskFooter);
            const taskFullname = document.createElement('div');
            const taskAdd = document.createElement('div');
            taskFullname.classList.add("task-view-fullname");
            taskAdd.classList.add("struct-task");
            taskAdd.dataset.taskid = tasks[i]['id']; // создает data-taskid="id задачи"
            taskAdd.dataset.type = type; // создает data-type="type задачи"
            taskFullname.innerHTML = tasks[i]['descr_task'];
            taskAdd.innerHTML = "<img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>"
            taskBlock.appendChild(taskFullname);
            taskFooter.appendChild(taskAdd);
            taskExternal.appendChild(taskBlock);
            tasksData.appendChild(taskExternal);
//            const check = document.getElementById(tasks[i]['id']);
//            check.checked = tasks[i]['actual'];
    const tasksAdd = body_data.querySelectorAll('.struct-task');
    const tasksOpen = body_data.querySelectorAll('.task-btn-open');
    for (let taskAdd of tasksAdd) { taskAdd.onclick = clickBtnTask; };
    for (let taskOpen of tasksOpen) { taskOpen.onclick = clickSubTasks; };



    };
    openTask();
    changeTaskCheck();
};

function clickSubTasks(e) {
    const btnSubTask = e.currentTarget;
    if (btnSubTask.classList.contains('open')) {
        btnSubTask.classList.remove('open');
        removeSubTask(btnSubTask);
    } else {
        btnSubTask.classList.add('open');
        ajaxGetSubTask(btnSubTask);
    }
}

function ajaxGetSubTask(btnSubTask) {
    const tasksHeader = document.getElementById('tasks-header-name');
    const data_id = tasksHeader.getAttribute("data-id");
    const data_type = tasksHeader.getAttribute("data-type");
    const data_taskid = btnSubTask.closest('.task-view-block').getAttribute("data-taskid");

    $.ajax({
        url: '/gettasks/',
        method: 'POST',
        dataType: 'json',
        data: {
            'id': data_id,
            'type': data_type,
            'task_id': data_taskid,
            'csrfmiddlewaretoken': csrfmiddlewaretoken,
        },
        success: function(data) {
            viewSubTasks(data, data_type, data_id, btnSubTask);
        },
        error: function(xhr, status, error) {
            console.error('Ошибка загрузки задач:', error);
        },
    });
}

function viewSubTasks(tasks, type, id, btnSubTask) {
    const taskBlock = btnSubTask.closest('.task-view-block');
    let taskExternal = taskBlock.querySelector('.task-external');

    // Создаем taskExternal, если его еще нет
    if (!taskExternal) {
        taskExternal = document.createElement('div');
        taskExternal.classList.add("task-external");
        taskBlock.appendChild(taskExternal);
    }

    // Очищаем taskExternal перед добавлением новых подзадач
    taskExternal.innerHTML = '';

    tasks.forEach(task => {
        const subTaskBlock = document.createElement('div');
        subTaskBlock.classList.add("subtask-view-block");

        const subtaskBranch = document.createElement('div');
        subtaskBranch.classList.add("subtask-branch");

        const taskName = document.createElement('div');
        taskName.classList.add("task-view-name");
        taskName.innerHTML = task['name'];

        subTaskBlock.appendChild(subtaskBranch);
        subTaskBlock.appendChild(taskName);

        const taskFooter = document.createElement('div');
        taskFooter.classList.add("task-view-footer");
        taskFooter.innerHTML = `
            <div class="task-view-info">
                <div class="task-view-btn" title="Развернуть описание задачи">
                    <svg fill="white"><path class="struct-btn-path" d="M 0,0 10,0 5,5 Z"/></svg>
                </div>
                <div class="task-btn-open" title="Развернуть подзадачу">
                    <svg fill="white"><path class="struct-btn-path" d="M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z"/></svg>
                </div>
                <div class="task-view-user-created">Создал: ${task['user_created']}</div>
                <div class="task-view-user-responsible">Ответственный: ${task['user_responsible']}</div>
            </div>
            <div class="task-view-status">Статус: ${task['status']}</div>
            <div class="task-view-importance">Важность: ${task['importance']}</div>
            <div class="task-view-date-begin">Дата начала: ${task['date_begin']}</div>
            <div class="task-view-term">Срок: ${task['term']}</div>
        `;

        subTaskBlock.appendChild(taskFooter);

        const taskFullname = document.createElement('div');
        const taskAdd = document.createElement('div');
        taskFullname.classList.add("task-view-fullname");
        taskAdd.classList.add("struct-task");
        taskAdd.dataset.taskid = task['id']; // создает data-taskid="id задачи"
        taskAdd.dataset.type = type; // создает data-type="type задачи"
        taskFullname.innerHTML = task['descr_task'];
        taskAdd.innerHTML = `<img src="/static/img/task.png" title="Добавить задачу"/>`;

        subTaskBlock.appendChild(taskFullname);
        taskFooter.appendChild(taskAdd);

        taskExternal.appendChild(subTaskBlock);

        // Добавляем event listeners для вновь созданных подзадач
        taskAdd.onclick = clickBtnTask;
        taskFooter.querySelector('.task-btn-open').onclick = clickSubTasks;
    });
  };



//function clickSubTasks(e) {
//    const btnSubTask = e.currentTarget;
//    if (btnSubTask.classList.contains('open')) {
//        btnSubTask.classList.remove('open');
//        removeSubTask(btnSubTask);
//    } else {
//        btnSubTask.classList.add('open');
//        ajaxGetSubTask(btnSubTask);
//    };
//};
//
//function ajaxGetSubTask (btnSubTask) {
//    const tasksHeader = document.getElementById('tasks-header-name');
//    data_id = tasksHeader.getAttribute("data-id");
//
//    const data_type = tasksHeader.getAttribute("data-type");
//    const data_taskid = btnSubTask.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute("data-taskid");
//    $.ajax({
//        url: '/gettasks/',
//        method: 'POST',
//        dataType: 'json',
//        data: {
//                'id': data_id,
//                'type': data_type,
//                'task_id': data_taskid,
//                'csrfmiddlewaretoken': csrfmiddlewaretoken,
//              },
//        success: function(data) {
//            viewSubTasks(data, data_type, data_id, btnSubTask);
//        },
//        error: function(xhr, status, error) {
//            console.error('Ошибка загрузки задач:', error);
//        },
//    });
//};
//function viewSubTasks(tasks, type, id, btnSubTask) {
//    const taskExternal = document.createElement('div');
//    taskExternal.classList.add("task-external");
////    taskExternal.innerHTML = "<div class=\"task-branch\"></div>"
//    const taskBlock = btnSubTask.closest('.task-view-block');
//    const tasksData = document.getElementById('tasks-data');
//    const tasksRel = document.getElementById('tasks-all');
//    for (let i=0; i<tasks.length; i++) {
//            const subTaskBlock = document.createElement('div');
//            subTaskBlock.classList.add("subtask-view-block");
//            subTaskBlock.innerHTML = "<div class=\"subtask-branch\"></div>"
//            const taskName = document.createElement('div');
//            taskName.classList.add("task-view-name");
//            taskName.innerHTML = tasks[i]['name'];
//            subTaskBlock.appendChild(taskName);
//            const taskFooter = document.createElement('div');
//            taskFooter.classList.add("task-view-footer");
//            taskFooter.innerHTML = "<div class=\"task-view-info\">" +
//                      "<div class=\"task-view-btn\" title=\"Развернуть описание задачи\"><svg fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 Z\"/></svg></div>" +
//                      "<div class=\"task-btn-open\" title=\"Развернуть подзадачу\"><svg fill=\"white\"><path class=\"struct-btn-path\" d=\"M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z\"/></svg></div>" +
//                      "<div class=\"task-view-user-created\">" + "Создал: " + tasks[i]['user_created'] + "</div>" +
//                      "<div class=\"task-view-user-responsible\">" + "Ответственный: " + tasks[i]['user_responsible'] + "</div>" +
//                      "</div>" +
////                      "<div class=\"task-view-relevance\">" +
//                      "<div class=\"task-view-status\">" + "Статус: " + tasks[i]['status'] + "</div>" +
//                      "<div class=\"task-view-importance\">" + "Важность: " + tasks[i]['importance'] + "</div>" +
//                      "<div class=\"task-view-date-begin\">" + "Дата начала: " + tasks[i]['date_begin'] + "</div>" +
//                      "<div class=\"task-view-term\">" + "Срок: " + tasks[i]['term'] + "</div>" +
////                      "<label for=\"" + tasks[i]['id'] + "\">Актуальность</label>" +
////                      "<input id=\"" + tasks[i]['id'] + "\" type=\"checkbox\">" +
//                      "</div>";
//            subTaskBlock.appendChild(taskFooter);
//            const taskFullname = document.createElement('div');
//            const taskAdd = document.createElement('div');
//            taskFullname.classList.add("task-view-fullname");
//            taskAdd.classList.add("struct-task");
//            taskAdd.dataset.taskid = tasks[i]['id']; // создает data-taskid="id задачи"
//            taskAdd.dataset.type = type; // создает data-type="type задачи"
//            taskFullname.innerHTML = tasks[i]['descr_task'];
//            taskAdd.innerHTML = "<img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>"
//            subTaskBlock.appendChild(taskFullname);
//            taskFooter.appendChild(taskAdd);
//            taskBlock.appendChild(taskExternal);
//            taskExternal.appendChild(subTaskBlock);
////            const check = document.getElementById(tasks[i]['id']);
////            check.checked = tasks[i]['actual'];
//    const tasksAdd = body_data.querySelectorAll('.struct-task');
//    const tasksOpen = body_data.querySelectorAll('.task-btn-open');
//    for (let taskAdd of tasksAdd) { taskAdd.onclick = clickBtnTask; };
//    for (let taskOpen of tasksOpen) { taskOpen.onclick = clickSubTasks; };
//    btnsClickTask()
//
//
//    };
//    openTask();
//    changeTaskCheck();
//};
function changeTasksCheck() {
    const tasksCheck = document.getElementById('tasks-all');
    if (tasksCheck) {
        tasksCheck.onchange = loadTasks;
    };
};
changeTasksCheck();

function openTask() {
    const btnsOpenTask = document.querySelectorAll('.task-view-btn');
    if (btnsOpenTask) {
        for (let btnOpenTask of btnsOpenTask) { btnOpenTask.onclick = (e) => {
            const btn = e.currentTarget;
            const taskfull = btn.parentElement.parentElement.nextSibling;
            taskfull.classList.toggle('open');
        }};
    };
};
function addStructSubrowTask(btn, data_type, objs) {
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
                              "            <div class=\"struct-task-name\">" + obj[1] + "</div>" +
                              "            <div class=\"struct-task\"><img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>"
                              "        </div>" +
                              "    </div>"
        btn.parentElement.parentElement.appendChild(pointMenu);
    };
    btnsClickTask();
};
function removeStructSubrowTask(btn) {
    const childs = btn.parentElement.parentElement.querySelectorAll('.struct-external');
    for (let child of childs){
        btn.parentElement.parentElement.removeChild(child);
    };
};

function removeSubTask(btn) {
    const childs = btn.parentElement.parentElement.parentElement.querySelectorAll('.task-external');
        for (let child of childs){
            btn.parentElement.parentElement.parentElement.removeChild(child);
        };
    };

function ajaxGetSubrowDataTask(id, btn, data_type, prev='') {
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
                addStructSubrowTask(btn, data_type, data);
                // location.reload(false);
            },
            error: function(data) {
                alert( 'Ошибка в ajaxGetSubrowDataTask');
            },
        });
    };
};
function loadTasks() {
    const headerName = document.getElementById('tasks-header-name');
    const data_type = headerName.getAttribute('data-type');
    const data_id = headerName.getAttribute('data-id');
    const name = document.getElementById('tasks-header-name-txt').innerHTML;
    if (data_type && data_id) {
        $.ajax({
            url: '/gettasks/',
            method: 'POST',
            dataType: 'json',
            data: {
                'id': data_id,
                'type': data_type,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
                },
            success: function(data) {
                viewTasks(data, data_type, data_id, name);
            },
            error: function(xhr, status, error) {
                console.error('Ошибка загрузки задач:', error);
            },
        });
    };
  };