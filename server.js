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
const orderRoute = require('./routes/orderRoute.js');
const praticiensRoute = require('./routes/praticiensRoute.js');
const appointmentRoute = require('./routes/appointmentRoute.js');

app.use('/products', productsRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/admin', adminRoute);
app.use('/order', orderRoute);
app.use('/praticiens', praticiensRoute);
app.use('/appointment', appointmentRoute);

app.listen(3001, () => {
    console.log(`Server started on http://localhost:3001`);
});
