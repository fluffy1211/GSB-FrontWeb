const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

exports.addProduct = async (req, res) => {
    const { name, description, price, imagePath, quantity } = req.body;

    if (!name || !description || !price || !imagePath || !quantity) {
        return res.status(400).json({ error: 'Remplissez tous les champs' });
    }

    try {
        const conn = await database.getConnection();
        const query = 'INSERT INTO products (name, description, price, imagePath, quantity) VALUES (?, ?, ?, ?, ?)';
        await conn.query(query, [name, description, price, imagePath, quantity]);
        conn.release();
        res.status(201).json({ message: 'produit bien ajouté' });
    } catch (error) {
        console.error("Erreur dans l'ajout", error);
        res.status(500).json({ error: 'Erreur' });
    }
};