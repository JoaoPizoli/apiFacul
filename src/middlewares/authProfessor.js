// src/middlewares/authProfessor.js
const jwt = require('jsonwebtoken');

function authProfessor(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'secret_key');
        if (decoded.role !== 'professor') {
            return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Token inválido.' });
    }
}

module.exports = authProfessor;
