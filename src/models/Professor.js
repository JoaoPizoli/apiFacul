// src/models/Professor.js
const Usuario = require('./Usuario');
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');

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

    async login(email, password) {
        const userResult = await this.findUserByEmail(email);
    
        if (!userResult.status) return userResult;
        const professor = userResult.user;
        if (professor.role !== 'professor') {
            return { status: false, message: 'Acesso negado. Não é professor.' };
        }

        const isMatch = bcrypt.compareSync(password, professor.password);
        console.log(`Senha corresponde: ${isMatch}`);

        if (!isMatch) {
            return { status: false, message: 'Senha incorreta' };
        }

        return { status: true, user: professor };
    }

    static async getAllProfessores() {
        try {
            const professores = await knex('professores').select('*');
            const usuarios = await knex('usuarios').where('role', 'professor').select('*');

            // Combinar dados de 'professores' e 'usuarios'
            return professores.map(professor => {
                const usuario = usuarios.find(u => u.email === professor.email);
                return {
                    id: professor.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    phoneNumber: usuario.phoneNumber,
                    areaAtuacao: professor.areaAtuacao
                };
            });
        } catch (err) {
            throw err;
        }
    }

    static async getProfessorById(id) {
        try {
            const professor = await knex('professores').where({ id }).first();
            if (!professor) return null;

            const usuario = await knex('usuarios').where({ email: professor.email }).first();
            return {
                id: professor.id,
                nome: usuario.nome,
                email: usuario.email,
                phoneNumber: usuario.phoneNumber,
                areaAtuacao: professor.areaAtuacao
            };
        } catch (err) {
            throw err;
        }
    }

    static async updateProfessor(id, dados) {
        try {
            // Atualizar na tabela 'usuarios'
            if (dados.password) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(dados.password, salt);
                dados.password = hashedPassword;
            }

            await knex('usuarios').where({ email: dados.email }).update({
                nome: dados.nome,
                email: dados.email,
                phoneNumber: dados.phoneNumber,
                password: dados.password || knex.raw('password'), // Atualiza se houver nova senha
                role: 'professor'
            });

            // Atualizar na tabela 'professores'
            await knex('professores').where({ id }).update({
                areaAtuacao: dados.areaAtuacao
            });

            return { status: true };
        } catch (err) {
            console.error(`Erro ao atualizar professor: ${err.message}`);
            return { status: false, err: err.message };
        }
    }

    static async deleteProfessor(id) {
        try {
            // Primeiro, obter o email do professor para deletar de 'usuarios'
            const professor = await knex('professores').where({ id }).first();
            if (!professor) {
                return { status: false, message: 'Professor não encontrado.' };
            }

            // Deletar da tabela 'professores'
            await knex('professores').where({ id }).del();

            // Deletar da tabela 'usuarios'
            await knex('usuarios').where({ email: professor.email }).del();

            return { status: true };
        } catch (err) {
            console.error(`Erro ao deletar professor: ${err.message}`);
            return { status: false, err: err.message };
        }
    }
}

module.exports = Professor;
