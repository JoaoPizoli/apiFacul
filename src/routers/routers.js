// src/routers/routers.js
const express = require('express');
const AuthController = require('../controllers/authController');
const AlunoController = require('../controllers/alunoController');
const ProfessorController = require('../controllers/professorController');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// Rotas de autenticação
router.post('/admin/login', AuthController.create);
router.post('/admin/verify-code', AuthController.verifyCode);

// Rotas de Alunos
router.post('/alunos', authAdmin, AlunoController.create);
router.get('/alunos', authAdmin, AlunoController.getAllAlunos);
router.get('/alunos/instrumento/:instrumento', authAdmin, AlunoController.getAlunosByInstrumento);
router.get('/alunos/:id', authAdmin, AlunoController.getAlunoById);
router.put('/alunos/:id', authAdmin, AlunoController.updateAluno);
router.delete('/alunos/:id', authAdmin, AlunoController.deleteAluno);

// Rotas de Professores
router.post('/professores', authAdmin, ProfessorController.create);
router.get('/professores', authAdmin, ProfessorController.getAllProfessores);
router.get('/professores/:id', authAdmin, ProfessorController.getProfessorById);
router.put('/professores/:id', authAdmin, ProfessorController.updateProfessor);
router.delete('/professores/:id', authAdmin, ProfessorController.deleteProfessor);

// Exporta as rotas
module.exports = router;
