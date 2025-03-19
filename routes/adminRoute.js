const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/add', adminController.addProduct)
router.post('/addPraticien', adminController.addPraticien);
router.delete('/praticien/:id', adminController.removePraticien);

module.exports = router;