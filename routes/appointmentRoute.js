const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController.js');
// Update import to use destructuring since auth now exports an object with multiple functions
const { verifyToken } = require('../middleware/auth');

// Now correctly use the verifyToken middleware
router.post('/create', verifyToken, appointmentController.createAppointment);
router.get('/list', verifyToken, appointmentController.getAppointments);
router.delete('/:id', verifyToken, appointmentController.cancelAppointment);

module.exports = router;