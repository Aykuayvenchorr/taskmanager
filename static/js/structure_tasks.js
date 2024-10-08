createFilters()

function btnsClickTask() {
    const btns1 = leftaside.querySelectorAll('.struct-btn-1');
    const btns2 = leftaside.querySelectorAll('.struct-btn-2');
    const btnsTask = leftaside.querySelectorAll('.struct-task');
    const tasksName = leftaside.querySelectorAll('.struct-task-name');



    if (btns1 && btns2 && btnsTask && (tasksName.length > 0)) {
    // for (let btn1 of btns1) { btn1.addEventListener("click", clickBtn1); };
        for (let btn1 of btns1) { btn1.onclick = clickBtnTask1; };
        for (let btn2 of btns2) { btn2.onclick = clickBtnTask2; };
        for (let btnTask of btnsTask) { btnTask.onclick = clickBtnTask; };
        for (let taskName of tasksName) { taskName.onclick = clickStructNameTask; };
    };
};
btnsClickTask();

function openPopupTask(e) {
    const task_view_name = e.currentTarget;
    const taskId = task_view_name.parentElement.getAttribute('data-taskid');

    $.ajax({
        url: `/gettask/${taskId}/`,
        method: 'GET',
        dataType: 'json',
        data: taskId,
        success: function(task) {
                const taskName = task.name;
                const taskDescr = task.descr_task;
                const taskBegin = task.date_begin;
                const taskTerm = task.term;
                const taskImportance = task.importance;
                const taskDateDev = task.date_develop;
                const taskDateFund = task.date_funding;
                const taskCost = task.cost;
                const taskStatus = task.status;
                const taskRespon = task.user_responsible;
                const userId = task.user_responsible_id
                UpdateTask(taskName, taskDescr, taskBegin, taskTerm, taskImportance, taskDateDev, taskDateFund, taskCost, taskStatus, taskRespon, taskId, userId)
                },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка получения списка пользователей:', textStatus, errorThrown);
        }
    });
};


