const cartBtns = document.querySelectorAll('.cart-btn');
const popup = document.getElementById('popup');

// Afficher les produits dans les cards
const cardsContainer = document.getElementById('card-container');
async function getProducts() {
    try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
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
    } catch (error) {
        console.error('Error:', error);
    }
}

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



