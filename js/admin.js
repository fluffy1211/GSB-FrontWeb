const messageDiv = document.getElementById('message');
console.log('admin.js');

// Check admin access when page loads
function checkAdminAccess() {
    const token = getCookie('jwt');
    
    if (!token) {
        // No token found, redirect to login
        window.location.href = '/login.html';
        return false;
    }
    
    try {
        // Decode JWT payload (without verification as that happens on the server)
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid token format');
        
        const payload = JSON.parse(atob(parts[1]));
        
        if (payload.role !== 'admin') {
            // User is not an admin, redirect to home
            window.location.href = '/';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error checking admin access:', error);
        window.location.href = '/';
        return false;
    }
}

// Helper function to get cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Check admin access immediately
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) return;
    
    // Only load products if admin access check passes
    loadProducts();
});

// Add product functionality
document.getElementById('product').addEventListener('click', async () => {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const imagePath = document.getElementById('product-image').value;
    const quantity = document.getElementById('product-quantity').value;

    const productData = { name, description, price, imagePath, quantity };

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/admin/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            messageDiv.textContent = "Produit bien ajouté!";
            // Clear form fields
            document.querySelectorAll('#add-product-form input').forEach(input => input.value = '');
            // Refresh the product list
            loadProducts();
        } else {
            messageDiv.textContent = "Erreur dans l'ajout";
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = "Erreur dans la requête";
    }
});

// Load and display products
async function loadProducts() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        // Update table for desktop view
        const productsTableList = document.getElementById('products-table-list');
        productsTableList.innerHTML = '';
        
        // Update cards for mobile view
        const productsCardList = document.getElementById('products-card-list');
        productsCardList.innerHTML = '';
        
        products.forEach(product => {
            // Check if image path is valid or use a placeholder
            const imageSrc = product.imagePath && product.imagePath.trim() !== '' 
                ? product.imagePath 
                : '/assets/placeholder-product.png';
            
            // Format price to always show 2 decimal places
            const formattedPrice = parseFloat(product.price).toFixed(2);
            
            // 1. Create table row for desktop
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id_product}</td>
                <td>
                    <div class="product-info">
                        <img src="${imageSrc}" alt="${product.name}" class="admin-product-img" 
                             onerror="this.src='/assets/placeholder-product.png'">
                        <span>${product.name}</span>
                    </div>
                </td>
                <td>${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</td>
                <td>${formattedPrice}€</td>
                <td>
                    <span class="quantity-badge">${product.quantity}</span>
                </td>
                <td>
                    <button class="delete-product-btn" data-id="${product.id_product}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            productsTableList.appendChild(row);
            
            // 2. Create card for mobile
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card-header">
                    <span class="product-card-id">ID: ${product.id_product}</span>
                </div>
                <div class="product-card-body">
                    <div class="product-card-img-wrapper">
                        <img src="${imageSrc}" alt="${product.name}" class="product-card-img" 
                             onerror="this.src='/assets/placeholder-product.png'">
                    </div>
                    <h3 class="product-card-title">${product.name}</h3>
                    <p class="product-card-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="product-card-price">${formattedPrice}€</div>
                    <div class="product-card-quantity">Quantity: <span>${product.quantity}</span></div>
                    <div class="product-card-actions">
                        <button class="delete-card-btn" data-id="${product.id_product}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            productsCardList.appendChild(card);
        });
        
        // Add event listeners to delete buttons (both in table and cards)
        document.querySelectorAll('.delete-product-btn, .delete-card-btn').forEach(button => {
            button.addEventListener('click', deleteProduct);
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
        messageDiv.textContent = "Error loading products";
    }
}

// Delete product function
async function deleteProduct(event) {
    const productId = event.currentTarget.dataset.id;
    if (!confirm(`Are you sure you want to delete product #${productId}?`)) {
        return;
    }
    
    try {
        console.log(`Attempting to delete product ID: ${productId}`);
        
        const response = await fetch(`${API_CONFIG.baseUrl}/admin/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Clear any previous message
            messageDiv.textContent = "";
            
            // Just refresh the product list without showing a success message
            loadProducts();
        } else {
            // For debugging only - log detailed error information to console
            console.log(`Server returned ${response.status}: ${response.statusText}`);
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.log("Error details:", errorData);
                } else {
                    const textResponse = await response.text();
                    console.log("Non-JSON response:", textResponse.substring(0, 100) + "...");
                }
            } catch (parseError) {
                console.error("Error parsing response:", parseError);
            }
            
            // Don't display any error message to the user
            messageDiv.textContent = "";
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        // Don't display any error message to the user
        messageDiv.textContent = "";
    }
}