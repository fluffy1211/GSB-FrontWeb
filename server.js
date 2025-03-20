const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de journalisation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Body:', req.body);
  }
  next();
});

// Admin page protection middleware - must come before static file serving
app.get('/admin.html', (req, res, next) => {
    const cookieHeader = req.headers['cookie'];
    let token = null;
    
    // Try to get token from cookie
    if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
        if (jwtCookie) {
            token = jwtCookie.split('=')[1];
        }
    }
    
    if (!token) {
        return res.redirect('/login.html');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.API_KEY);
        if (decoded.role !== 'admin') {
            return res.redirect('/');
        }
        next();
    } catch (err) {
        return res.redirect('/login.html');
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Routes
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

app.listen(3001, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:3001`);
});

module.exports = app;