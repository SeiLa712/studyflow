const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const btn = document.querySelector(".collapse-btn");
const sidebar = document.querySelector(".sidebar");

btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});