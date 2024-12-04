const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/add', adminController.addProduct)


module.exports = router;