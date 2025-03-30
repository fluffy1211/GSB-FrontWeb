const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

// AJOUTER AU PANIER
exports.addToCart = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Aucun token fourni' });
        }
        
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.API_KEY);
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const client_id = decoded.id;
        if (!client_id) {
            return res.status(400).json({ error: 'ID client manquant dans le token' });
        }
        
        const { id_product, quantity } = req.body;
        if (!id_product || !quantity) {
            console.error('Missing fields:', req.body);
            return res.status(400).json({ error: 'Champs manquants (id_product ou quantity)' });
        }
        
        // Convert to proper types to ensure comparison works
        const productId = parseInt(id_product);
        const productQty = parseInt(quantity);
        
        // Récupérer le prix du produit
        const products = await database.query('SELECT price FROM products WHERE id_product = ?', [productId]);
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        const productPrice = products[0].price;
        console.log(`Adding product ${productId} with price ${productPrice} and quantity ${productQty}`);
        
        // Récupérer le panier
        const carts = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);
        
        // Create new cart if none exists
        if (!carts || carts.length === 0) {
            const newCartContent = JSON.stringify([{ 
                id_product: productId, 
                quantity: productQty, 
                price: productPrice 
            }]);
            
            await database.query('INSERT INTO carts (client_id, cart_content) VALUES (?, ?)', 
                [client_id, newCartContent]);
                
            return res.status(200).json({ message: 'Produit ajouté au nouveau panier' });
        }
        
        // Handle existing cart
        const cart = carts[0];
        
        // Parse cart content
        let cartContent = [];
        if (cart.cart_content) {
            // Check if cart.cart_content is already an object or a string
            if (typeof cart.cart_content === 'string') {
                try {
                    cartContent = JSON.parse(cart.cart_content);
                } catch (err) {
                    console.error('Error parsing cart content:', err);
                    // Continue with empty array
                }
            } else {
                // Already an object
                cartContent = cart.cart_content;
            }
            
            // Ensure it's an array
            if (!Array.isArray(cartContent)) {
                cartContent = [];
            }
        }
        
        // Find if product already exists in cart
        const productIndex = cartContent.findIndex(item => 
            parseInt(item.id_product) === productId
        );
        
        if (productIndex > -1) {
            // Update quantity if product exists
            cartContent[productIndex].quantity += productQty;
        } else {
            // Add new product
            cartContent.push({ 
                id_product: productId, 
                quantity: productQty, 
                price: productPrice 
            });
        }
        
        // Save updated cart
        const cartJson = JSON.stringify(cartContent);
        console.log('Updated cart content:', cartJson);
        
        await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', 
            [cartJson, client_id]);
        
        return res.status(200).json({ message: 'Produit ajouté au panier' });
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ error: 'Erreur serveur interne' });
    }
};

// METTRE À JOUR OU SUPPRIMER UN PRODUIT DU PANIER
exports.updateCart = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Aucun token fourni' });
        }
        
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.API_KEY);
        } catch (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const client_id = decoded.id;
        const { id_product, quantity } = req.body;
        
        if (!id_product) {
            return res.status(400).json({ error: 'ID produit manquant' });
        }
        
        // Fetch the current cart
        const results = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);
        
        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'Panier non trouvé' });
        }
        
        const cart = results[0];
        
        // Handle the cart content safely
        let cartContent = [];
        if (cart.cart_content) {
            if (typeof cart.cart_content === 'string') {
                try {
                    cartContent = JSON.parse(cart.cart_content);
                } catch (err) {
                    console.error('Error parsing cart JSON:', err);
                }
            } else {
                cartContent = cart.cart_content;
            }
        }
        
        if (!Array.isArray(cartContent)) {
            cartContent = [];
        }
        
        // Find the product using string comparison to be safe
        const productIndex = cartContent.findIndex(item => 
            String(item.id_product) === String(id_product)
        );
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
        }
        
        // Update the quantity
        const qtyToRemove = parseInt(quantity || 1);
        cartContent[productIndex].quantity -= qtyToRemove;
        
        // Remove if quantity is 0 or less
        if (cartContent[productIndex].quantity <= 0) {
            cartContent.splice(productIndex, 1);
        }
        
        // Update the cart in the database
        await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
            JSON.stringify(cartContent),
            client_id
        ]);
        
        return res.status(200).json({ message: 'Panier mis à jour' });
        
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ error: 'Erreur serveur interne' });
    }
};
  
exports.getCart = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Aucun token fourni' });
        }
        
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.API_KEY);
        } catch (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const client_id = decoded.id;
        
        // Récupérer le panier depuis la base de données
        const results = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);
        
        // Aucun panier trouvé
        if (!results || results.length === 0) {
            return res.status(200).json({ items: [] });
        }
        
        const cart = results[0];
        
        // Panier vide
        if (!cart || !cart.cart_content) {
            return res.status(200).json({ items: [] });
        }
        
        // Gérer le contenu du panier qui pourrait être une chaîne ou déjà analysé
        let cartContent;
        if (typeof cart.cart_content === 'string') {
            try {
                cartContent = JSON.parse(cart.cart_content);
            } catch (err) {
                console.error('Erreur lors de l\'analyse du JSON du panier:', err);
                return res.status(200).json({ items: [] });
            }
        } else {
            // Déjà un objet
            cartContent = cart.cart_content;
        }
        
        // Assurer que cartContent est un tableau
        if (!Array.isArray(cartContent)) {
            cartContent = [];
        }
        
        // Si le panier est vide, renvoyer un tableau d'articles vide
        if (cartContent.length === 0) {
            return res.status(200).json({ items: [] });
        }
        
        // Récupérer les détails du produit pour chaque article
        const productDetails = [];
        for (const item of cartContent) {
            try {
                const products = await database.query('SELECT * FROM products WHERE id_product = ?', [item.id_product]);
                if (products && products.length > 0) {
                    productDetails.push({
                        ...item,
                        name: products[0].name,
                        description: products[0].description,
                        price: products[0].price,
                        imagePath: products[0].imagePath
                    });
                }
            } catch (err) {
                console.error(`Erreur lors de la récupération du produit ${item.id_product}:`, err);
                // Continuer avec d'autres produits
            }
        }
        
        return res.status(200).json({ items: productDetails });
        
    } catch (err) {
        console.error('Error in getCart:', err);
        return res.status(500).json({ error: 'Erreur serveur interne' });
    }
};

// SUPPRIMER UN PRODUIT DU PANIER

exports.removeProductFromCart = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.API_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        const client_id = decoded.id;
        const { id_product } = req.body;

        if (!id_product) {
          
            return res.status(400).json({ error: 'champs manquants' });

        }

        try {
            // Fetch le cart du client
            let [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                return res.status(404).json({ error: 'Cart non trouvé' });
            }

            
            let cartContent = JSON.parse(cart.cart_content);
            console.log('Cart Content:', cartContent);

            // Check si le produit est dans le cart
            const productIndex = cartContent.findIndex(item => item.id_product === id_product);
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Produit non trouvé dans le cart' });
            }

            // Enlever le produit du cart
            cartContent.splice(productIndex, 1);

            // Update le cart dans la bdd
            await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
                JSON.stringify(cartContent),
                client_id
            ]);

            res.status(200).json({ message: 'Produits supprimés du cart' });
        } catch (error) {
            console.error('erreur dans la suppression du cart:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });        }
    });
};