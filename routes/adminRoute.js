const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/add', adminController.addProduct)
router.post('/addPraticien', adminController.addPraticien);
router.delete('/praticien/:id', adminController.removePraticien);
router.delete('/product/:id', adminController.removeProduct);
router.get('/products', adminController.getProducts);

module.exports = router;