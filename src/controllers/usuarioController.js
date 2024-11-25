// src/controllers/usuarioController.js
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

class UsuarioController {
    // Método para obter informações do usuário atual
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

    // Método para atualizar informações do usuário atual
    async updateMe(req, res) {
        const { nome, email, phoneNumber, password } = req.body;
        try {
            // Preparar os dados para atualização
            const updateData = {};
            if (nome) updateData.nome = nome;
            if (email) updateData.email = email;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                updateData.password = hashedPassword;
            }

            // Atualizar na tabela 'usuarios'
            await knex('usuarios').where({ id: req.user.id }).update(updateData);

            return res.status(200).json({ message: 'Informações atualizadas com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar informações do usuário:', error);
            return res.status(500).json({ message: 'Erro ao atualizar informações do usuário.' });
        }
    }
}

module.exports = new UsuarioController();
