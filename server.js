// app.js
const express = require('express');
const db = require('./database/db.js');
const cors = require('cors');
const app = express();
const PORT = 3000;
require('dotenv').config();
app.use(cors());
app.use(express.json());

const productRoute = require('./routes/productRoute');

app.use('/products', productRoute);
app.get('/products/search', productRoute.searchProducts);

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
