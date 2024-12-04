const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

// AJOUTER AU PANIER
exports.addToCart = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }
    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Log the token
    jwt.verify(token, process.env.API_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        console.log('Decoded:', decoded); // Log the decoded payload
        const client_id = decoded.id; // Assurez-vous que le payload du JWT contient l'ID de l'utilisateur
        if (!client_id) {
            return res.status(400).json({ error: 'Client ID is missing in token' });
        }
        const { id_product, quantity } = req.body;

        if (!id_product || !quantity) {
            return res.status(400).json({ error: 'champs manquants' });
        }

        try {
            // Récupérer le prix du produit depuis la bdd
            const [product] = await database.query('SELECT price FROM products WHERE id_product = ?', [id_product]);

            if (!product) {
                return res.status(404).json({ error: 'Produit non trouvé' });
            }

            const productPrice = product.price;

            // Récupérer le cart du client
            let [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                // En créer un nouveau si il n'y en a pas
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

                // Update le cart dans la database
                await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
                    JSON.stringify(cartContent),
                    client_id
                ]);
            }

            res.status(200).json({ message: 'produit ajouté' });
        } catch (error) {
            console.error("Erreur dans l'ajout au cart", error);
            res.status(500).json({ error: 'Erreur interne' });
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
            let [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                // Pas de panier pour ce client
                return res.status(200).json({ items: [] });
            }

            const cartContent = JSON.parse(cart.cart_content);

            res.status(200).json({ items: cartContent });
        } catch (err) {
            console.error('Erreur dans le fetching du cart:', err);
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
            return res.status(400).json({ error: 'champs manquants' });
        }

        try {
            // Fetch the current cart for the client
            let [cart] = await database.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);

            if (!cart) {
                return res.status(404).json({ error: 'Cart non trouvé' });
            }

            // Parse the current cart content
            let cartContent = JSON.parse(cart.cart_content);

            // Check if the product is in the cart
            const productIndex = cartContent.findIndex(item => item.id_product === id_product);
            if (productIndex === -1) {
                return res.status(404).json({ error: 'Produit non trouvé dans le cart' });
            }

            // Remove the product from the cart
            cartContent.splice(productIndex, 1);

            // Update the cart in the database
            await database.query('UPDATE carts SET cart_content = ? WHERE client_id = ?', [
                JSON.stringify(cartContent),
                client_id
            ]);

            res.status(200).json({ message: 'Produits supprimés du cart' });
        } catch (error) {
            console.error('erreur dans la suppression du cart:', error);
            res.status(500).send('Internal server error');
        }
    });
};