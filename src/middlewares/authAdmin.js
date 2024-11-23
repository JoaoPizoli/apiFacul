const jwt = require('jsonwebtoken');

function authAdmin(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'secret_key');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Token inválido.' });
    }
}

module.exports = authAdmin;
