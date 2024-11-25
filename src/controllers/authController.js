// src/controllers/authController.js
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Configurações do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Chave secreta para JWT
const secretKey = process.env.SECRET_KEY;

// Tempo de validade do código de verificação (em minutos)
const CODE_VALIDITY_MINUTES = 10;

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

            // Gerar código de verificação de 6 dígitos
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Calcular o horário de expiração do código
            const expiresAt = new Date(Date.now() + CODE_VALIDITY_MINUTES * 60000); // 10 minutos à frente

            // Salvar o código de verificação na tabela 'verification_codes'
            await knex('verification_codes').insert({
                user_id: user.id,
                code: verificationCode,
                expires_at: expiresAt
            });

            // Enviar o código via SMS usando Twilio
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

            // Buscar o código de verificação na tabela 'verification_codes'
            const verificationEntry = await knex('verification_codes')
                .where({ user_id: user.id, code })
                .first();

            if (!verificationEntry) {
                return res.status(400).json({ message: 'Código de verificação inválido.' });
            }

            // Verificar se o código não expirou
            const agora = new Date();
            const expiresAt = new Date(verificationEntry.expires_at);
            if (agora > expiresAt) {
                // Remover o código expirado
                await knex('verification_codes').where({ id: verificationEntry.id }).del();
                return res.status(400).json({ message: 'Código de verificação expirado.' });
            }

            // Remover o código de verificação após a verificação
            await knex('verification_codes').where({ id: verificationEntry.id }).del();

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
