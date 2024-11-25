// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const secretKey = 'secret_key'; // Substituído de process.env.SECRET_KEY para 'secret_key'

module.exports = function(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};
