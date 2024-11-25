// src/models/Usuario.js
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

class Usuario {
    constructor(nome, email, phoneNumber, password, role) {
        this.nome = nome;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password; 
        this.role = role;
    }

    async createUser() {
        try {
            console.log(`Criando usuário: ${this.email}`);

            if (this.password) {
                console.log(`Senha recebida: ${this.password}`);
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(this.password, salt);
                this.password = hashedPassword;
            } else {
                this.password = null; // Ou você pode optar por uma string vazia ''
            }

            await knex('usuarios').insert({
                nome: this.nome,
                email: this.email,
                phoneNumber: this.phoneNumber,
                password: this.password, // Hash da senha ou null
                role: this.role
            });

            console.log(`Usuário ${this.email} criado com sucesso.`);
            return { status: true };
        } catch (err) {
            console.error(`Erro ao criar usuário: ${err.message}`);
            return { status: false, err: err.message };
        }
    }

    async findUserByEmail(email) {
        try {
            console.log(`Procurando usuário pelo email: ${email}`);
            const user = await knex('usuarios')
                .select(['id', 'email', 'phoneNumber', 'password', 'role'])
                .where({ email: email });

            console.log(`Usuário encontrado: ${JSON.stringify(user)}`);

            return user.length > 0
                ? { status: true, user: user[0] }
                : { status: false, message: 'Usuário não encontrado' };
        } catch (err) {
            console.error(`Erro ao buscar usuário: ${err.message}`);
            return { status: false, err: err.message };
        }
    }

    async findUserByRole(role) {
        try {
            const user = await knex('usuarios')
                .select(['id', 'email', 'phoneNumber', 'password', 'role'])
                .where({ role: role });
            return user.length > 0
                ? { status: true, user: user[0] }
                : { status: false, message: 'Usuário não encontrado' };
        } catch (err) {
            console.error(`Erro ao buscar usuário: ${err.message}`);
            return { status: false, err: err.message };
        }
    }
}

module.exports = Usuario;
