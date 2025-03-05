// Reset globals and get references
let productsData = [];

// Initialization functions - using modern practices
const initializeApp = () => {
    getProducts();
    setupFilterButtons();
};

// Create notification element
const createNotificationElement = () => {
    const notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
    return notification;
};

// Get or create notification element
const getNotification = () => {
    return document.getElementById('notification') || createNotificationElement();
};

// Show notification
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
    
    // Auto close after 4 seconds
    setTimeout(closeNotification, 4000);
}

// Close notification
function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Add function to global scope for the close button
window.closeNotification = closeNotification;

// Fetch products from API
async function getProducts() {
    try {
        const response = await fetch('http://192.168.1.61:3001/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        productsData = products;
        renderProducts(productsData);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Render products to page with improved image handling
function renderProducts(products) {
    const cardsContainer = document.getElementById('card-container');
    if (!cardsContainer) {
        console.error('Card container element not found');
        return;
    }
    
    cardsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';
        
        // Check if image path is valid or use a placeholder
        const imageSrc = product.imagePath && product.imagePath.trim() !== '' 
            ? product.imagePath 
            : 'assets/placeholder-product.png';
            
        productCard.innerHTML = `
            <img class="card-img" src="${imageSrc}" alt="${product.name}" onerror="this.src='assets/placeholder-product.png'">
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
        
        // Add event listener to the button
        const addButton = productCard.querySelector('.product-add-btn');
        addButton.addEventListener('click', () => addToCart(product));
    });
}

// Add to cart function
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
        
        const response = await fetch('http://192.168.1.61:3001/cart/add', {
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
            quantitySelect.value = ""; // Reset the quantity selector after successful add
        } else {
            console.error('Failed to add product to cart:', await response.text());
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

// Get cookie helper
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Handle filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-buttons');
    if (!filterButtons.length) {
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.value;
            let sortedProducts = [...productsData];
            
            // Add active class to clicked button and remove from others
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

// Use module pattern with immediate invocation for cleaner organization
// This is a modern approach that doesn't rely on DOMContentLoaded
(function() {
    // Check if we're on the right page with the necessary elements
    if (document.getElementById('card-container')) {
        initializeApp();
    }
})();
