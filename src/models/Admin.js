const Usuario = require('./Usuario');
const bcrypt = require('bcryptjs');

class Admin extends Usuario {
    constructor(nome, email,phoneNumber, password) {
        super(nome, email, phoneNumber, password, 'admin', );
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

        return { status: true, user: admin };
    }
}

module.exports = Admin;
