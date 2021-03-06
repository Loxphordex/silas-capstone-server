require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const RegisterRouter = require('./Registration/RegisterRouter');
const LoginRouter = require('./Login/LoginRouter');
const AuthRouter = require('./auth/auth-router');
const EntriesRouter = require('./Entries/EntriesRouter');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/users', RegisterRouter);
app.use('/auth/entry', EntriesRouter);
app.use('/auth/login', LoginRouter);
app.use('/auth/refresh', AuthRouter);
app.get('/test', (req, res) => {
  res.json({ message: 'Test' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!'});
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: {message: 'server error' }};
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;