const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');
const { verifyToken } = require('../middleware/auth');

router.post('/create', verifyToken, orderController.createOrder);

module.exports = router;