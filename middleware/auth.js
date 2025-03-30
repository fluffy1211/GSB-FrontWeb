const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }

    const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"
    if (!token) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }

    jwt.verify(token, process.env.API_KEY, (err, decoded) => {  // Changé JWT_SECRET en API_KEY
        if (err) {
            return res.status(403).json({ error: 'Échec d\'authentification du token' });
        }
        req.user = decoded; // Attacher le token décodé à l'objet requête
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }

    const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"
    if (!token) {
        return res.status(401).json({ error: 'Aucun token fourni' });
    }

    jwt.verify(token, process.env.API_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Échec d\'authentification du token' });
        }
        
        // Vérifier si l'utilisateur a le rôle admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Accès administrateur requis' });
        }
        
        req.user = decoded; // Attacher le token décodé à l'objet requête
        next();
    });
};

const protectAdminPage = (req, res, next) => {
    const cookieHeader = req.headers['cookie'];
    let token = null;
    
    // Essayer de récupérer le token du cookie
    if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
        if (jwtCookie) {
            token = jwtCookie.split('=')[1];
        }
    }
    
    if (!token) {
        return res.redirect('/login.html');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.API_KEY);
        if (decoded.role !== 'admin') {
            return res.redirect('/');
        }
        next();
    } catch (err) {
        return res.redirect('/login.html');
    }
};

module.exports = { verifyToken, verifyAdmin, protectAdminPage };
