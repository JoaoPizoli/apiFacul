require('dotenv').config()
const express = require('express');
const router = require('./routers/routers');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(router); 

app.use(cors({
    origin:'https://front-end-projeto-bf.vercel.app/',
  }));

app.listen(8080, () => {
    console.log('API rodando!');
});
