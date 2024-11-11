const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

class Usuario {
    constructor(nome, email, password, role, phoneNumber) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phoneNumber = phoneNumber;
    }

    async createUser() {
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(this.password, salt);

        try {
            await knex('usuarios').insert({
                nome: this.nome,
                email: this.email,
                role: this.role,
                password: hashedPassword,
                phoneNumber: this.phoneNumber,
            });
            return { status: true };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await knex('usuarios')
                .select(['id', 'email', 'password', 'role', 'phoneNumber'])
                .where({ email });
            return user.length > 0
                ? { status: true, user: user[0] }
                : { status: false, message: 'Usuário não encontrado' };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }
}

module.exports = Usuario;
