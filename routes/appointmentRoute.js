const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController.js');
const verifyToken = require('../middleware/auth.js');

// Add verifyToken middleware to protect these routes
router.post('/create', verifyToken, appointmentController.createAppointment);
router.get('/', verifyToken, appointmentController.getAppointments);
router.delete('/:id', verifyToken, appointmentController.cancelAppointment);

module.exports = router;