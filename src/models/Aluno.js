// src/models/Aluno.js
const Usuario = require('./Usuario');
const knex = require('../database/connection');

class Aluno extends Usuario {
    constructor(nome, email, phoneNumber, instrumento, matricula, dataNascimento) {
        super(nome, email, phoneNumber, undefined, 'aluno'); 
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

    static async getAllAlunos() {
        try {
            const alunos = await knex('alunos').select('*');
            const usuarios = await knex('usuarios').where('role', 'aluno').select('*');

            // Combinar dados de 'alunos' e 'usuarios'
            return alunos.map(aluno => {
                const usuario = usuarios.find(u => u.email === aluno.email);
                return {
                    id: aluno.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    phoneNumber: usuario.phoneNumber,
                    instrumento: aluno.instrumento,
                    matricula: aluno.matricula,
                    dataNascimento: aluno.dataNascimento
                };
            });
        } catch (err) {
            throw err;
        }
    }

    static async getAlunosByInstrumento(instrumento) {
        try {
            const alunos = await knex('alunos').where('instrumento', instrumento).select('*');
            const usuarios = await knex('usuarios').whereIn('email', alunos.map(a => a.email)).select('*');

            return alunos.map(aluno => {
                const usuario = usuarios.find(u => u.email === aluno.email);
                return {
                    id: aluno.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    phoneNumber: usuario.phoneNumber,
                    instrumento: aluno.instrumento,
                    matricula: aluno.matricula,
                    dataNascimento: aluno.dataNascimento
                };
            });
        } catch (err) {
            throw err;
        }
    }

    static async getAlunoById(id) {
        try {
            const aluno = await knex('alunos').where({ id }).first();
            if (!aluno) return null;

            const usuario = await knex('usuarios').where({ email: aluno.email }).first();
            return {
                id: aluno.id,
                nome: usuario.nome,
                email: usuario.email,
                phoneNumber: usuario.phoneNumber,
                instrumento: aluno.instrumento,
                matricula: aluno.matricula,
                dataNascimento: aluno.dataNascimento
            };
        } catch (err) {
            throw err;
        }
    }

    static async updateAluno(id, dados) {
        try {
            // Atualizar na tabela 'usuarios'
            await knex('usuarios').where({ email: dados.email }).update({
                nome: dados.nome,
                email: dados.email,
                phoneNumber: dados.phoneNumber,
                role: 'aluno'
            });

            await knex('alunos').where({ id }).update({
                instrumento: dados.instrumento,
                matricula: dados.matricula,
                dataNascimento: dados.dataNascimento
            });

            return { status: true };
        } catch (err) {
            console.error(`Erro ao atualizar aluno: ${err.message}`);
            return { status: false, err: err.message };
        }
    }

    static async deleteAluno(id) {
        try {
            // Primeiro, obter o email do aluno para deletar de 'usuarios'
            const aluno = await knex('alunos').where({ id }).first();
            if (!aluno) {
                return { status: false, message: 'Aluno não encontrado.' };
            }

            // Deletar da tabela 'alunos'
            await knex('alunos').where({ id }).del();

            // Deletar da tabela 'usuarios'
            await knex('usuarios').where({ email: aluno.email }).del();

            return { status: true };
        } catch (err) {
            console.error(`Erro ao deletar aluno: ${err.message}`);
            return { status: false, err: err.message };
        }
    }
}

module.exports = Aluno;
