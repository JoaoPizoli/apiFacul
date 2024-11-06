require('dotenv').config()
const express = require('express');
const router = require('./routers/routers');

const app = express();

app.use(express.json()); 
app.use(router); 

app.listen(8080, () => {
    console.log('API rodando!');
});
