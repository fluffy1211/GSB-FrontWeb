const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

exports.createOrder = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.API_KEY);
        const client_id = decoded.id;
        if (!client_id) {
            return res.status(400).json({ error: 'No client_id' });
        }

        const conn = await database.getConnection();

        // Récupérer le cart du client
        const [cart] = await conn.query('SELECT * FROM carts WHERE client_id = ?', [client_id]);
        if (!cart || cart.length === 0) {
            conn.release();
            return res.status(400).json({ error: 'No cart found' });
        }

        // Récupérer le contenu du cart
        const cartContent = JSON.parse(cart.cart_content);
        if (!cartContent.length) {
            conn.release();
            return res.status(400).json({ error: 'Cart is empty' });
        }

        try {
            await conn.beginTransaction();

            // Créer l'order
            const result = await conn.query(
                'INSERT INTO orders (cart_id, client_id) VALUES (?, ?)',
                [cart.cart_id, client_id]
            );
            
            const orderId = result.insertId.toString(); // Convert BigInt to String

            // Update la quantité des produits
            for (const item of cartContent) {
                const [product] = await conn.query(
                    'SELECT quantity FROM products WHERE id_product = ?',
                    [item.id_product]
                );

                if (!product) {
                    throw new Error(`Product ${item.id_product} not found`);
                }

                const newQuantity = product.quantity - item.quantity;
                if (newQuantity < 0) {
                    throw new Error(`Insufficient stock for product ${item.id_product}`);
                }

                await conn.query(
                    'UPDATE products SET quantity = ? WHERE id_product = ?',
                    [newQuantity, item.id_product]
                );
            }

            // Clear le cart
            await conn.query(
                'UPDATE carts SET cart_content = "[]" WHERE client_id = ?',
                [client_id]
            );

            await conn.commit();
            conn.release();

            res.status(200).json({
                message: 'Order created successfully',
                orderId: orderId // Send as String
            });

        } catch (error) {
            await conn.rollback();
            conn.release();
            throw error;
        }

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            error: 'Error creating order',
            details: error.message
        });
    }
};