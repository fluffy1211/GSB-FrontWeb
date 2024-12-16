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

// Ajout au panier
cartBtns.forEach(cartBtn => {
    cartBtn.addEventListener('click', async e => {
        e.preventDefault();
        const productId = e.target.closest('.cart-btn').dataset.productId; // Ensure target is the button
        console.log('Product ID:', productId);
        if (!productId) {
            console.error('Product ID is missing!');
            return;
        }
        const quantity = 1; // You can adjust the quantity as needed
        console.log("Quantité:", quantity)
        try {
            const jwtToken = getCookie('jwt');
            console.log('Token:', jwtToken);
            const response = await fetch('http://localhost:3001/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ id_product: productId, quantity: quantity })
            });
            if (response.ok) {
                const html = `
                    <div class="popup-content">
                        <h2>Produit ajouté au panier !</h2>
                    </div>
                `;
                popup.classList.add('popup-active');
                popup.innerHTML = html;
            } else {
                console.error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});