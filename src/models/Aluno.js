// src/models/aluno.js
const Usuario = require('./Usuario');
const knex = require('../database/connection');

class Aluno extends Usuario {
    constructor(nome, email, phoneNumber, password, instrumento, matricula, dataNascimento) {
        super(nome, email, phoneNumber, password, 'aluno');
        this.instrumento = instrumento;
        this.matricula = matricula;
        this.dataNascimento = dataNascimento;
    }

    async createAluno() {
        const userResult = await super.createUser();
        if (!userResult.status) return userResult;

        try {
            await knex('alunos').insert({
                instrumento: this.instrumento,
                matricula: this.matricula,
                dataNascimento: this.dataNascimento,
                email: this.email
            });
            return { status: true };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }
}

module.exports = Aluno;
