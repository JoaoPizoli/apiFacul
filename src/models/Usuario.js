const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

class Usuario {
    constructor(nome, email, password, role) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    async createUser() {
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(this.password, salt);
        
        try {
            await knex.insert({
                nome: this.nome,
                email: this.email,
                role: this.role,
                password: hashedPassword
            }).table('usuarios');
            return { status: true };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await knex.select(['email', 'password', 'role']).where({ email }).table('usuarios');
            return user.length > 0 ? { status: true, user: user[0] } : { status: false, message: 'Usuário não encontrado' };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }
}

module.exports = Usuario;
