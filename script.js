const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");
const searchButton = document.querySelector('.searchbar-button img');
const main = document.querySelector('main');


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

// fetch('http://localhost:3000/api/produits')
// .then(response => response.json())
// .then(produits => {
//     produits.forEach(produit => {
//         const produitElement = document.createElement('div');
//         produitElement.classList.add('produit');
//         produitElement.innerHTML = `
//             <h2>${produit.nom}</h2>
//             <img src="${produit.image}" alt="${produit.nom}">
//             <p>${produit.description}</p>
//             <p>Prix: ${produit.prix}€</p>
//         `;
//         main.appendChild(produitElement);
//     });
// })
// .catch(error => console.error('Erreur:', error));