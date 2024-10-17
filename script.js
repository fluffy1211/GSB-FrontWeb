const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");
const searchButton = document.querySelector('.searchbar-button img');


// BURGER MENU
hamburger.addEventListener("click", mobileMenu);
function mobileMenu() {
hamburger.classList.toggle("active");
navMenu.classList.toggle("active");
}

// LINKS MENU
navLink.forEach(n => n.addEventListener("click", closeMenu));
function closeMenu() {
hamburger.classList.remove("active");
navMenu.classList.remove("active");
}

searchButton.addEventListener('mouseover', () => {
    searchButton.src = 'assets/search-button-blue.png';
});

searchButton.addEventListener('mouseout', () => {
    searchButton.src = 'assets/search-button.png';
});