const cartBtns = document.querySelectorAll('.cart-btn');
const popup = document.getElementById('popup');

// Popup d'ajout au panier

cartBtns.forEach(cartBtn => {
    cartBtn.addEventListener('click', e => {
        e.preventDefault();
        const html = `
            <div class="popup-content">
                <h2>Produit ajouté au panier !</h2>
            </div>
        `;
        popup.classList.add('popup-active');
        popup.innerHTML = html;
        setTimeout(() => {
            popup.setAttribute('style', 'display: none');
        }, 4000);
        if (e.target.classList.contains('cart-btn')) {
            popup.setAttribute('style', 'display: active');
        }
    });
});


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
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

getProducts();

