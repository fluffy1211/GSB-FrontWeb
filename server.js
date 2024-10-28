// app.js
const express = require('express');
const db = require('./database/db.js');
const cors = require('cors');
const app = express();
const productRoute = require('./routes/productRoute');
require('dotenv').config();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/products', productRoute);
// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
