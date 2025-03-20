const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.js');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, cartController.getCart);
router.post('/add', verifyToken, cartController.addToCart);
router.put('/update', verifyToken, cartController.updateCart);

module.exports = router;