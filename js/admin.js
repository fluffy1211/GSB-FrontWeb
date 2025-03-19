const messageDiv = document.getElementById('message');
console.log('admin.js');

// Remove the getApiBaseUrl function and API_BASE_URL declaration
// Instead, use API_CONFIG from config.js

// Add product functionality
document.getElementById('product').addEventListener('click', async () => {
    const name = document.querySelector('input[placeholder="Product Name"]').value;
    const description = document.querySelector('input[placeholder="Description"]').value;
    const price = document.querySelector('input[placeholder="Price"]').value;
    const imagePath = document.querySelector('input[placeholder="Image URL"]').value;
    const quantity = document.querySelector('input[placeholder="Quantity"]').value;

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
            console.log('ça marche');
            messageDiv.textContent = "Produit bien ajouté!";
            // Clear form fields
            document.querySelectorAll('.inventory-table input').forEach(input => input.value = '');
            // Refresh the product list
            loadProducts();
        } else {
            console.log("Erreur dans l'ajout");
            messageDiv.textContent = "Erreur dans l'ajout";
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Erreur dans la requête');
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
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';
        
        products.forEach(product => {
            // Check if image path is valid or use a placeholder
            const imageSrc = product.imagePath && product.imagePath.trim() !== '' 
                ? product.imagePath 
                : 'assets/placeholder-product.png';
                
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id_product}</td>
                <td>
                    <div class="product-info">
                        <img src="${imageSrc}" alt="${product.name}" class="admin-product-img" 
                             onerror="this.src='assets/placeholder-product.png'">
                        <span>${product.name}</span>
                    </div>
                </td>
                <td>${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</td>
                <td>${product.price}€</td>
                <td>
                    <span class="quantity-badge">${product.quantity}</span>
                </td>
                <td>
                    <button class="delete-product-btn" data-id="${product.id_product}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            productsList.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-product-btn').forEach(button => {
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

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);