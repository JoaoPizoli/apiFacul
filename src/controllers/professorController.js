// src/controllers/professorController.js
const Professor = require('../models/Professor');

class ProfessorController {
    async create(req, res) {
        const { nome, email, phoneNumber, password, areaAtuacao } = req.body;
        const professor = new Professor(nome, email, phoneNumber, password, areaAtuacao);

        const result = await professor.createProfessor();

        if (result.status) {
            return res.status(201).json({ message: 'Professor criado com sucesso.' });
        } else {
            return res.status(400).json({ message: result.message || 'Erro ao criar professor.', error: result.err });
        }
    }
}

module.exports = new ProfessorController();
