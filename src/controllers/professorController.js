// src/controllers/professorController.js
const Professor = require('../models/Professor');

class ProfessorController {
    async create(req, res) {
        // Seu código existente para criar professor
    }

    async getAllProfessores(req, res) {
        try {
            const professores = await Professor.getAllProfessores();
            return res.status(200).json(professores);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
            return res.status(500).json({ message: 'Erro ao buscar professores.' });
        }
    }

    async getProfessorById(req, res) {
        const { id } = req.params;
        try {
            const professor = await Professor.getProfessorById(id);
            if (professor) {
                return res.status(200).json(professor);
            } else {
                return res.status(404).json({ message: 'Professor não encontrado.' });
            }
        } catch (error) {
            console.error('Erro ao buscar professor:', error);
            return res.status(500).json({ message: 'Erro ao buscar professor.' });
        }
    }

    async updateProfessor(req, res) {
        const { id } = req.params;
        const { nome, email, phoneNumber, password, areaAtuacao } = req.body;

        try {
            const result = await Professor.updateProfessor(id, { nome, email, phoneNumber, password, areaAtuacao });
            if (result.status) {
                return res.status(200).json({ message: 'Professor atualizado com sucesso.' });
            } else {
                return res.status(400).json({ message: result.message || 'Erro ao atualizar professor.', error: result.err });
            }
        } catch (error) {
            console.error('Erro ao atualizar professor:', error);
            return res.status(500).json({ message: 'Erro ao atualizar professor.' });
        }
    }

    async deleteProfessor(req, res) {
        const { id } = req.params;
        try {
            const result = await Professor.deleteProfessor(id);
            if (result.status) {
                return res.status(200).json({ message: 'Professor deletado com sucesso.' });
            } else {
                return res.status(400).json({ message: result.message || 'Erro ao deletar professor.', error: result.err });
            }
        } catch (error) {
            console.error('Erro ao deletar professor:', error);
            return res.status(500).json({ message: 'Erro ao deletar professor.' });
        }
    }
}

module.exports = new ProfessorController();
