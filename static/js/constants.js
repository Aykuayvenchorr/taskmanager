const leftaside = document.querySelector('.body-left');
const leftaside_mainblock = document.querySelector('.body-left-main-block');
const csrfmiddlewaretoken = document.querySelector('nav input[name="csrfmiddlewaretoken"]').value
const header = document.querySelector('header');
const body_data = document.querySelector('.body-data')
const tasks_data = document.getElementById('tasks-data')
const comments_data = document.getElementById('comments-data')

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