const express = require('express');
const RegisterServices = require('./RegisterServices');
const path = require('path');
const RegisterRouter = express.Router();
const bodyParser = express.json();

// Register a new user
RegisterRouter
  .route('/')
  .post(bodyParser, (req, res, next) => {

    // Grab the credentials from the request body,
    // assign them to a new object
    const { username, password } = req.body;
    const newUser = { username, password };

    // Check for both username and password
    for (const [key, value] of Object.entries(newUser)) {
      if (!value) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        });
      }
    }

    // Check if password meets requirements
    const passwordError = RegisterServices.validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    // Check if username is already taken
    // If not, encrypt the password
    // and insert the new user
    RegisterServices.hasUserWithUsername(req.app.get('db'), username)
      .then(userExists => {
        if (userExists) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        // Encrypt password
        return RegisterServices.hashPassword(password)
          .then(hashedPassword => {
            // Create a new user object with the encrypted password
            const newUser = {
              username,
              password: hashedPassword,
              date_created: 'now()',
            };

            // Insert the new user
            RegisterServices.insertUser(req.app.get('db'), newUser)
              .then(user => {
                console.log(user);
                res.status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(RegisterServices.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

module.exports = RegisterRouter;