function UpdateTask(taskName, taskDescr, taskBegin, taskTerm, taskImportance, taskDateDev, taskDateFund, taskCost, taskStatus, taskRespon, taskId, userId) {
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_task';



    popup.innerHTML = "<div class=\"task-add-popup\">" +
                      "  <div class=\"signin-header\"><span>&#10006</span></div>" +
                      "    <form class=\"task-form\" id=\"task-form\" action=\"#\">" +
                      "      <textarea class=\"task-name\" name=\"name\">" + taskName + "</textarea>" +
                      "      <textarea name=\"descr_task\" id=\"editor\" class=\"django_ckeditor_5\">" + taskDescr + "</textarea>" +
                      "      <label for=\"date\">Дата начала: </label>" +
                      "      <input type=\"date\" id=\"date\" name=\"date\" value=\"" + taskBegin + "\" />" +
                      "      <label for=\"term\">Срок задачи в днях: </label>" +
                      "      <textarea id=\"term\" style=\"min-height: 7px;\" name=\"term\">" + taskTerm + "</textarea>" +
                      "      <label for=\"select_importance\">Важность задачи: </label>" +
                      "      <select id=\"select_importance\" name=\"importance\"><option>" + taskImportance + "</option><option>Высокая степень важности</option><option>Средняя степень важности</option><option>Низкая степень важности</option></select>" +
                      "      <label for=\"date_dev\">Дата освоения: </label>" +
                      "      <input type=\"date\" id=\"date\" name=\"date_dev\" value=\"" + taskDateDev + "\" />" +
                      "      <label for=\"date_fund\">Дата финансирования: </label>" +
                      "      <input type=\"date\" id=\"date_fund\" name=\"date_fund\"value=\"" + taskDateFund + "\" />" +
                      "      <label for=\"cost\">Стоимость, руб: </label>" +
                      "      <textarea id=\"cost\" style=\"min-height: 7px;\" name=\"cost\">" + taskCost + "</textarea>" +
                      "      <label for=\"select_status\">Статус задачи: </label>" +
                      "      <select id=\"select_status\" name=\"status\"><option>" + taskStatus + "</option><option>В работе</option><option>Отложена</option><option>Завершена</option></select>" +
                      "      <label for=\"select_user\">Ответственный: </label>" +
                      "      <select id=\"select_user\" name=\"select_user\"><option value=\"" + userId + "\"" + ">" + taskRespon + "</option></select>" +
                      "      <label for=\"file-upload\" class=\"file-upload-label\">Загрузить файл</label>" +
                      "      <input type=\"file\" id=\"file-upload\" name=\"file\" class=\"file-upload-input\" multiple/>" +
                      "      <div id=\"file-list\"></div>" +
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

    const config = {};
    // Инициализация CKEditor на textarea
    ClassicEditor
        .create(document.querySelector('#editor'), {
            toolbar: ckeditorConfig.extends.toolbar,
            heading: ckeditorConfig.extends.heading,
            image: ckeditorConfig.extends.image,
            table: ckeditorConfig.extends.table
        })
        .then(editor => {
            // Store the editor instance for later use
            document.querySelector('#editor').editor = editor;
        })
        .catch(error => {
            console.error(error);
        });


    let deletedFiles = []; // Массив для хранения ID удаленных файлов

    // Запрос на получение списка документов
    $.ajax({
        url: `/gettask_docs/${taskId}/`,
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


    const btnClose = popup.querySelector('.signin-header>span');
    btnClose.onclick = () => {
        const addtaskpopup = document.getElementById('add_task');
        addtaskpopup.parentElement.removeChild(addtaskpopup);
    };


    // Обработка отправки формы
    const formElement = document.getElementById('task-form');
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskDesr = document.querySelector('textarea[name="descr_task"]');
        const taskDesrHtml = taskDesr.editor.getData();
        console.log(taskDesrHtml)

        // Обновляем значение textarea с текстом
        taskDesr.value = taskDesrHtml;

        const formData = new FormData(formElement);

        // Добавляем массив с ID удаленных файлов в данные формы
        formData.append('deleted_files', JSON.stringify(deletedFiles));

        // Отправляем данные на сервер
        $.ajax({
                url:  `/updatetask/${taskId}/`,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRFToken': csrfmiddlewaretoken
                },
                success: function(response) {
                    if (response.error) {
                        alert(response.error);
                        // Прерываем выполнение кода, чтобы не обновлять интерфейс
                        return;
                    }
                    if (response.level > 1) {
                        console.log('for subtask')
                        const taskElement = document.querySelector(`[data-taskid="${taskId}"]`);

                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[1].innerText = response.name;
                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[3].innerHTML = response.descr_task;

                        const status = taskElement.querySelector('.task-view-status');
                        const importance = taskElement.querySelector('.task-view-importance');
                        const date_beg = taskElement.querySelector('.task-view-date-begin');
                        const term = taskElement.querySelector('.task-view-term');
                        const select_user = taskElement.querySelector('.task-view-user-responsible');

                        status.innerHTML = response.status;
                        importance.innerHTML = response.importance;
                        date_beg.innerHTML = response.date;
                        term.innerHTML = response.term;
                        select_user.innerHTML = response.select_user;
                        console.log('Подзадача успешно обновлена');
                    } else {

                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[0].innerText = response.name;
                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[2].innerHTML = response.descr_task;

                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[1].childNodes[1].innerHTML = response.status;
                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[1].childNodes[2].innerHTML = response.importance;
                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[1].childNodes[3].innerHTML = response.date;
                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[1].childNodes[4].innerHTML = response.term;
                        document.querySelector(`[data-taskid="${taskId}"]`).childNodes[1].childNodes[0].childNodes[3].innerHTML = response.select_user;
                        console.log('Задача успешно обновлена');
                    };

                    const addtaskpopup = document.getElementById('add_task');
                    addtaskpopup.parentElement.removeChild(addtaskpopup);
                },
                error: function(data) {
                    console.log(data)
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
//   const btnClose = popup.querySelector('.signin-header>span');
   btnClose.onclick = () => {
        const addtaskpopup = document.getElementById('add_task');
        addtaskpopup.parentElement.removeChild(addtaskpopup);
    };

};


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

function clickBtnTask(e) {
    const btnTask = e.currentTarget;
    const structData = btnTask.parentElement;
    data_type = structData.getAttribute('data-type');
    data_id = structData.getAttribute('data-id');
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
    }

    let level = 1

    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_task';
    popup.innerHTML = "<div class=\"task-add-popup\">" +
                      "  <div class=\"signin-header\"><span>&#10006</span></div>" +
                      "    <form class=\"task-form\" id=\"task-form\" action=\"#\">" +
                      "      <textarea class=\"task-name\" name=\"name\" placeholder=\"Краткое описание\" required></textarea>" +
                      "      <textarea name=\"descr_task\" placeholder=\"Задача\" id=\"editor\" class=\"django_ckeditor_5\"></textarea>" +
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
                      "      <label for=\"file-upload\" class=\"file-upload-label\">Загрузить файл</label>" +
                      "      <input type=\"file\" id=\"file-upload\" name=\"file\" class=\"file-upload-input\" multiple/>" +
                      "      <div id=\"file-list\"></div>" +
                      "      <button type=\"submit\">Отправить</button>" +
                      "    </form>" +
                      "</div>";
    body.prepend(popup);

 // Инициализация CKEditor на textarea
    ClassicEditor
        .create(document.querySelector('#editor'), {
            toolbar: ckeditorConfig.extends.toolbar,
            heading: ckeditorConfig.extends.heading,
            image: ckeditorConfig.extends.image,
            table: ckeditorConfig.extends.table
        })
        .then(editor => {
            // Store the editor instance for later use
            document.querySelector('#editor').editor = editor;
        })
        .catch(error => {
            console.error(error);
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
//        const descr_task = formData.get('descr_task');

        const fullNameTextarea = document.querySelector('textarea[name="descr_task"]');
        const descr_task = fullNameTextarea.editor.getData();
        console.log(descr_task)

        // Обновляем значение textarea с текстом
        fullNameTextarea.value = descr_task

        const date_begin = formData.get('date');
        const term = formData.get('term');
        const importance = formData.get('importance');
        const status = formData.get('status');

        const select_user = formData.get('select_user');

        var data = {
                    'id': data_id,
//                    'task_id': data_taskid,
                    'type': data_type,
                    'csrfmiddlewaretoken': csrfmiddlewaretoken,
                    'name': name,
                    'descr_task': descr_task,
                    'date_begin': date_begin,
                    'term': term,
                    'importance': importance,
                    'status': status,
                    'select_user': select_user,
                    'level': level,
                    'structures': JSON.stringify(listParents)
            };

         // Проверка значений перед добавлением
        const date_develop = formData.get('date_dev');
        if (date_develop) data['date_develop'] = date_develop;

        const date_funding = formData.get('date_fund');
        if (date_funding) data['date_funding'] = date_funding;

        const cost = formData.get('cost');
        if (cost) data['cost'] = cost;

        formData.append('id', data_id);
        formData.append('type', data_type);
        formData.append('name', name);
        formData.append('descr_task', descr_task);
        formData.append('date_begin', date_begin);
        formData.append('term', term);
        formData.append('importance', importance);
        formData.append('date_develop', date_develop);
        formData.append('date_funding', date_funding);
        formData.append('status', status);
        formData.append('select_user', select_user);
        formData.append('level', level);
        formData.append('structures', JSON.stringify(listParents));


        $.ajax({
            url: '/addtask/',
            method: 'POST',
            data: formData, // Отправляем объект FormData, содержащий файлы
                processData: false, // Не обрабатываем данные, т.к. это FormData
                contentType: false, // Устанавливаем contentType в false, чтобы браузер автоматически установил boundary
                headers: {
                    'X-CSRFToken': csrfmiddlewaretoken // Передаем CSRF-токен в заголовках
                },
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


function clickBtnSubTask(e) {
    const btnTask = e.currentTarget;
    const tasksHeader = document.getElementById('tasks-header-name');

    let data_type = tasksHeader.getAttribute("data-type");
    let data_id = tasksHeader.getAttribute("data-id");
    let data_taskid = btnTask.getAttribute("data-taskid")

    const currentLevel = parseInt(btnTask.parentElement.parentElement.getAttribute('data-level'));
    const nextLevel = currentLevel+1;

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
    }




    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add("popup-background");
    popup.classList.add("open");
    popup.id = 'add_task';
    popup.innerHTML = "<div class=\"task-add-popup\">" +
                      "  <div class=\"signin-header\"><span>&#10006</span></div>" +
                      "    <form class=\"task-form\" id=\"task-form\" action=\"#\">" +
                      "      <textarea class=\"task-name\" name=\"name\" placeholder=\"Краткое описание\" required></textarea>" +
                      "      <textarea name=\"descr_task\" placeholder=\"Задача\" id=\"editor\" class=\"django_ckeditor_5\"></textarea>" +
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
                      "      <label for=\"file-upload\" class=\"file-upload-label\">Загрузить файл</label>" +
                      "      <input type=\"file\" id=\"file-upload\" name=\"file\" class=\"file-upload-input\" multiple/>" +
                      "      <div id=\"file-list\"></div>" +
                      "      <button type=\"submit\">Отправить</button>" +
                      "    </form>" +
                      "</div>";
    body.prepend(popup);

     // Инициализация CKEditor на textarea
    ClassicEditor
        .create(document.querySelector('#editor'), {
            toolbar: ckeditorConfig.extends.toolbar,
            heading: ckeditorConfig.extends.heading,
            image: ckeditorConfig.extends.image,
            table: ckeditorConfig.extends.table
        })
        .then(editor => {
            // Store the editor instance for later use
            document.querySelector('#editor').editor = editor;
        })
        .catch(error => {
            console.error(error);
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
                    'select_user': select_user,
                    'level': nextLevel
//                    'structures': JSON.stringify(structureData)
            };

         // Проверка значений перед добавлением
        const date_develop = formData.get('date_dev');
        if (date_develop) data['date_develop'] = date_develop;

        const date_funding = formData.get('date_fund');
        if (date_funding) data['date_funding'] = date_funding;

        const cost = formData.get('cost');
        if (cost) data['cost'] = cost;


        formData.append('id', data_id);
        formData.append('task_id', data_taskid);
        formData.append('type', data_type);
        formData.append('name', name);
        formData.append('descr_task', descr_task);
        formData.append('date_begin', date_begin);
        formData.append('term', term);
        formData.append('importance', importance);
        formData.append('date_develop', date_develop);
        formData.append('date_funding', date_funding);
        formData.append('status', status);
        formData.append('select_user', select_user);
        formData.append('level', nextLevel);
        formData.append('structures', JSON.stringify(listParents));

        $.ajax({
            url: '/addsubtask/',
            method: 'POST',
            data: formData, // Отправляем объект FormData, содержащий файлы
                processData: false, // Не обрабатываем данные, т.к. это FormData
                contentType: false, // Устанавливаем contentType в false, чтобы браузер автоматически установил boundary
                headers: {
                    'X-CSRFToken': csrfmiddlewaretoken // Передаем CSRF-токен в заголовках
                },
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
//    data_taskid = ''
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
            taskAdd.classList.add("add-subtask");
            taskAdd.dataset.taskid = tasks[i]['id']; // создает data-taskid="id задачи"
            taskBlock.dataset.taskid = tasks[i]['id']; // создает data-taskid="id задачи"
            taskAdd.dataset.type = type; // создает data-type="type задачи"
            taskFullname.innerHTML = tasks[i]['descr_task'];
            taskAdd.innerHTML = "<img src=\"/static/img/task.png\" title=\"Добавить задачу\"/></div>"
            taskBlock.appendChild(taskFullname);
            taskBlock.setAttribute('data-level', tasks[i]['level']);
            taskFooter.appendChild(taskAdd);
            taskExternal.appendChild(taskBlock);
            tasksData.appendChild(taskExternal);

    const subTasks = tasks_data.querySelectorAll('.add-subtask');
    const tasksOpen = tasks_data.querySelectorAll('.task-btn-open');


    for (let subTask of subTasks) { subTask.onclick = clickBtnSubTask; };
    for (let taskOpen of tasksOpen) { taskOpen.onclick = clickSubTasks; };




    };
    openTask();
    const tasksViewName = tasks_data.querySelectorAll('.task-view-name');
    for (let taskView of tasksViewName) { taskView.onclick = openPopupTask; };


//    changeTaskCheck();
};

function clickSubTasks(e) {
    const btnSubTask = e.currentTarget;
    const currentLevel = parseInt(btnSubTask.parentElement.parentElement.parentElement.getAttribute('data-level'));

    if (btnSubTask.classList.contains('open')) {
        btnSubTask.classList.remove('open');
        removeSubTask(btnSubTask);
    } else {
        btnSubTask.classList.add('open');
        ajaxGetSubTask(btnSubTask, currentLevel + 1);
    }
}

function ajaxGetSubTask(btnSubTask, nextLevel) {
    const tasksHeader = document.getElementById('tasks-header-name');
    const data_id = tasksHeader.getAttribute("data-id");
    const data_type = tasksHeader.getAttribute("data-type");
//    const data_taskid = btnSubTask.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute("data-taskid");
    const data_taskid = btnSubTask.parentElement.parentElement.parentElement.getAttribute("data-taskid");
//    const data_taskid = btnSubTask.querySelector('.task-view-footer .add-subtask').getAttribute('data-taskid');

//    console.log("data_taskid:", data_taskid);
//    const last_task = btnTask.parentElement.getAttribute("data-id");
//    console.log("last_task:", data_id);

    $.ajax({
        url: '/getsubtasks/',
        method: 'POST',
        dataType: 'json',
        data: {
            'id': data_id,
            'type': data_type,
            'task_id': data_taskid,
            'level': nextLevel,
            'csrfmiddlewaretoken': csrfmiddlewaretoken,
        },
        success: function(data) {
            viewSubTasks(data, data_type, data_id, btnSubTask, nextLevel);
        },
        error: function(xhr, status, error) {
            console.error('Ошибка загрузки задач:', error);
        },
    });
}

function viewSubTasks(tasks, type, id, btnSubTask, level) {
    if (level === 2) {
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
        subTaskBlock.dataset.taskid = task['id']; // создает data-taskid="id задачи"

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
        subTaskBlock.setAttribute('data-level', level);

        const taskFullname = document.createElement('div');
        const taskAdd = document.createElement('div');
        taskFullname.classList.add("task-view-fullname");
        taskAdd.classList.add("add-subtask");
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
  const subTasks = tasks_data.querySelectorAll('.add-subtask');
  const tasksOpen = tasks_data.querySelectorAll('.task-btn-open');

  const tasksViewName = tasks_data.querySelectorAll('.task-view-name');
  for (let taskView of tasksViewName) { taskView.onclick = openPopupTask; };


  for (let subTask of subTasks) { subTask.onclick = clickBtnSubTask; };
  for (let taskOpen of tasksOpen) { taskOpen.onclick = clickSubTasks; };

  }
  else {
    const subTaskBlock = btnSubTask.closest('.subtask-view-block');
    let taskExternal = subTaskBlock.querySelector('.task-external');

    // Создаем taskExternal, если его еще нет
    if (!taskExternal) {
        taskExternal = document.createElement('div');
        taskExternal.classList.add("task-external");
        subTaskBlock.appendChild(taskExternal);
    }

    // Очищаем taskExternal перед добавлением новых подзадач
    taskExternal.innerHTML = '';

    tasks.forEach(task => {
        const subTaskBlock = document.createElement('div');
        subTaskBlock.classList.add("subtask-view-block");
        subTaskBlock.dataset.taskid = task['id']; // создает data-taskid="id задачи"

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
        subTaskBlock.setAttribute('data-level', level);

        const taskFullname = document.createElement('div');
        const taskAdd = document.createElement('div');
        taskFullname.classList.add("task-view-fullname");
        taskAdd.classList.add("add-subtask");
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
  const subTasks = tasks_data.querySelectorAll('.add-subtask');
  const tasksOpen = tasks_data.querySelectorAll('.task-btn-open');

  const tasksViewName = tasks_data.querySelectorAll('.task-view-name');
  for (let taskView of tasksViewName) { taskView.onclick = openPopupTask; };



  for (let subTask of subTasks) { subTask.onclick = clickBtnSubTask; };
  for (let taskOpen of tasksOpen) { taskOpen.onclick = clickSubTasks; };

  };
  openTask();
  };







//function changeTasksCheck() {
//    const tasksCheck = document.getElementById('tasks-all');
//    if (tasksCheck) {
//        tasksCheck.onchange = loadTasks;
//    };
//};
//changeTasksCheck();

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

//    const subtasks = taskBlock.querySelectorAll(`.subtask-view-block[data-level="${currentLevel + 1}"]`);
//    subtasks.forEach(subtask => subtask.remove());

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



function createFilters() {
   const responsible_filter = document.getElementById('responsible-filter')
   const status_filter = document.getElementById('status-filter')

    // Запрос на получение списка пользователей
    $.ajax({
        url: '/get_users/',
        method: 'GET',
        dataType: 'json',
        success: function(users) {
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.name + ' ' + user.surname;
                responsible_filter.appendChild(option);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Ошибка получения списка пользователей:', textStatus, errorThrown);
        }
    });
    const option = document.createElement('option');
    option.value = 0;
    option.text = 'Все';
    responsible_filter.appendChild(option);
    console.log(responsible_filter)
};

function applyFilter() {
    const selectedUser = document.getElementById('responsible-filter').value;
    const status = document.getElementById('status-filter').value;
    console.log(selectedUser)
    console.log(status)
    tasks = document.querySelectorAll('.task-view-block')
//    let tasks_id = [];
//    for (let task of tasks) { tasks_id.push(task.getAttribute('data-taskid')); };
//    console.log(tasks_id);

    const headerName = document.getElementById('tasks-header-name');
    const data_type = headerName.getAttribute('data-type');
    const data_id = headerName.getAttribute('data-id');
    const name = document.getElementById('tasks-header-name-txt').innerHTML;
    if (data_type && data_id) {
        $.ajax({
            url: '/getfiltertasks/',
            method: 'POST',
            dataType: 'json',
            data: {
                'id': data_id,
                'type': data_type,
//                'tasks_id': tasks_id,
                'responsible_user': selectedUser,
                'status': status,
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




//   responsible_filter.addEventListener('change', (e) => {
//        const newFiles = Array.from(fileInput.files); // Массив новых файлов
//        selectedFiles = selectedFiles.concat(newFiles); // Добавляем новые файлы к уже существующим
//        updateFileList(); // Обновляем отображение списка файлов
//    });




// ФИЛЬТРЫ

//document.addEventListener('DOMContentLoaded', () => {
//// Получаем элемент фильтра и задаем обработчик событий
//   const filterSelect = document.getElementById('responsible-filter');
//   filterSelect.addEventListener('change', applyFilter);
//   // Здесь можно сделать AJAX-запрос для динамической загрузки списка пользователей
//   loadUsers();
//});

//function applyFilter() {
//    const selectedUser = document.getElementById('responsible-filter').value;
//    const taskBlocks = document.querySelectorAll('.task-view-block, .subtask-view-block');
//
//    taskBlocks.forEach(taskBlock => {
//        const responsible = taskBlock.querySelector('.task-view-user-responsible')?.textContent.trim().split(": ")[1];
//        const taskId = taskBlock.getAttribute('data-taskid');
//
//        function hasMatchingSubTask(taskElement) {
//            const subTasks = taskElement.querySelectorAll('.subtask-view-block');
//            for (const subTask of subTasks) {
//                const subResponsible = subTask.querySelector('.task-view-user-responsible')?.textContent.trim().split(": ")[1];
//                if (selectedUser === 'all' || subResponsible === selectedUser) {
//                    return true;
//                }
//                if (hasMatchingSubTask(subTask)) {
//                    return true;
//                }
//            }
//            return false;
//        }
//
//        async function loadAndCheckSubTasks() {
//            // Если есть открывающая кнопка для подзадач, кликаем на нее
//            const openBtn = taskBlock.querySelector('.task-btn-open');
//            if (openBtn && openBtn.dataset.loaded !== 'true') {
//                await new Promise(resolve => {
//                    openBtn.click();
//                    setTimeout(resolve, 1000); // Подождать, пока подгрузятся подзадачи
//                });
//            }
//            return hasMatchingSubTask(taskBlock);
//        }
//
//        if (selectedUser === 'all' || responsible === selectedUser) {
//            taskBlock.style.display = '';
//        } else {
//            taskBlock.style.display = 'none';
//
//            // Проверяем подзадачи и открываем их при необходимости
//            loadAndCheckSubTasks().then(shouldDisplay => {
//                if (shouldDisplay) {
//                    taskBlock.style.display = '';
//                }
//            });
//        }
//    });
//}
//
//
//async function applyFilter() {
//    const selectedUser = document.getElementById('responsible-filter').value;
//    if (selectedUser === 'all') {
//            // Если выбран "all", показываем все задачи
//            taskBlock.style.display = ''};
//    const tasksContainer = document.getElementById('tasks-data');
//
//    // Очистка контейнера задач перед загрузкой новых данных
//    tasksContainer.innerHTML = '';
//
//    // Запрос на сервер для получения задач
//    const response = await fetch(`/filter_tasks/?responsible_user_id=${selectedUser}`);
//    const tasks = await response.json();
//
//    // Отображение задач
//    tasks.forEach(task => {
//        // Создание элемента задачи
//        const taskBlock = document.createElement('div');
//        taskBlock.classList.add(task.level === 1 ? 'task-view-block' : 'subtask-view-block');
//
//        taskBlock.innerHTML = `
//            <div class="task-view-name">${task.name}</div>
//            <div class="task-view-footer">
//                <div class="task-view-info">
//                    <div class="task-view-btn" title="Развернуть описание задачи">
//                        <svg fill="white"><path class="struct-btn-path" d="M 0,0 10,0 5,5 Z"/></svg>
//                    </div>
//                    <div class="task-btn-open" title="Развернуть подзадачу">
//                        <svg fill="white"><path class="struct-btn-path" d="M 0,0 10,0 5,5 10,5 5,10 0,5 5,5 Z"/></svg>
//                    </div>
//                    <div class="task-view-user-created">Создал: ${task.user_created}</div>
//                    <div class="task-view-user-responsible">Ответственный: ${task.user_responsible}</div>
//                </div>
//                <div class="task-view-status">Статус: ${task.status}</div>
//                <div class="task-view-importance">Важность: ${task.importance}</div>
//                <div class="task-view-date-begin">Дата начала: ${task.date_begin}</div>
//                <div class="task-view-term">Срок: ${task.term}</div>
//            </div>
//            <div class="task-view-fullname">${task.descr_task}</div>
//        `;
//
//        tasksContainer.appendChild(taskBlock);
//    });
//}

//function applyFilter() {
//    const selectedUser = document.getElementById('responsible-filter').value;
//    const taskBlocks = document.querySelectorAll('.task-view-block, .subtask-view-block');
//
//    taskBlocks.forEach(taskBlock => {
//        // Получаем данные о пользователе, ответственном за задачу
//        const responsible = taskBlock.querySelector('.task-view-user-responsible')?.textContent.trim().split(": ")[1];
//
//        if (selectedUser === 'all') {
//            // Если выбран "all", показываем все задачи
//            taskBlock.style.display = '';
//        } else {
//            // Проверяем, соответствует ли ответственный выбранному фильтру
//            if (responsible === selectedUser) {
//                taskBlock.style.display = '';
//            } else {
//                taskBlock.style.display = 'none';
//            }
//        }
//    });
//}




//
//function loadUsers() {
//        // Пример AJAX-запроса для получения списка пользователей
//        fetch('/get_users/')
//            .then(response => response.json())
//            .then(users => {
//                const filterSelect = document.getElementById('responsible-filter');
//                // Очистка текущих опций (если требуется)
//                filterSelect.innerHTML = '';
//
//                // Добавление опции "all" для сброса фильтра
//                const allOption = document.createElement('option');
//                allOption.value = 'all';
//                allOption.textContent = 'Все пользователи';
//                filterSelect.appendChild(allOption);
//
//                // Добавление пользователей в выпадающий список
//                users.forEach(user => {
//                    const option = document.createElement('option');
////                    option.value = user.username; // Значение может зависеть от структуры ваших данных
//                    option.value = `${user.id}`; // Значение может зависеть от структуры ваших данных
//                    option.textContent = `${user.surname} ${user.name}`; // Отображаемое имя пользователя
//                    filterSelect.appendChild(option);
//                });
//            })
//            .catch(error => console.error('Ошибка загрузки списка пользователей:', error));
//    };
//