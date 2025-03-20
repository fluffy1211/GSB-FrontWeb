const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { verifyAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(verifyAdmin);

router.post('/add', adminController.addProduct);
router.post('/addPraticien', adminController.addPraticien);
router.delete('/praticien/:id', adminController.removePraticien);
router.delete('/product/:id', adminController.removeProduct);

module.exports = router;