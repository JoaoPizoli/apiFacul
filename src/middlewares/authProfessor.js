// src/middlewares/authProfessor.js
module.exports = function(req, res, next) {
    if (req.user.role !== 'professor') {
        return res.status(403).json({ message: 'Acesso negado. Professores somente.' });
    }
    next();
};
