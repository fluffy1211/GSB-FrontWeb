const cartBtns = document.querySelectorAll('.cart-btn');
const popup = document.getElementById('popup');

// Afficher les produits dans les cards
const cardsContainer = document.getElementById('card-container');

let productsData = [];

async function getProducts() {
    try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        productsData = products;
        renderProducts(productsData);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProducts(products) {
    const cardsContainer = document.getElementById('card-container');
    cardsContainer.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${product.imagePath}" alt="${product.name}" class="card-img">
            <div class="card-content">
                <h2 class="card-title">${product.name}</h2>
                <p class="card-description">${product.description}</p>
                <p class="card-price">${product.price}€</p>
            </div>
            <select class="quantity-select">
                <option value="" disabled selected>Quantité</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button class="cart-btn" data-product-id="${product.id_product}">Ajouter au panier</button>
        `;
        cardsContainer.appendChild(card);

const cartBtn = card.querySelector('.cart-btn');
cartBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const productId = e.target.dataset.productId;
    const quantitySelect = card.querySelector('.quantity-select');
    const quantity = parseInt(quantitySelect.value);

    if (!productId) {
        console.error('Product ID is missing!');
        return;
    }
    if (!quantity) {
        alert('Sélectionnez une quantité');
        return;
    }
    try {
        const jwtToken = getCookie('jwt');
        if (!jwtToken) {
            window.location.href = 'login.html';
            return;
        }
        const response = await fetch('http://localhost:3001/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ id_product: productId, quantity: quantity })
        });
        if (response.ok) {
            const popup = document.getElementById('popup');
            popup.innerHTML = '<div class="popup-content"><h2>Produit ajouté au panier !</h2></div>';
            popup.classList.add('popup-active');

            // Enlever le popup après 2 secondes
            setTimeout(() => {
                popup.classList.remove('popup-active');
                popup.innerHTML = '';
            }, 2000);
        } else {
            console.error('Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
});
}

document.querySelectorAll('.filter-buttons').forEach(button => {
    button.addEventListener('click', () => {
        const filterType = button.value;
        if (filterType === "A-Z") {
            const sortedProducts = [...productsData].sort((a, b) => a.name.localeCompare(b.name));
            renderProducts(sortedProducts);
        } else if (filterType === "Prix") {
            const sortedProducts = [...productsData].sort((a, b) => a.price - b.price);
            renderProducts(sortedProducts);
        }
    });
});

// Initialiser les produits
getProducts();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
