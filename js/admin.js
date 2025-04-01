const messageDiv = document.getElementById('message');
console.log('admin.js');

// Vérifier l'accès administrateur lors du chargement de la page
function checkAdminAccess() {
    const token = getCookie('jwt');
    
    if (!token) {
        // Aucun token trouvé, redirection vers la page de connexion
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        // Décoder la charge utile JWT (sans vérification car cela se produit sur le serveur)
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Format de token invalide');
        
        const payload = JSON.parse(atob(parts[1]));
        
        if (payload.role !== 'admin') {
            // L'utilisateur n'est pas administrateur, rediriger vers la page d'accueil
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'accès administrateur:', error);
        window.location.href = 'index.html';
        return false;
    }
}

// Fonction utilitaire pour obtenir un cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Vérifier immédiatement l'accès administrateur
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) return;
    
    // Charger les produits uniquement si la vérification d'accès administrateur est réussie
    loadProducts();
    
    // Charger la liste des utilisateurs
    loadUsers();
});

// Fonctionnalité d'ajout de produit
document.getElementById('product').addEventListener('click', async () => {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const imagePath = document.getElementById('product-image').value;
    const quantity = document.getElementById('product-quantity').value;

    const productData = { name, description, price, imagePath, quantity };
    const token = getCookie('jwt');

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/admin/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            messageDiv.textContent = "Produit bien ajouté!";
            // Effacer les champs du formulaire
            document.querySelectorAll('#add-product-form input').forEach(input => input.value = '');
            // Actualiser la liste des produits
            loadProducts();
        } else {
            messageDiv.textContent = "Erreur dans l'ajout";
        }
    } catch (error) {
        console.error('Erreur:', error);
        messageDiv.textContent = "Erreur dans la requête";
    }
});

// Charger et afficher les produits
async function loadProducts() {
    try {
        const token = getCookie('jwt');
        const response = await fetch(`${API_CONFIG.baseUrl}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Échec de la récupération des produits');
        }
        
        const products = await response.json();
        
        // Mettre à jour le tableau pour la vue bureau
        const productsTableList = document.getElementById('products-table-list');
        productsTableList.innerHTML = '';
        
        // Mettre à jour les cartes pour la vue mobile
        const productsCardList = document.getElementById('products-card-list');
        productsCardList.innerHTML = '';
        
        products.forEach(product => {
            // Vérifier si le chemin de l'image est valide ou utiliser un espace réservé
            const imageSrc = product.imagePath && product.imagePath.trim() !== '' 
                ? product.imagePath 
                : 'assets/placeholder-product.png';
            
            // Formater le prix pour toujours afficher 2 décimales
            const formattedPrice = parseFloat(product.price).toFixed(2);
            
            // 1. Créer une ligne de tableau pour bureau
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
                <td>${formattedPrice}€</td>
                <td>
                    <span class="quantity-badge">${product.quantity}</span>
                </td>
                <td>
                    <button class="delete-product-btn" data-id="${product.id_product}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </td>
            `;
            productsTableList.appendChild(row);
            
            // 2. Créer une carte pour mobile
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card-header">
                    <span class="product-card-id">ID: ${product.id_product}</span>
                </div>
                <div class="product-card-body">
                    <div class="product-card-img-wrapper">
                        <img src="${imageSrc}" alt="${product.name}" class="product-card-img" 
                             onerror="this.src='assets/placeholder-product.png'">
                    </div>
                    <h3 class="product-card-title">${product.name}</h3>
                    <p class="product-card-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <div class="product-card-price">${formattedPrice}€</div>
                    <div class="product-card-quantity">Quantité: <span>${product.quantity}</span></div>
                    <div class="product-card-actions">
                        <button class="delete-card-btn" data-id="${product.id_product}">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                </div>
            `;
            productsCardList.appendChild(card);
        });
        
        // Ajouter des écouteurs d'événements aux boutons de suppression (dans le tableau et les cartes)
        document.querySelectorAll('.delete-product-btn, .delete-card-btn').forEach(button => {
            button.addEventListener('click', deleteProduct);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        messageDiv.textContent = "Erreur lors du chargement des produits";
    }
}

// Charger et afficher les utilisateurs
async function loadUsers() {
    try {
        // Récupérer le token JWT à partir des cookies
        const token = getCookie('jwt');
        if (!token) {
            console.error('No JWT token found');
            messageDiv.textContent = "Erreur d'authentification";
            return;
        }

        const response = await fetch(`${API_CONFIG.baseUrl}/admin/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Échec de la récupération des utilisateurs');
        }
        
        const users = await response.json();
        
        // Mettre à jour le tableau des utilisateurs
        const usersTableList = document.getElementById('users-table-list');
        usersTableList.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.client_id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <span class="${user.isProblematic ? 'problematic-badge' : 'normal-badge'}">
                        ${user.isProblematic ? 'Problématique' : 'Normal'}
                    </span>
                    <button class="toggle-status-btn" data-id="${user.client_id}" data-status="${user.isProblematic}">
                        ${user.isProblematic ? 'Marquer comme Normal' : 'Marquer comme Problématique'}
                    </button>
                </td>
            `;
            usersTableList.appendChild(row);
        });
        
        // Add event listeners to toggle buttons
        document.querySelectorAll('.toggle-status-btn').forEach(button => {
            button.addEventListener('click', toggleUserStatus);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        messageDiv.textContent = "Erreur lors du chargement des utilisateurs";
    }
}

// Fonction pour marquer l'utilisateur comme problématique ou normal
async function toggleUserStatus(event) {
    const userId = event.currentTarget.dataset.id;
    const currentStatus = event.currentTarget.dataset.status === "1";
    const statusText = currentStatus ? "normal" : "problématique";
    
    if (!confirm(`Êtes-vous sûr de vouloir marquer l'utilisateur #${userId} comme ${statusText}?`)) {
        return;
    }
    
    try {
        const token = getCookie('jwt');
        
        const response = await fetch(`${API_CONFIG.baseUrl}/admin/user/${userId}/toggle-problematic`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Reload la liste des utilisateurs pour refléter le changement
            loadUsers();
        } else {
            console.log(`Le serveur a retourné ${response.status}: ${response.statusText}`);
            try {
                const errorData = await response.json();
                console.log("Détails de l'erreur:", errorData);
            } catch (parseError) {
                console.error("Erreur lors de l'analyse de la réponse:", parseError);
            }
        }
    } catch (error) {
        console.error('Erreur lors du changement de statut:', error);
    }
}

// Fonction de suppression de produit
async function deleteProduct(event) {
    const productId = event.currentTarget.dataset.id;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit #${productId}?`)) {
        return;
    }
    
    try {
        console.log(`Tentative de suppression du produit ID: ${productId}`);
        const token = getCookie('jwt');
        const response = await fetch(`${API_CONFIG.baseUrl}/admin/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Effacer tout message précédent
            messageDiv.textContent = "";
            
            // Simplement actualiser la liste des produits sans afficher de message de succès
            loadProducts();
        } else {
            console.log(`Le serveur a retourné ${response.status}: ${response.statusText}`);
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.log("Détails de l'erreur:", errorData);
                } else {
                    const textResponse = await response.text();
                    console.log("Réponse non-JSON:", textResponse.substring(0, 100) + "...");
                }
            } catch (parseError) {
                console.error("Erreur lors de l'analyse de la réponse:", parseError);
            }
            
            // Ne pas afficher de message d'erreur à l'utilisateur
            messageDiv.textContent = "";
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        // Ne pas afficher de message d'erreur à l'utilisateur
        messageDiv.textContent = "";
    }
}