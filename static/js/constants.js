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

const ckeditorConfig = {
        'default': {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload'],
        },
        'extends': {
            blockToolbar: [
                'paragraph', 'heading1', 'heading2', 'heading3',
                '|',
                'bulletedList', 'numberedList',
                '|',
                'blockQuote',
            ],
            toolbar: ['heading', '|', 'outdent', 'indent', '|', 'bold', 'italic', 'link', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'highlight', '|', 'codeBlock', 'sourceEditing', 'insertImage', 'bulletedList', 'numberedList', 'todoList', '|', 'blockQuote', 'imageUpload', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'mediaEmbed', 'removeFormat', 'insertTable'],
            image: {
                toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:side', '|'],
                styles: ['full', 'side', 'alignLeft', 'alignRight', 'alignCenter']
            },
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
                tableProperties: {
                    borderColors: [
                        {color: 'hsl(4, 90%, 58%)', label: 'Red'},
                        {color: 'hsl(340, 82%, 52%)', label: 'Pink'},
                        {color: 'hsl(291, 64%, 42%)', label: 'Purple'},
                        {color: 'hsl(262, 52%, 47%)', label: 'Deep Purple'},
                        {color: 'hsl(231, 48%, 48%)', label: 'Indigo'},
                        {color: 'hsl(207, 90%, 54%)', label: 'Blue'}
                    ],
                    backgroundColors: [
                        {color: 'hsl(4, 90%, 58%)', label: 'Red'},
                        {color: 'hsl(340, 82%, 52%)', label: 'Pink'},
                        {color: 'hsl(291, 64%, 42%)', label: 'Purple'},
                        {color: 'hsl(262, 52%, 47%)', label: 'Deep Purple'},
                        {color: 'hsl(231, 48%, 48%)', label: 'Indigo'},
                        {color: 'hsl(207, 90%, 54%)', label: 'Blue'}
                    ]
                },
                tableCellProperties: {
                    borderColors: [
                        {color: 'hsl(4, 90%, 58%)', label: 'Red'},
                        {color: 'hsl(340, 82%, 52%)', label: 'Pink'},
                        {color: 'hsl(291, 64%, 42%)', label: 'Purple'},
                        {color: 'hsl(262, 52%, 47%)', label: 'Deep Purple'},
                        {color: 'hsl(231, 48%, 48%)', label: 'Indigo'},
                        {color: 'hsl(207, 90%, 54%)', label: 'Blue'}
                    ],
                    backgroundColors: [
                        {color: 'hsl(4, 90%, 58%)', label: 'Red'},
                        {color: 'hsl(340, 82%, 52%)', label: 'Pink'},
                        {color: 'hsl(291, 64%, 42%)', label: 'Purple'},
                        {color: 'hsl(262, 52%, 47%)', label: 'Deep Purple'},
                        {color: 'hsl(231, 48%, 48%)', label: 'Indigo'},
                        {color: 'hsl(207, 90%, 54%)', label: 'Blue'}
                    ]
                }
            },
            heading: {
                options: [
                    {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                    {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                    {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                    {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'}
                ]
            }
        },
        'list': {
            properties: {
                styles: 'true',
                startIndex: 'true',
                reversed: 'true'
            }
        }
    };