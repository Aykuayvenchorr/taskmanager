const span_toright = document.querySelector('.body-left-header div');
const body_left = document.querySelector('.body-left');

if (span_toright && body_left) {
    span_toright.addEventListener('click', function(event) {
        body_left.classList.toggle('open');
        span_toright.classList.toggle('open')
    });
};


