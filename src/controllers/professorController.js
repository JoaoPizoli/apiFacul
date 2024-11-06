const Professor = require('../models/professor');

class ProfessorController {
    async create(req, res) {
        const { nome, email, password, areaAtuacao } = req.body;
        const professor = new Professor(nome, email, password, areaAtuacao);

        const result = await professor.createProfessor();
        return res.status(200).json(result);
    }

}

module.exports = new ProfessorController();
