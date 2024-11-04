// app.js
const express = require('express');
const db = require('./database/db.js');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

const userRoute = require('./routes/userRoute.js');

app.use('/user', userRoute);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});
