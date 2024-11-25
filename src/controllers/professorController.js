// src/controllers/professorController.js
const knex = require('../database/connection');
const bcrypt = require('bcryptjs');
const INSTRUMENTOS = require('../constants').INSTRUMENTOS;

class ProfessorController {
    // Método para criar professor
    async create(req, res) {
        const { nome, email, password, areaAtuacao } = req.body;

        // Validação da área de atuação
        if (!INSTRUMENTOS.includes(areaAtuacao)) {
            return res.status(400).json({ message: `Área de atuação inválida. Opções disponíveis: ${INSTRUMENTOS.join(', ')}` });
        }

        try {
            // Verifique se o email já está registrado
            const existingUser = await knex('usuarios').where({ email }).first();
            if (existingUser) {
                return res.status(400).json({ message: 'Email já está registrado.' });
            }

            // Crie o usuário na tabela 'usuarios'
            const hashedPassword = bcrypt.hashSync(password, 10);
            const [userId] = await knex('usuarios').insert({
                nome,
                email,
                phoneNumber: '', // ou outro campo se aplicável
                password: hashedPassword,
                role: 'professor',
            }).returning('id');

            // Crie o professor na tabela 'professores'
            await knex('professores').insert({
                areaAtuacao,
                email: email,
                // outros campos se necessário
            });

            return res.status(201).json({ message: 'Professor criado com sucesso.' });
        } catch (error) {
            console.error('Erro ao criar professor:', error);
            return res.status(500).json({ message: 'Erro interno ao criar professor.' });
        }
    }

    // Método para atualizar professor
    async updateProfessor(req, res) {
        const { id } = req.params;
        const { nome, email, phoneNumber, areaAtuacao, password } = req.body;

        // Validação da área de atuação
        if (areaAtuacao && !INSTRUMENTOS.includes(areaAtuacao)) {
            return res.status(400).json({ message: `Área de atuação inválida. Opções disponíveis: ${INSTRUMENTOS.join(', ')}` });
        }

        try {
            const professor = await knex('professores').where({ id }).first();
            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            // Atualize na tabela 'usuarios'
            const updateData = {};
            if (nome) updateData.nome = nome;
            if (email) updateData.email = email;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                updateData.password = hashedPassword;
            }

            await knex('usuarios').where({ email: professor.email }).update(updateData);

            // Atualize na tabela 'professores'
            await knex('professores').where({ id }).update({
                areaAtuacao: areaAtuacao || professor.areaAtuacao,
                email: email || professor.email,
                // outros campos se necessário
            });

            return res.status(200).json({ message: 'Professor atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar professor:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar professor.' });
        }
    }

    // Método para obter todos os professores
    async getAllProfessores(req, res) {
        try {
            const professores = await knex('professores');
            return res.status(200).json(professores);
        } catch (error) {
            console.error('Erro ao obter professores:', error);
            return res.status(500).json({ message: 'Erro interno ao obter professores.' });
        }
    }

    // Método para obter professor por ID
    async getProfessorById(req, res) {
        const { id } = req.params;

        try {
            const professor = await knex('professores').where({ id }).first();
            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            return res.status(200).json(professor);
        } catch (error) {
            console.error('Erro ao obter professor por ID:', error);
            return res.status(500).json({ message: 'Erro interno ao obter professor.' });
        }
    }

    // Método para deletar professor
    async deleteProfessor(req, res) {
        const { id } = req.params;

        try {
            const professor = await knex('professores').where({ id }).first();
            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }

            // Deletar o professor
            await knex('professores').where({ id }).del();

            // Deletar o usuário correspondente
            await knex('usuarios').where({ email: professor.email }).del();

            return res.status(200).json({ message: 'Professor deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar professor:', error);
            return res.status(500).json({ message: 'Erro interno ao deletar professor.' });
        }
    }
}

module.exports = new ProfessorController();
