const express = require('express');
const RegisterServices = require('./RegisterServices');
const RegisterRouter = express.Router();
const bodyParser = express.json();

RegisterRouter
  .route('/')
  .post(bodyParser, (req, res, next) => {

    const { username, password } = req.body;
    const newUser = { username, password };

    for (const [key, value] of Object.entries(newUser)) {
      if (!value) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    RegisterServices.insertUser(req.app.get('db'), username, password)
      .then(user => {
        res.json(user);
      });
  });

module.exports = RegisterRouter;