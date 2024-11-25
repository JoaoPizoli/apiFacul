// src/controllers/alunoController.js
const Aluno = require('../models/Aluno');

class AlunoController {
    async create(req, res) {
        console.log('Recebendo requisição para criar aluno');
        const { nome, email, phoneNumber, instrumento, matricula, dataNascimento } = req.body;

        // Log dos dados recebidos
        console.log(`Dados recebidos: nome=${nome}, email=${email}, phoneNumber=${phoneNumber}, instrumento=${instrumento}, matricula=${matricula}, dataNascimento=${dataNascimento}`);

        // Determine o professor que está criando o aluno
        let professorId = null;
        if (req.user.role === 'professor') {
            professorId = req.user.id; // Assume que o ID do professor está no token
        }

        const aluno = new Aluno(nome, email, phoneNumber, instrumento, matricula, dataNascimento, professorId);

        const result = await aluno.createAluno();

        if (result.status) {
            console.log(`Aluno ${email} criado com sucesso.`);
            return res.status(201).json({ message: 'Aluno criado com sucesso.' });
        } else {
            console.error(`Erro ao criar aluno: ${result.err}`);
            return res.status(400).json({ message: result.message || 'Erro ao criar aluno.', error: result.err });
        }
    }

    async getAllAlunos(req, res) {
        try {
            let alunos;
            if (req.user.role === 'admin') {
                alunos = await Aluno.getAllAlunos();
            } else if (req.user.role === 'professor') {
                alunos = await Aluno.getAlunosByProfessorId(req.user.id);
            }

            return res.status(200).json(alunos);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            return res.status(500).json({ message: 'Erro ao buscar alunos.' });
        }
    }

    async getAlunosByInstrumento(req, res) {
        const { instrumento } = req.params;
        try {
            let alunos;
            if (req.user.role === 'admin') {
                alunos = await Aluno.getAlunosByInstrumento(instrumento);
            } else if (req.user.role === 'professor') {
                alunos = await Aluno.getAlunosByInstrumentoAndProfessor(instrumento, req.user.id);
            }

            return res.status(200).json(alunos);
        } catch (error) {
            console.error('Erro ao buscar alunos por instrumento:', error);
            return res.status(500).json({ message: 'Erro ao buscar alunos por instrumento.' });
        }
    }

    async getAlunoById(req, res) {
        const { id } = req.params;
        try {
            const aluno = await Aluno.getAlunoById(id);
            if (aluno) {
                if (req.user.role === 'admin' || (req.user.role === 'professor' && aluno.professor_id === req.user.id)) {
                    return res.status(200).json(aluno);
                } else {
                    return res.status(403).json({ message: 'Acesso negado.' });
                }
            } else {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            return res.status(500).json({ message: 'Erro ao buscar aluno.' });
        }
    }

    async updateAluno(req, res) {
        const { id } = req.params;
        const { nome, email, phoneNumber, instrumento, matricula, dataNascimento } = req.body;

        try {
            const aluno = await Aluno.getAlunoById(id);
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            if (req.user.role === 'admin' || (req.user.role === 'professor' && aluno.professor_id === req.user.id)) {
                const result = await Aluno.updateAluno(id, { nome, email, phoneNumber, instrumento, matricula, dataNascimento });
                if (result.status) {
                    return res.status(200).json({ message: 'Aluno atualizado com sucesso.' });
                } else {
                    return res.status(400).json({ message: result.message || 'Erro ao atualizar aluno.', error: result.err });
                }
            } else {
                return res.status(403).json({ message: 'Acesso negado.' });
            }
        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            return res.status(500).json({ message: 'Erro ao atualizar aluno.' });
        }
    }

    async deleteAluno(req, res) {
        const { id } = req.params;
        try {
            const aluno = await Aluno.getAlunoById(id);
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            if (req.user.role === 'admin' || (req.user.role === 'professor' && aluno.professor_id === req.user.id)) {
                const result = await Aluno.deleteAluno(id);
                if (result.status) {
                    return res.status(200).json({ message: 'Aluno deletado com sucesso.' });
                } else {
                    return res.status(400).json({ message: result.message || 'Erro ao deletar aluno.', error: result.err });
                }
            } else {
                return res.status(403).json({ message: 'Acesso negado.' });
            }
        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            return res.status(500).json({ message: 'Erro ao deletar aluno.' });
        }
    }
}

module.exports = new AlunoController();
