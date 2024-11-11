require('dotenv').config();

const express = require('express');
const router = require('./routers/routers');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'https://front-end-projeto-bf.vercel.app',
}));

app.use(express.json());
app.use(router);

app.listen(22, '0.0.0.0', () => {
  console.log('API rodando na porta 22');
});
