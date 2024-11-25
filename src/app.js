// src/server.js ou app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routers = require('./routers/routers'); 
const app = express();


const allowedOrigins = ['https://front-end-projeto-bf.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());


app.use('/', routers);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
