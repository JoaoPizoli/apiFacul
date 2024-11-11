require('dotenv').config()
const Admin = require('../models/Admin');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class AuthController {
    async create(req, res) {
        const { email, password } = req.body;
        const admin = new Admin();

        const result = await admin.login(email, password);
        if (result.status) {
            const user = result.user;

    
            const verificationCode = Math.floor(1000 + Math.random() * 9000);

            // Armazene o código no banco de dados
            await knex('verification_codes').insert({
                user_id: user.id,
                code: verificationCode,
                expires_at: new Date(Date.now() + 10 * 60000), 
            });

            // Envie o código via SMS
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

    // Método para verificar o código
    async verifyCode(req, res) {
        const { email, code } = req.body;

        // Obtenha o usuário
        const userResult = await knex('usuarios').where({ email }).first();
        if (!userResult) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        // Verifique se o código é válido
        const record = await knex('verification_codes')
            .where({ user_id: userResult.id, code })
            .andWhere('expires_at', '>', new Date())
            .first();

        if (!record) {
            return res.status(400).json({ message: 'Código de verificação inválido ou expirado.' });
        }

        // Gere o token JWT
        const token = jwt.sign({ id: userResult.id, role: userResult.role }, 'secret_key', { expiresIn: '1h' });

        // Exclua o código de verificação após o uso
        await knex('verification_codes').where({ id: record.id }).del();

        return res.status(200).json({ token });
    }
}

module.exports = new AuthController();
