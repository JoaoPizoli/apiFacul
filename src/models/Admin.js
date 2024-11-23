// src/models/Admin.js
const Usuario = require('./Usuario');
const bcrypt = require('bcryptjs');

class Admin extends Usuario {
    constructor(nome = '', email = '', phoneNumber = '', password = '') {
        super(nome, email, phoneNumber, password, 'admin');
    }

    async login(email, password) {
        console.log(`Tentando fazer login para o email: ${email}`);
        const userResult = await this.findUserByEmail(email);
        console.log('Resultado da busca do usuário:', userResult);

        if (!userResult.status) return userResult;
        const admin = userResult.user;

        console.log(`Papel do usuário encontrado: ${admin.role}`);

        if (admin.role !== 'admin') {
            return { status: false, message: 'Acesso negado. Não é admin.' };
        }

        const isMatch = bcrypt.compareSync(password, admin.password);
        console.log(`Senha corresponde: ${isMatch}`);

        if (!isMatch) {
            return { status: false, message: 'Senha incorreta' };
        }

        return { status: true, user: admin };
    }
}

module.exports = Admin;
