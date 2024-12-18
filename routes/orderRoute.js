const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.post('/create', orderController.createOrder);

module.exports = router;