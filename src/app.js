// src/app.js
require('dotenv').config();

const express = require('express');
const router = require('./routers/routers');
const cors = require('cors');

const app = express();

app.use(cors())

app.use(express.json());
app.use(router);

app.listen(8080, '0.0.0.0', () => {
  console.log('API rodando na porta 8080');
});
