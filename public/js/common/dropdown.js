
let dropdown1 = document.getElementById('dropdown_1');
let dropdown2 = document.getElementById('dropdown_2');
let dropdown3 = document.getElementById('dropdown_3');

const button1 = document.getElementById('button_1');
const button2 = document.getElementById('button_2');
const button3 = document.getElementById('button_3');

button1.addEventListener('click', () => {
    dropdown1.classList.toggle('dashboard__dropdown-open');
    dropdown2.classList.remove('dashboard__dropdown-open');
    dropdown3.classList.remove('dashboard__dropdown-open');
});
button2.addEventListener('click', () => {
    dropdown2.classList.toggle('dashboard__dropdown-open');
    dropdown1.classList.remove('dashboard__dropdown-open');
    dropdown3.classList.remove('dashboard__dropdown-open');
});
button3.addEventListener('click', () => {
    dropdown3.classList.toggle('dashboard__dropdown-open');
    dropdown1.classList.remove('dashboard__dropdown-open');
    dropdown2.classList.remove('dashboard__dropdown-open');
});