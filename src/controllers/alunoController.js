// src/controllers/alunoController.js
const knex = require('../database/connection');
const INSTRUMENTOS = require('../constants').INSTRUMENTOS;

class AlunoController {
    // Método para criar aluno
    async create(req, res) {
        const { nome, email, phoneNumber, instrumento, matricula, dataNascimento } = req.body;

        // Validação do instrumento
        if (!INSTRUMENTOS.includes(instrumento)) {
            return res.status(400).json({ message: `Instrumento inválido. Opções disponíveis: ${INSTRUMENTOS.join(', ')}` });
        }

        try {
            // Verifique se o email já está registrado
            const existingUser = await knex('usuarios').where({ email }).first();
            if (existingUser) {
                return res.status(400).json({ message: 'Email já está registrado.' });
            }

            // Crie o usuário na tabela 'usuarios'
            const hashedPassword = bcrypt.hashSync('defaultPassword', 10); // Define uma senha padrão ou gere uma
            const [userId] = await knex('usuarios').insert({
                nome,
                email,
                phoneNumber,
                password: hashedPassword,
                role: 'aluno',
            }).returning('id');

            // Crie o aluno na tabela 'alunos'
            await knex('alunos').insert({
                nome,
                email,
                phoneNumber,
                instrumento,
                matricula,
                dataNascimento,
                professor_id: req.user.role === 'professor' ? req.user.id : null, // Associe ao professor se for o caso
            });

            return res.status(201).json({ message: 'Aluno criado com sucesso.' });
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
            return res.status(500).json({ message: 'Erro interno ao criar aluno.' });
        }
    }

    // Método para atualizar aluno
    async updateAluno(req, res) {
        const { id } = req.params;
        const { nome, email, phoneNumber, instrumento, matricula, dataNascimento } = req.body;

        // Validação do instrumento
        if (instrumento && !INSTRUMENTOS.includes(instrumento)) {
            return res.status(400).json({ message: `Instrumento inválido. Opções disponíveis: ${INSTRUMENTOS.join(', ')}` });
        }

        try {
            const aluno = await knex('alunos').where({ id }).first();
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            // Verifique permissões (admin pode editar qualquer aluno, professor apenas seus alunos)
            if (req.user.role === 'professor' && aluno.professor_id !== req.user.id) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            // Atualize os dados
            await knex('alunos').where({ id }).update({
                nome: nome || aluno.nome,
                email: email || aluno.email,
                phoneNumber: phoneNumber || aluno.phoneNumber,
                instrumento: instrumento || aluno.instrumento,
                matricula: matricula || aluno.matricula,
                dataNascimento: dataNascimento || aluno.dataNascimento,
            });

            return res.status(200).json({ message: 'Aluno atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar aluno.' });
        }
    }

    // Método para obter todos os alunos
    async getAllAlunos(req, res) {
        try {
            let alunos;
            if (req.user.role === 'professor') {
                alunos = await knex('alunos').where({ professor_id: req.user.id });
            } else {
                alunos = await knex('alunos');
            }
            return res.status(200).json(alunos);
        } catch (error) {
            console.error('Erro ao obter alunos:', error);
            return res.status(500).json({ message: 'Erro interno ao obter alunos.' });
        }
    }

    // Método para obter alunos por instrumento
    async getAlunosByInstrumento(req, res) {
        const { instrumento } = req.params;

        // Validação do instrumento
        if (!INSTRUMENTOS.includes(instrumento)) {
            return res.status(400).json({ message: `Instrumento inválido. Opções disponíveis: ${INSTRUMENTOS.join(', ')}` });
        }

        try {
            let alunos;
            if (req.user.role === 'professor') {
                alunos = await knex('alunos').where({ instrumento, professor_id: req.user.id });
            } else {
                alunos = await knex('alunos').where({ instrumento });
            }
            return res.status(200).json(alunos);
        } catch (error) {
            console.error('Erro ao obter alunos por instrumento:', error);
            return res.status(500).json({ message: 'Erro interno ao obter alunos por instrumento.' });
        }
    }

    // Método para obter aluno por ID
    async getAlunoById(req, res) {
        const { id } = req.params;

        try {
            const aluno = await knex('alunos').where({ id }).first();
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            // Verifique permissões
            if (req.user.role === 'professor' && aluno.professor_id !== req.user.id) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            return res.status(200).json(aluno);
        } catch (error) {
            console.error('Erro ao obter aluno por ID:', error);
            return res.status(500).json({ message: 'Erro interno ao obter aluno.' });
        }
    }

    // Método para deletar aluno
    async deleteAluno(req, res) {
        const { id } = req.params;

        try {
            const aluno = await knex('alunos').where({ id }).first();
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }

            // Verifique permissões
            if (req.user.role === 'professor' && aluno.professor_id !== req.user.id) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            await knex('alunos').where({ id }).del();

            return res.status(200).json({ message: 'Aluno deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            return res.status(500).json({ message: 'Erro interno ao deletar aluno.' });
        }
    }
}

module.exports = new AlunoController();
