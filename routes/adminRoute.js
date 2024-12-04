const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/auth');

router.get('/admin', verifyAdmin, (req, res) => {
    res.send('Welcome to the admin page.');
});

module.exports = router;