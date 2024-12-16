const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

// AJOUTER AU PANIER
exports.addToCart = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.API_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        const client_id = decoded.id; // Assurez-vous que le payload du JWT contient l'ID de l'utilisateur
        if (!client_id) {
            return res.status(400).json({ error: 'Client ID is missing in token' });
        }
        const { id_product, quantity } = req.body;

        if (!id_product || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            // Récupérer le prix du produit depuis la bdd
            const [product] = await database.query('SELECT price FROM products WHERE id_product = ?', [id_product]);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const productPrice = product.price;

            // Récupérer le cart du client
            let [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                // En créer un nouveau si il n'en a pas
                const newCartContent = JSON.stringify([{ id_product, quantity, price: productPrice }]);
                await database.query('INSERT INTO carts (client_id, cart_content) VALUES (?, ?)', [client_id, newCartContent]);
            } else {
                // Récupérer le contenu du cart
                let cartContent = JSON.parse(cart.cart_content);

                // Check si le produit est déjà dans le cart
                const productIndex = cartContent.findIndex(item => item.id_product === id_product);
                if (productIndex > -1) {
                    // Update la quantité du produit si il est dans le cart
                    cartContent[productIndex].quantity += quantity;
                } else {
                    // Ajouter le nouveau produit au cart
                    cartContent.push({ id_product, quantity, price: productPrice });
                }

                // Update le cart dans la bdd
                await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
                    JSON.stringify(cartContent),
                    client_id
                ]);
            }

            res.status(200).json({ message: 'Product added to cart' });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

// METTRE À JOUR OU SUPPRIMER UN PRODUIT DU PANIER
exports.updateCart = async (req, res) => {
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
        const { id_product, quantity } = req.body;

        if (!id_product) {
            return res.status(400).json({ error: 'No id_product' });
        }

        try {
            // Fetch the current cart for the client
            const [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            // Parse the current cart content
            let cartContent = JSON.parse(cart.cart_content);
            console.log('Cart Content:', cartContent);
            console.log('id_product:', id_product);

            // Check if the product is in the cart
            const productIndex = cartContent.findIndex(item => {
                console.log('Comparing:', item.id_product, id_product);
                return item.id_product === id_product;
            });
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Product not found in cart' });
            }

            // Decrement the quantity of the product
            cartContent[productIndex].quantity -= quantity;

            // Remove the product if the quantity is 0 or less
            if (cartContent[productIndex].quantity <= 0) {
                cartContent.splice(productIndex, 1);
            }

            // Update the cart in the database
            await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
                JSON.stringify(cartContent),
                client_id
            ]);

            res.status(200).json({ message: 'Cart updated' });
        } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).send('Internal server error');
        }
    });
};

// AFFICHER LE PANIER
exports.getCart = async (req, res) => {
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

        try {
            // Récupérer le cart du client
            const [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart || cart.length === 0) {
                // Pas de panier pour ce client
                return res.status(200).json({ items: [] });
            }

            const cartContent = JSON.parse(cart.cart_content);

            // Fetch product details for each item in the cart
            const productDetails = await Promise.all(cartContent.map(async item => {
                const [product] = await database.query('SELECT * FROM products WHERE id_product = ?', [item.id_product]);
                return {
                    ...item,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    imagePath: product.imagePath
                };
            }));

            res.status(200).json({ items: productDetails });
        } catch (err) {
            console.error('Error fetching cart:', err);
            res.status(500).send('Internal server error');
        }
    });
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
            return res.status(400).json({ error: 'No id_product' });
        }

        try {
            // Fetch le cart du client
            let [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            
            let cartContent = JSON.parse(cart.cart_content);
            console.log('Cart Content:', cartContent);

            // Check si le produit est dans le cart
            const productIndex = cartContent.findIndex(item => item.id_product === id_product);
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Product not found in cart' });
            }

            // Enlever le produit du cart
            cartContent.splice(productIndex, 1);

            // Update le cart dans la bdd
            await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
                JSON.stringify(cartContent),
                client_id
            ]);

            res.status(200).json({ message: 'Product removed from cart' });
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).send('Internal server error');
        }
    });
};