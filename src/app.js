const express = require('express');
const Api = require('./api/index');
const cors = require('cors')
const globalErrorHandler = require('./handler/errorHandler')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', Api);

app.use(globalErrorHandler);

module.exports = app;
