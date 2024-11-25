// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'secret_key'; // Substituído de process.env.SECRET_KEY para 'secret_key'

function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, secretKey);
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
