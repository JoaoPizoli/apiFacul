const Usuario = require('./Usuario');
const knex = require('../database/connection');

class Aluno extends Usuario {
    constructor(nome, email, password, instrumento, matricula, dataNascimento) {
        super(nome, email, password, 'aluno');
        this.instrumento = instrumento;
        this.matricula = matricula;
        this.dataNascimento = dataNascimento;
    }

    async createAluno() {
        const userResult = await super.createUser();
        if (!userResult.status) return userResult;

        try {
            await knex.insert({
                instrumento: this.instrumento,
                matricula: this.matricula,
                dataNascimento: this.dataNascimento,
                email: this.email
            }).table('alunos');
            return { status: true };
        } catch (err) {
            return { status: false, err: err.message };
        }
    }
}

module.exports = Aluno;
