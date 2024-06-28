const popup = document.querySelector('.popup-background');

const signin = document.getElementById('signin');
if (signin && popup) {
    signin.addEventListener('click', function(event) {
        popup.classList.toggle('open');
    });
};

const signout = document.getElementById('signout');
if (signout) {
    signout.addEventListener('click', function(event) {
        $.ajax({
            url: "/signout/",
//            url: "{% url 'signout' %}",
            method: 'get',
            dataType: 'json',
            data: { },
            success: function(data) {
                location.reload(false);
            },
            error: function(data) {
                alert( 'Ошибка!');
            },
        });
    });
};

const closepopup = document.querySelector('.signin-header>span');
if (closepopup && popup) {
    closepopup.onclick = function(e) {
        popup.classList.remove("open");
    };
};

const form = document.querySelector('.signin-form');
if (form && popup) {
    form.onsubmit = function() {
        event.preventDefault();
        const formData = new FormData(form);
        const login = formData.get('login');
        const password = formData.get('password');
        const csrf = formData.get('csrfmiddlewaretoken');

        $.ajax({
            url: "/signin/",
//            url: "{% url 'signin' %}",
            method: 'post',
            dataType: 'json',
            data: {
                'login': formData.get('login'),
                'password': formData.get('password'),
                'csrfmiddlewaretoken': formData.get('csrfmiddlewaretoken'),
            },
            success: function(data) {
                popup.classList.remove("open");
                location.reload(false);
            },
            error: function(data) {
                alert( 'Ошибка авторизации! Попробуйте еще раз.');
            },
        });

        return result;
    };
};