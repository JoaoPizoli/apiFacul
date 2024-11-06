const Aluno = require('../models/Aluno');

class AlunoController {
    async create(req, res) {
        const { nome, email, password, instrumento, matricula, dataNascimento } = req.body;
        const aluno = new Aluno(nome, email, password, instrumento, matricula, dataNascimento);

        const result = await aluno.createAluno();
        return res.status(200).json(result);
    }
}

module.exports = new AlunoController();
