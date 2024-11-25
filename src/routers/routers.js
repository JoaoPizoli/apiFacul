// src/routers/routers.js
const express = require('express');
const AuthController = require('../controllers/authController');
const AlunoController = require('../controllers/alunoController');
const ProfessorController = require('../controllers/professorController');
const UsuarioController = require('../controllers/usuarioController'); // Verifique se este controlador existe
const authAdmin = require('../middlewares/authAdmin');
const authProfessor = require('../middlewares/authProfessor');
const auth = require('../middlewares/auth'); // Middleware geral

const router = express.Router();

// Rotas de autenticação
router.post('/admin/login', AuthController.adminLogin);
router.post('/admin/verify-code', AuthController.verifyCode);
router.post('/professor/login', AuthController.professorLogin);

// Rota para obter informações do usuário atual
router.get('/usuarios/me', auth, UsuarioController.getMe);
router.put('/usuarios/me', auth, UsuarioController.updateMe); // Linha 20

// Rotas de Alunos
router.post('/alunos', auth, AlunoController.create);
router.get('/alunos', auth, AlunoController.getAllAlunos);
router.get('/alunos/instrumento/:instrumento', auth, AlunoController.getAlunosByInstrumento);
router.get('/alunos/:id', auth, AlunoController.getAlunoById);
router.put('/alunos/:id', auth, AlunoController.updateAluno);
router.delete('/alunos/:id', auth, AlunoController.deleteAluno);

// Rotas de Professores (apenas administradores podem gerenciar professores)
router.post('/professores', authAdmin, ProfessorController.create);
router.get('/professores', authAdmin, ProfessorController.getAllProfessores);
router.get('/professores/:id', authAdmin, ProfessorController.getProfessorById);
router.put('/professores/:id', authAdmin, ProfessorController.updateProfessor);
router.delete('/professores/:id', authAdmin, ProfessorController.deleteProfessor);

// Exporta as rotas
module.exports = router;
