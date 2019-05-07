const express = require('express');
const LoginServices = require('./LoginServices');
const LoginRouter = express.Router();
const bodyParser = express.json();

LoginRouter
  .route('/')
  .post(bodyParser, (req, res, next) => {
    
    const { username, password } = req.body;
    const userCreds = { username, password };

    for (const [key, value] of Object.entries(userCreds)) {
      if (!value) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    LoginServices.getUserWithUsername(req.app.get('db'), userCreds.username)
      .then(dbUser => {

        if (!dbUser) {
          return res.status(400).json({
            error: 'Incorrect username or password'
          });
        }

        return LoginServices.comparePasswords(userCreds.password, dbUser.password)
          .then(match => {
            if (!match) {
              return res.status(400).json({
                error: 'Incorrect username or password'
              });
            }

            const sub = dbUser.username;
            const payload = { user_id: dbUser.id };
            res.send({
              authToken: LoginServices.createJwt(sub, payload),
            });
          });
      })
      .catch(next);
  });

module.exports = LoginRouter;