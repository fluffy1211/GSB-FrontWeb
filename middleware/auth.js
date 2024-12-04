const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send('Access denied.');
    }

    try {
        const decoded = jwt.verify(token, process.env.API_KEY);
        if (decoded.role !== 'admin') {
            return res.status(403).send('Access denied.');
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = verifyAdmin;

