const database = require('../database/db.js');

// AFFICHER LES PRATICIENS DEPUIS LA BDD

exports.getPraticiens = async (req, res) => {
    try {
        const conn = await database.getConnection();
        const praticiens = await conn.query('SELECT * FROM praticien');
        conn.release();
        res.status(200).json(praticiens);
    } catch (error) {
        console.error('Error fetching praticiens:', error);
        res.status(500).send('Internal server error');
    }
}

// AFFICHER UN PRATICIEN DEPUIS LA BDD

exports.getPraticien = async (req, res) => {
    try {
        const conn = await database.getConnection();
        const result = await conn.query('SELECT * FROM praticien WHERE praticien_id = ?', [req.params.id_praticien]);
        conn.release();
        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).send('Praticien not found');
        }
    } catch (error) {
        console.error('Error fetching praticien:', error);
        res.status(500).send('Internal server error');
    }
}