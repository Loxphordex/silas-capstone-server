const express = require('express');
const LoginService = require('./LoginServices');
const LoginRouter = express.Router();
const bodyParser = express.json();

LoginRouter
  .route('/')
  .post(bodyParser, (req, res, next) => {
    
    const { username, password } = req.body;
    const userCreds = { username, password };

    console.log(req.body);
    console.log(username, password);

    for (const [key, value] of Object.entries(userCreds)) {
      if (!value) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    console.log('testing');

    LoginService.getUserWithUsername(req.app.get('db'), userCreds.username)
      .then(dbUser => {



        if (!dbUser) {
          return res.status(400).json({
            error: 'Incorrect username or password'
          });
        }

        return LoginService.comparePasswords(userCreds.password, dbUser.password)
          .then(match => {
            console.log(match);
            if (!match) {
              return res.status(400).json({
                error: 'Incorrect username or password'
              });
            }

            const sub = dbUser.username;
            const payload = { user_id: dbUser.id };
            console.log(sub, payload);
            res.send({
              authToken: LoginService.createJwt(sub, payload),
            });
          });
      })
      .catch(next);
  });

module.exports = LoginRouter;