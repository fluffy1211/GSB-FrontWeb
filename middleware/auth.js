const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.API_KEY, (err, decoded) => {  // Changed JWT_SECRET to API_KEY
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded; // Attach the decoded token to the request object
        next();
    });
};

module.exports = verifyToken;
