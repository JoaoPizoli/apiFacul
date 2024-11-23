// src/controllers/alunoController.js
const Aluno = require('../models/Aluno');

class AlunoController {
    async create(req, res) {
        console.log('Recebendo requisição para criar aluno');
        const { nome, email, phoneNumber, instrumento, matricula, dataNascimento } = req.body;

        // Log dos dados recebidos
        console.log(`Dados recebidos: nome=${nome}, email=${email}, phoneNumber=${phoneNumber}, instrumento=${instrumento}, matricula=${matricula}, dataNascimento=${dataNascimento}`);

        const aluno = new Aluno(nome, email, phoneNumber, instrumento, matricula, dataNascimento);

        const result = await aluno.createAluno();

        if (result.status) {
            console.log(`Aluno ${email} criado com sucesso.`);
            return res.status(201).json({ message: 'Aluno criado com sucesso.' });
        } else {
            console.error(`Erro ao criar aluno: ${result.err}`);
            return res.status(400).json({ message: result.message || 'Erro ao criar aluno.', error: result.err });
        }
    }
}

module.exports = new AlunoController();
