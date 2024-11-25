// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routers = require('./routers/routers'); // Ajuste o caminho conforme sua estrutura
const app = express();

// Configuração de CORS
const allowedOrigins = ['https://front-end-projeto-bf.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Usar os roteadores
app.use('/', routers);

// Rota de teste (Opcional)
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
