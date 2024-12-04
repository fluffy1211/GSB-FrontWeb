const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const userRoute = require('./routes/userRoute.js');
const productsRoute = require('./routes/productsRoute.js');
const cartRoute = require('./routes/cartRoute.js');
const adminRoute = require('./routes/adminRoute.js'); 

app.use('/products', productsRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/admin', adminRoute);

app.listen(3001, () => {
    console.log(`Server started on http://localhost:3001`);
});
