// routers/routers.js
const express = require('express');
const AuthController = require('../controllers/authController');
const AlunoController = require('../controllers/alunoController');
const ProfessorController = require('../controllers/professorController');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();

// Rota para iniciar o login e enviar o código de verificação
router.post('/admin/login', AuthController.create);

// Nova rota para verificar o código de verificação
router.post('/admin/verify-code', AuthController.verifyCode);

// Rotas protegidas
router.post('/alunos', authAdmin, AlunoController.create);
router.post('/professores', authAdmin, ProfessorController.create);

module.exports = router;
