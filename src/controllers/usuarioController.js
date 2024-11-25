// src/controllers/usuarioController.js
const knex = require('../database/connection');

class UsuarioController {
    async getMe(req, res) {
        try {
            const user = await knex('usuarios').where({ id: req.user.id }).first();
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json({
                id: user.id,
                nome: user.nome,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            });
        } catch (error) {
            console.error('Erro ao obter informações do usuário:', error);
            return res.status(500).json({ message: 'Erro ao obter informações do usuário.' });
        }
    }
}

module.exports = new UsuarioController();
