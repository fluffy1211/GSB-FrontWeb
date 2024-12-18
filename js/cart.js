const cart_container = document.querySelector('.cart-container');
const buy_button = document.getElementsByClassName('buy-btn')[0];

// Récupérer un cookie par son nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function pour update la quantité de l'item dans le cart
async function updateCart(id_product, quantity) {
    const jwtToken = getCookie('jwt');
    try {
        const response = await fetch('http://localhost:3001/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ id_product, quantity })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Cart updated:', data);
            getCart(); // Refresh le cart
        } else {
            console.error('Error updating cart:', data);
        }
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}

// Supprimer une quantité d'un produit du panier
async function decrementQuantity(id_product) {
    await updateCart(id_product, 1);
}

const getCart = async () => {
    const jwtToken = getCookie('jwt');
    try {
        const response = await fetch('http://localhost:3001/cart', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` 
            }
        });
        const data = await response.json();
        if (data.error) {
            console.log(data.error);
            return cart_container.innerHTML = '<p>Erreur lors de la récupération du panier</p>';
        }
        if (!data.items || !data.items.length) {
            return cart_container.innerHTML = '<p class="cart-empty">Votre panier est vide</p>';
        }
        cart_container.innerHTML = '';
        data.items.forEach(item => {
            const product = document.createElement('div');
            product.classList.add('card');
            product.innerHTML = `
                <img src="${item.imagePath}" alt="${item.name}" class="card-img">
                <div class="card-content">
                    <h2 class="card-title">${item.name}</h2>
                    <p class="card-description">${item.description}</p>
                    <p class="card-price">${item.price} €</p>
                    <p class="card-quantity">Quantité: ${item.quantity}</p>
                    <button class="cart-btn">Supprimer</button>
                </div>
            `;
            const button = product.querySelector('.cart-btn');
            button.addEventListener('click', () => decrementQuantity(item.id_product));
            cart_container.appendChild(product);
        });
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        cart_container.innerHTML = '<p>Erreur lors de la récupération du panier</p>';
    }
}

buy_button.addEventListener('click', async () => {
    const jwtToken = getCookie('jwt');
    try {
        const response = await fetch('http://localhost:3001/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error creating order');
        }
        console.log("Commande créée avec succès")
        getCart(); // Refresh cart
    } catch (error) {
        console.error('Error:', error);
        alert('Votre panier est vide');
    }
});

getCart();