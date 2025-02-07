const express = require('express');
const router = express.Router();
const productsController = require('../controllers/praticiensController.js');

router.get('/', productsController.getPraticiens);
router.get('/:id_praticien', productsController.getPraticien);

module.exports = router;
