// src/models/aluno.js
const Usuario = require('./Usuario');
const knex = require('../database/connection');

class Aluno extends Usuario {
    constructor(nome, email, phoneNumber, instrumento, matricula, dataNascimento) {
        super(nome, email, phoneNumber, undefined, 'aluno'); // Passa undefined para a senha
        this.instrumento = instrumento;
        this.matricula = matricula;
        this.dataNascimento = dataNascimento;
    }

    async createAluno() {
        console.log(`Iniciando criação de aluno: ${this.email}`);

        // Cria o usuário na tabela 'usuarios'
        const userResult = await super.createUser();
        if (!userResult.status) {
            console.error(`Falha na criação do usuário: ${userResult.err}`);
            return userResult;
        }

        try {
            // Insere dados específicos na tabela 'alunos'
            console.log(`Inserindo dados do aluno no banco de dados: ${this.email}`);
            await knex('alunos').insert({
                email: this.email,
                instrumento: this.instrumento,
                matricula: this.matricula,
                dataNascimento: this.dataNascimento,
            });

            console.log(`Aluno ${this.email} criado com sucesso na tabela 'alunos'.`);
            return { status: true };
        } catch (err) {
            console.error(`Erro ao inserir aluno no banco: ${err.message}`);
            return { status: false, err: err.message };
        }
    }
}

module.exports = Aluno;
