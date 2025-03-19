const messageDiv = document.getElementById('message');
console.log('admin.js loaded');

// Base URL for API calls
const API_BASE_URL = 'http://192.168.1.61:3001';

// Initialize the admin page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupSearchFilter();
});

// Handle product addition
document.getElementById('product').addEventListener('click', async () => {
    const name = document.querySelector('input[placeholder="Product Name"]').value;
    const description = document.querySelector('input[placeholder="Description"]').value;
    const price = document.querySelector('input[placeholder="Price"]').value;
    const imagePath = document.querySelector('input[placeholder="Image URL"]').value;
    const quantity = document.querySelector('input[placeholder="Quantity"]').value;

    const productData = { name, description, price, imagePath, quantity };

    try {
        const response = await fetch(`${API_BASE_URL}/admin/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            console.log('Product added successfully');
            messageDiv.textContent = "Produit bien ajouté!";
            messageDiv.className = "admin-message success";
            
            // Clear form
            document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
                input.value = '';
            });
            
            // Reload products list
            loadProducts();
        } else {
            console.log("Error adding product");
            messageDiv.textContent = "Erreur dans l'ajout";
            messageDiv.className = "admin-message error";
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = "Erreur dans la requête";
        messageDiv.className = "admin-message error";
    }
});

// Load all products from the database
async function loadProducts() {
    const productsList = document.getElementById('products-list');
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        if (products.length === 0) {
            productsList.innerHTML = `<tr><td colspan="7" class="no-products">Aucun produit trouvé</td></tr>`;
            return;
        }
        
        productsList.innerHTML = products.map(product => `
            <tr data-id="${product.id_product}" data-name="${product.name}">
                <td>${product.id_product}</td>
                <td>
                    <img src="${product.imagePath || 'assets/placeholder-product.png'}" 
                         alt="${product.name}" 
                         class="admin-product-image"
                         onerror="this.src='assets/placeholder-product.png'">
                </td>
                <td>${product.name}</td>
                <td class="product-description">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</td>
                <td>${product.price}€</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="admin-btn delete-product" data-id="${product.id_product}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', handleDeleteProduct);
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsList.innerHTML = `<tr><td colspan="7" class="error-message">Erreur lors du chargement des produits</td></tr>`;
    }
}

// Handle product deletion
async function handleDeleteProduct(event) {
    const productId = event.currentTarget.dataset.id;
    const productRow = event.currentTarget.closest('tr');
    const productName = productRow.dataset.name;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Remove the row from the table
                productRow.remove();
                
                // Show success message
                messageDiv.textContent = `Produit "${productName}" supprimé avec succès`;
                messageDiv.className = "admin-message success";
                
                // Check if table is now empty
                const productsList = document.getElementById('products-list');
                if (productsList.children.length === 0) {
                    productsList.innerHTML = `<tr><td colspan="7" class="no-products">Aucun produit trouvé</td></tr>`;
                }
            } else {
                const error = await response.json();
                messageDiv.textContent = `Erreur: ${error.error || 'Une erreur est survenue'}`;
                messageDiv.className = "admin-message error";
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            messageDiv.textContent = "Erreur lors de la suppression du produit";
            messageDiv.className = "admin-message error";
        }
    }
}

// Setup the search filter
function setupSearchFilter() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const productRows = document.querySelectorAll('#products-list tr');
        
        productRows.forEach(row => {
            const productName = row.dataset.name?.toLowerCase() || '';
            const productId = row.dataset.id || '';
            const description = row.querySelector('.product-description')?.textContent?.toLowerCase() || '';
            
            if (productName.includes(searchTerm) || productId.includes(searchTerm) || description.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}