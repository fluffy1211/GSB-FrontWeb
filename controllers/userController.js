const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

// LOGIQUE D'INSCRIPTION
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json('Email, password, and name are required');
        }

        const conn = await database.getConnection();

        // Check if email or name already exists
        const emailCheck = await conn.query('SELECT * FROM clients WHERE email = ?', [email]);
        const nameCheck = await conn.query('SELECT * FROM clients WHERE name = ?', [name]);

        if (emailCheck.length > 0) {
            conn.release();
            return res.status(400).json('Cet email est déjà utilisé');
        }

        if (nameCheck.length > 0) {
            conn.release();
            return res.status(400).json('Ce nom d\'utilisateur est déjà pris');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const insertUserQuery = 'INSERT INTO clients (email, password, name) VALUES (?, ?, ?)';
        const insertUserValues = [email, hashedPassword, name];
        await conn.query(insertUserQuery, insertUserValues);
        conn.release();

        // Create a token
        const token = jwt.sign({ email, name }, process.env.API_KEY, { expiresIn: '1h' });
        res.status(201).send({ token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}



// LOGIQUE DE LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const conn = await database.getConnection();

        // On cherche le client dans la base de données
        const result = await conn.query('SELECT * FROM clients WHERE email = ? OR name = ?', [email, name]);
        conn.release();
        if (result.length === 0) {
            return res.status(400).json('Cet utilisateur n\'existe pas');
        }
        const user = result[0];

        // On compare les mots de passe hashés pour vérifier si c'est le bon
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json('Mot de passe incorrect');
        }

        // On crée un token qui dure 1h
        const token = jwt.sign({ email: user.email, name: user.name }, process.env.API_KEY, { expiresIn: '1h' });
        res.status(200).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la connexion');
    }
}

