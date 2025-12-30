const dotEnv=require('dotenv');
dotEnv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');     
const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors());     


// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.all(/.*/, (req, res) => {
    res.status(404).send({ message: `Route ${req.originalUrl} not found.` });
});

module.exports = app;