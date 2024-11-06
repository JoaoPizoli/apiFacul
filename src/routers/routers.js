const express = require('express');
const AuthController = require('../controllers/authController');
const AlunoController = require('../controllers/alunoController');
const ProfessorController = require('../controllers/professorController');
const authAdmin = require('../middlewares/authAdmin');

const router = express.Router();


router.post('/admin/login', AuthController.create);


router.post('/alunos', authAdmin, AlunoController.create); 
router.post('/professores', authAdmin, ProfessorController.create); 

module.exports = router;
