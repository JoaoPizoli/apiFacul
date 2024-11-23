// src/controllers/alunoController.js
const Aluno = require('../models/Aluno');

class AlunoController {
    async create(req, res) {
        const { nome, email, phoneNumber, password, instrumento, matricula, dataNascimento } = req.body;
        const aluno = new Aluno(nome, email, phoneNumber, password, instrumento, matricula, dataNascimento);

        const result = await aluno.createAluno();

        if (result.status) {
            return res.status(201).json({ message: 'Aluno criado com sucesso.' });
        } else {
            return res.status(400).json({ message: result.message || 'Erro ao criar aluno.', error: result.err });
        }
    }
}

module.exports = new AlunoController();
