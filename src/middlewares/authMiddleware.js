// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, 'secret_key');
        if (decoded.role !== 'admin' && decoded.role !== 'professor') {
            return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Token inválido.' });
    }
}

module.exports = authMiddleware;
