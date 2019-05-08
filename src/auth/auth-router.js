const express = require('express');
const requireAuth = require('../middleware/jwt-auth');
const LoginServices = require('../Login/LoginServices');
const AuthRouter = express.Router();

AuthRouter
  .route('/')
  .post(requireAuth, (req, res) => {
    const sub = req.user.username;
    const payload = { user_id: req.user.id };

    res.send({
      authToken: LoginServices.createJwt(sub, payload)
    });
  });

module.exports = AuthRouter;
