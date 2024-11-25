// src/routers/routers.js
const express = require('express');
const AuthController = require('../controllers/authController');
const AlunoController = require('../controllers/alunoController');
const ProfessorController = require('../controllers/professorController');
const authMiddleware = require('../middlewares/authMiddleware'); // Atualizado para novo middleware

const router = express.Router();

// Rotas de autenticação
router.post('/admin/login', AuthController.create);
router.post('/admin/verify-code', AuthController.verifyCode);
router.post('/professor/login', AuthController.professorLogin); // **Nova Rota para Professor Login**


// Rotas de Alunos
router.post('/alunos', authMiddleware, AlunoController.create);
router.get('/alunos', authMiddleware, AlunoController.getAllAlunos);
router.get('/alunos/instrumento/:instrumento', authMiddleware, AlunoController.getAlunosByInstrumento);
router.get('/alunos/:id', authMiddleware, AlunoController.getAlunoById);
router.put('/alunos/:id', authMiddleware, AlunoController.updateAluno);
router.delete('/alunos/:id', authMiddleware, AlunoController.deleteAluno);

// Rotas de Professores
router.post('/professores', authMiddleware, ProfessorController.create);
router.get('/professores', authMiddleware, ProfessorController.getAllProfessores);
router.get('/professores/:id', authMiddleware, ProfessorController.getProfessorById);
router.put('/professores/:id', authMiddleware, ProfessorController.updateProfessor);
router.delete('/professores/:id', authMiddleware, ProfessorController.deleteProfessor);

// Rotas de Usuário
const UsuarioController = require('../controllers/usuarioController');
router.get('/usuarios/me', authMiddleware, UsuarioController.getMe);
router.put('/usuarios/me', authMiddleware, UsuarioController.updateMe);

// Exporta as rotas
module.exports = router;
