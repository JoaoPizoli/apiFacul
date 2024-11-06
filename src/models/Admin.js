const Usuario = require('./Usuario');
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Admin extends Usuario {
    constructor(nome, email, password) {
        super(nome, email, password, 'admin');
    }

    async login(email, password) {
        const userResult = await this.findUserByEmail(email);
        if (!userResult.status) return userResult;
        const admin = userResult.user;

        if (admin.role !== 'admin') {
            return { status: false, message: 'Acesso negado. Não é admin.' };
        }

        const isMatch = bcrypt.compareSync(password, admin.password);
        if (!isMatch) {
            return { status: false, message: 'Senha incorreta' };
        }

        const token = jwt.sign({ id: admin.idUsuario, role: admin.role }, 'secret_key', { expiresIn: '1h' });
        return { status: true, token };
    }
}

module.exports = Admin;
