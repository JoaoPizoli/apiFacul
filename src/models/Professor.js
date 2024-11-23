// src/models/Professor.js
const Usuario = require('./Usuario');
const knex = require('../database/connection');

class Professor extends Usuario {
    constructor(nome, email, phoneNumber, password, areaAtuacao) {
        super(nome, email, phoneNumber, password, 'professor');
        this.areaAtuacao = areaAtuacao;
    }

    async createProfessor() {
        const userResult = await super.createUser();
        if (!userResult.status) return userResult;

        try {
            await knex('professores').insert({
                areaAtuacao: this.areaAtuacao,
                email: this.email
            });
            return { status: true };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }
}

module.exports = Professor;
