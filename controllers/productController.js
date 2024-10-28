const db = require('../database/db.js');

exports.getAllProducts = async (req, res) => {
    let conn = await db.getConnection();
    try {
        const products = await conn.query('SELECT * FROM products');
        await conn.release()
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}