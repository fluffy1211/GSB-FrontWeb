const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);

// SEARCH BAR
router.get('/search', productController.searchProducts);

module.exports = router;