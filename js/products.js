// Réinitialiser les variables globales et obtenir les références
let productsData = [];

// Fonctions d'initialisation - utilisant des pratiques modernes
const initializeApp = () => {
    getProducts();
    setupFilterButtons();
};

// Créer l'élément de notification
const createNotificationElement = () => {
    const notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
    return notification;
};

// Obtenir ou créer l'élément de notification
const getNotification = () => {
    return document.getElementById('notification') || createNotificationElement();
};

// Afficher la notification - simplifiée sans bouton de fermeture
function showNotification(productName) {
    const notification = getNotification();
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">Produit ajouté !</div>
            <div class="notification-message">${productName} a été ajouté à votre panier</div>
        </div>
    `;
    
    notification.classList.add('show');
    
    // Fermeture automatique après 4 secondes
    setTimeout(closeNotification, 4000);
}

// Fermer la notification
function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Ajouter une fonction à la portée globale pour le bouton de fermeture
window.closeNotification = closeNotification;

// Récupérer les produits de l'API
async function getProducts() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/products`);
        if (!response.ok) {
            throw new Error('La réponse réseau n\'était pas correcte');
        }
        const products = await response.json();
        productsData = products;
        renderProducts(productsData);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
    }
}

// Afficher les produits sur la page avec une meilleure gestion des images
function renderProducts(products) {
    const cardsContainer = document.getElementById('card-container');
    if (!cardsContainer) {
        console.error('Élément conteneur de carte non trouvé');
        return;
    }
    
    cardsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';
        
        // Vérifier si le chemin d'image est valide ou utiliser un espace réservé
        const imageSrc = product.imagePath && product.imagePath.trim() !== '' 
            ? product.imagePath 
            : '/assets/placeholder-product.png';
            
        productCard.innerHTML = `
            <img class="card-img" src="${imageSrc}" alt="${product.name}" onerror="this.src='/assets/placeholder-product.png'">
            <div class="card-content">
                <h2 class="card-title">${product.name}</h2>
                <p class="card-description">${product.description}</p>
                <p class="card-price">${product.price}€</p>
                <div class="product-actions">
                    <select class="product-quantity">
                        <option value="" disabled selected>Quantité</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button class="product-add-btn" data-id="${product.id_product}">
                        <i class="fas fa-shopping-cart"></i>
                        Ajouter au panier
                    </button>
                </div>
            </div>
        `;
        
        cardsContainer.appendChild(productCard);
        
        // Ajouter un écouteur d'événements au bouton
        const addButton = productCard.querySelector('.product-add-btn');
        addButton.addEventListener('click', () => addToCart(product));
    });
}

// Fonction d'ajout au panier
async function addToCart(product) {
    const card = event.target.closest('.card');
    const quantitySelect = card.querySelector('.product-quantity');
    const quantity = parseInt(quantitySelect.value);
    
    if (!quantity) {
        alert('Veuillez sélectionner une quantité');
        return;
    }
    
    try {
        const jwtToken = getCookie('jwt');
        if (!jwtToken) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_CONFIG.baseUrl}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ 
                id_product: product.id_product, 
                quantity: quantity 
            })
        });
        
        if (response.ok) {
            showNotification(product.name);
            quantitySelect.value = ""; // Réinitialiser le sélecteur de quantité après un ajout réussi
        } else {
            console.error('Échec de l\'ajout du produit au panier:', await response.text());
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit au panier:', error);
    }
}

// Fonction utilitaire pour récupérer un cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Gérer les boutons de filtrage
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-buttons');
    if (!filterButtons.length) {
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.value;
            let sortedProducts = [...productsData];
            
            // Ajouter la classe active au bouton cliqué et la supprimer des autres
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            if (filterType === "A-Z") {
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (filterType === "Prix") {
                sortedProducts.sort((a, b) => a.price - b.price);
            }
            
            renderProducts(sortedProducts);
        });
    });
}

// Utiliser le modèle de module avec invocation immédiate pour une organisation plus propre
// C'est une approche moderne qui ne s'appuie pas sur DOMContentLoaded
(function() {
    // Vérifier si nous sommes sur la bonne page avec les éléments nécessaires
    if (document.getElementById('card-container')) {
        initializeApp();
    }
})();
