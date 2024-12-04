const cartBtns = document.querySelectorAll('.cart-btn');
const popup = document.getElementById('popup');

// Afficher les produits dans les cards
const cardsContainer = document.getElementById('card-container');
<<<<<<< HEAD

// Stocker les produits pour pouvoir les trier dynamiquement
let productsData = [];

// Récupérer les produits et les stocker dans productsData
=======
>>>>>>> 52eb73f3366b8e20d1ff74ad012f396b87bfb94e
async function getProducts() {
    try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
<<<<<<< HEAD
        productsData = products; // Stocker les produits récupérés
        renderProducts(productsData); // Afficher les produits
=======
        products.forEach((product, index) => {
            const card = cardsContainer.children[index];
            if (card) {
                card.querySelector('.card-img').src = product.imagePath;
                card.querySelector('.card-title').textContent = product.name;
                card.querySelector('.card-description').textContent = product.description;
                card.querySelector('.card-price').textContent = `${product.price}€`;
                card.querySelector('.cart-btn').dataset.productId = product.id_product; // Ajouter l'ID du produit
            }
        });
>>>>>>> 52eb73f3366b8e20d1ff74ad012f396b87bfb94e
    } catch (error) {
        console.error('Error:', error);
    }
}

<<<<<<< HEAD
// Afficher les produits dans les cartes
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
=======
>>>>>>> 52eb73f3366b8e20d1ff74ad012f396b87bfb94e
getProducts();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        console.log('Full decoded payload:', JSON.parse(jsonPayload)); // Add this line
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}

const jwtToken = getCookie('jwt');
if (jwtToken) {
    const decodedPayload = parseJwt(jwtToken);
    console.log('Decoded JWT Payload:', decodedPayload);
} else {
    console.error('JWT token not found in cookies');
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
            const decodedToken = parseJwt(jwtToken);
            const clientId = decodedToken ? decodedToken.id : null;
            console.log('Client ID:', clientId); // Log the client ID

            if (!clientId) {
                console.error('Client ID is missing in token!');
                return;
            }

            const response = await fetch('http://localhost:3001/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}` // Utiliser le token JWT
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



