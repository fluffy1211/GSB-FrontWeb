const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const userRoute = require('./routes/userRoute.js');

app.use('/user', userRoute);

app.listen(3001, () => {
    console.log(`Server started on http://localhost:3001`);
});
