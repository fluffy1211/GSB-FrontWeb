const database = require('../database/db.js');

// AFFICHER LES PRODUITS DEPUIS LA BDD

exports.getProducts = async (req, res) => {
    try {
        const conn = await database.getConnection();
        const products = await conn.query('SELECT * FROM products');
        conn.release();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal server error');
    }
}

// AFFICHER UN PRODUIT DEPUIS LA BDD

exports.getProduct = async (req, res) => {
    try {
        const conn = await database.getConnection();
        const result = await conn.query('SELECT * FROM products WHERE id_product = ?', [req.params.id_product]);
        conn.release();
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal server error');
    }
}

