// src/controllers/authController.js
require('dotenv').config();
const Admin = require('../models/Admin');
const Professor = require('../models/Professor'); // Importar o modelo Professor
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

const client = twilio('AC26cf7ef55783bfe552f453e751ec6a5c', '84e9788fe1987ec62f1ae97178ffe7e8');

class AuthController {
    // Método existente para login de admin com verificação SMS
    async create(req, res) {
        const { email, password } = req.body;
        const admin = new Admin(); 

        const result = await admin.login(email, password);
        if (result.status) {
            const user = result.user;

            const verificationCode = Math.floor(1000 + Math.random() * 9000);

            await knex('verification_codes').insert({
                user_id: user.id,
                code: verificationCode,
                expires_at: new Date(Date.now() + 10 * 60000), // Código expira em 10 minutos
            });

            try {
                await client.messages.create({
                    body: `Seu código de verificação é: ${verificationCode}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: user.phoneNumber,
                });

                return res.status(200).json({ message: 'Código de verificação enviado.' });
            } catch (error) {
                console.error('Erro ao enviar SMS:', error);
                return res.status(500).json({ message: 'Erro ao enviar o código de verificação.' });
            }
        } else {
            return res.status(401).json({ message: result.message });
        }
    }

    // Método existente para verificar o código de SMS
    async verifyCode(req, res) {
        const { email, code } = req.body;

        // Obter o usuário
        const userResult = await knex('usuarios').where({ email }).first();
        if (!userResult) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        const record = await knex('verification_codes')
            .where({ user_id: userResult.id, code })
            .andWhere('expires_at', '>', new Date())
            .first();

        if (!record) {
            return res.status(400).json({ message: 'Código de verificação inválido ou expirado.' });
        }

        const token = jwt.sign({ id: userResult.id, role: userResult.role }, 'secret_key', { expiresIn: '1h' });

        await knex('verification_codes').where({ id: record.id }).del();

        return res.status(200).json({ token });
    }

    // **Novo Método para Login de Professores**
    async professorLogin(req, res) {
        const { email, password } = req.body;
        const professor = new Professor();

        const userResult = await professor.findUserByEmail(email);
        if (!userResult.status) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        const isMatch = bcrypt.compareSync(password, userResult.user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: userResult.user.id, role: userResult.user.role }, 'secret_key', { expiresIn: '1h' });

        return res.status(200).json({ token });
    }
}

module.exports = new AuthController();
