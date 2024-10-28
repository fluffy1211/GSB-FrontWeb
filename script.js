const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");
const searchButton = document.querySelector('.searchbar-button img');
const main = document.querySelector('main');
const card = document.querySelector('.card');


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

// EXEMPLE SI ON VEUT AFFICHER LES PRODUITS DANS LA PAGE

fetch('http://localhost:3000/products')
.then(response => response.json())
.then(data => {
    console.log(data);
    data.forEach(products => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
        <h1>${products.name}</h1>
        <h2>${products.price}€</h2>
        <h2>${products.description}</h2>
        `;
        card.appendChild(productDiv);
    });
})