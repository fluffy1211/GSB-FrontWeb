const cart_container = document.querySelector('.cart-container');
const buy_button = document.querySelector('.buy-btn');

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

// Calculate total
function calculateCartTotal(items) {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Version JS sans CSS inline, utilisant des classes CSS
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
        
        // Référence au conteneur principal
        const cartWrapper = document.getElementById('cart-wrapper');
        cartWrapper.innerHTML = ''; // Vider le conteneur
        
        // Cas d'erreur ou de panier vide
        if (data.error) {
            const errorMsg = document.createElement('p');
            errorMsg.className = 'cart-error-message';
            errorMsg.textContent = 'Erreur lors de la récupération du panier';
            return cartWrapper.appendChild(errorMsg);
        }
        
        if (!data.items || !data.items.length) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'cart-empty-message';
            emptyMsg.textContent = 'Votre panier est vide';
            return cartWrapper.appendChild(emptyMsg);
        }
        
        // Créer un conteneur pour les cartes
        const cardLayout = document.createElement('div');
        cardLayout.className = 'card-layout';
        cartWrapper.appendChild(cardLayout);
        
        // Modification de la partie qui crée le HTML des cartes
        data.items.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            
            // Création du conteneur de carte
            const card = document.createElement('div');
            card.className = 'cart-card';
            card.setAttribute('data-id', item.id_product);
            
            // Création du contenu avec des classes CSS appropriées
            card.innerHTML = `
                <div class="cart-card-container">
                    <img src="${item.imagePath || 'assets/placeholder-product.png'}" 
                        alt="${item.name}" 
                        class="cart-card-img"
                        onerror="this.src='assets/placeholder-product.png'">
                    <div class="cart-card-content">
                        <h3 class="cart-card-title">${item.name}</h3>
                        <p class="cart-card-description">${item.description}</p>
                        
                        <div class="cart-card-details">
                            <p class="cart-card-price">Prix unitaire: ${item.price} €</p>
                            <p class="cart-card-quantity">Quantité: ${item.quantity}</p>
                            <p class="cart-card-total">Total: ${itemTotal} €</p>
                        </div>
                        
                        <button class="cart-remove-btn">Supprimer</button>
                    </div>
                </div>
            `;
            
            // Ajouter l'écouteur d'événement au bouton
            const removeButton = card.querySelector('.cart-remove-btn');
            removeButton.addEventListener('click', () => updateCart(item.id_product, 1));
            
            // Ajouter la carte au conteneur
            cardLayout.appendChild(card);
        });

        // Ajouter le total en bas avec des classes CSS
        const cartTotal = calculateCartTotal(data.items);
        const totalElement = document.createElement('div');
        totalElement.className = 'cart-total-element';
        totalElement.innerHTML = `<h3 class="cart-total-heading">Total du panier: <span class="cart-total-price">${cartTotal} €</span></h3>`;
        cartWrapper.appendChild(totalElement);
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'cart-error-message';
        errorMsg.textContent = 'Erreur lors de la récupération du panier';
        document.getElementById('cart-wrapper').innerHTML = '';
        document.getElementById('cart-wrapper').appendChild(errorMsg);
    }
};

// Initialiser le bouton d'achat
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

// Initialiser le panier au chargement
getCart();