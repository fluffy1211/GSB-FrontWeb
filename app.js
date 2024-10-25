// app.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());

// Données des produits pharmaceutiques
const produits = [
    {
        id: 1,
        nom: 'Doliprane 500mg',
        description: 'Un analgésique courant utilisé pour traiter la douleur légère à modérée.',
        prix: 3.50,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        nom: 'Ibuprofène 200mg',
        description: 'Anti-inflammatoire utilisé pour réduire la douleur, l’inflammation et la fièvre.',
        prix: 4.20,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 3,
        nom: 'Vitamine C',
        description: 'Un complément alimentaire qui aide à renforcer le système immunitaire.',
        prix: 2.00,
        image: 'https://via.placeholder.com/150'
    }
];

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Endpoint pour obtenir la liste des produits
app.get('/api/produits', (req, res) => {
    res.json(produits);
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
