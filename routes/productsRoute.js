const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController.js');

router.get('/', productsController.getProducts);
router.get('/:id_product', productsController.getProduct);

module.exports = router;
