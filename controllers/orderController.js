const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

exports.createOrder = async (req, res) => {
    try {
        const client_id = req.user.id;
        const conn = await database.getConnection();

        try {
            await conn.beginTransaction();

            // Obtenir le contenu du panier actuel
            const cartResult = await conn.query(
                'SELECT cart_content FROM carts WHERE client_id = ?',
                [client_id]
            );

            if (!cartResult || cartResult.length === 0 || !cartResult[0].cart_content) {
                await conn.rollback();
                conn.release();
                return res.status(400).json({ error: 'Panier vide' });
            }

            // Analyser le contenu du panier
            let cartContent;
            try {
                cartContent = JSON.parse(cartResult[0].cart_content);
            } catch (err) {
                await conn.rollback();
                conn.release();
                return res.status(500).json({ error: 'Erreur lors de l\'analyse du contenu du panier' });
            }

            if (!Array.isArray(cartContent) || cartContent.length === 0) {
                await conn.rollback();
                conn.release();
                return res.status(400).json({ error: 'Panier vide' });
            }

            // Créer une nouvelle commande
            const orderResult = await conn.query(
                'INSERT INTO orders (client_id, order_date, status) VALUES (?, NOW(), ?)',
                [client_id, 'En cours']
            );

            const orderId = orderResult.insertId;

            // Ajouter chaque article à la table des détails de commande
            for (const item of cartContent) {
                await conn.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, (SELECT price FROM products WHERE id_product = ?))',
                    [orderId, item.id_product, item.quantity, item.id_product]
                );

                // Mettre à jour le stock
                await conn.query(
                    'UPDATE products SET quantity = quantity - ? WHERE id_product = ? AND quantity >= ?',
                    [item.quantity, item.id_product, item.quantity]
                );
            }

            // Vider le panier
            await conn.query(
                'UPDATE carts SET cart_content = "[]" WHERE client_id = ?',
                [client_id]
            );

            await conn.commit();
            conn.release();

            res.status(200).json({
                message: 'Commande créée avec succès',
                orderId: orderId // Envoyer comme String
            });

        } catch (error) {
            await conn.rollback();
            conn.release();
            throw error;
        }

    } catch (error) {
        console.error('Erreur de création de commande:', error);
        res.status(500).json({
            error: 'Erreur lors de la création de la commande',
            details: error.message
        });
    }
};