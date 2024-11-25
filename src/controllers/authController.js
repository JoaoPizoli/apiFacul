// src/controllers/authController.js
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { INSTRUMENTOS } = require('../constants');
const twilio = require('twilio');

// Configurações do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Chave secreta para JWT
const secretKey = process.env.SECRET_KEY;

class AuthController {
    // Login de administrador
    async adminLogin(req, res) {
        const { email, password } = req.body;

        try {
            const user = await knex('usuarios').where({ email, role: 'admin' }).first();
            if (!user) {
                return res.status(400).json({ message: 'Credenciais inválidas.' });
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Credenciais inválidas.' });
            }

            // Enviar código de verificação via SMS
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

            // Salvar o código de verificação no banco de dados ou em cache
            // Aqui está uma abordagem simplificada usando um campo temporário
            await knex('usuarios').where({ id: user.id }).update({ verification_code: verificationCode });

            await client.messages.create({
                body: `Seu código de verificação é: ${verificationCode}`,
                from: twilioPhoneNumber,
                to: user.phoneNumber
            });

            return res.status(200).json({ message: 'Código de verificação enviado via SMS.' });
        } catch (error) {
            console.error('Erro no login do administrador:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    // Verificar código de administrador
    async verifyCode(req, res) {
        const { email, code } = req.body;

        try {
            const user = await knex('usuarios').where({ email, role: 'admin' }).first();
            if (!user) {
                return res.status(400).json({ message: 'Usuário não encontrado.' });
            }

            if (user.verification_code !== code) {
                return res.status(400).json({ message: 'Código de verificação inválido.' });
            }

            // Remover o código de verificação após a verificação
            await knex('usuarios').where({ id: user.id }).update({ verification_code: null });

            // Gerar token JWT
            const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

            return res.status(200).json({ token, message: 'Login bem-sucedido.' });
        } catch (error) {
            console.error('Erro ao verificar código:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    // Login de professor
    async professorLogin(req, res) {
        const { email, password } = req.body;

        try {
            const user = await knex('usuarios').where({ email, role: 'professor' }).first();
            if (!user) {
                return res.status(400).json({ message: 'Credenciais inválidas.' });
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Credenciais inválidas.' });
            }

            // Gerar token JWT
            const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

            return res.status(200).json({ token, message: 'Login bem-sucedido.' });
        } catch (error) {
            console.error('Erro no login do professor:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }
}

module.exports = new AuthController();
