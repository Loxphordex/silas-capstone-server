const express = require('express');
const requireAuth = require('../middleware/jwt-auth');
const EntriesService = require('./EntriesService');
const EntriesRouter = express.Router();
const bodyParser = express.json();
const path = require('path');

EntriesRouter
  .route('/')
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { entry } = req.body;

    if (!entry) {
      return res.error(400).json({ error: 'Missing entry in request body' });
    }

    entry.user_id = req.user.id;

    const newEntry = {
      content: entry,
      user_id: req.user.id
    };

    EntriesService.insertEntry(req.app.get('db'), newEntry)
      .then(entry => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${entry.id}`))
          .json(entry);
      })
      .catch(next);
  });

EntriesRouter
  .route('/list')
  .get(requireAuth, (req, res, next) => {
    const id = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Missing id in request' });
    }

    EntriesService.getAllByUserId(req.app.get('db'), id)
      .then(entries => {
        res.status(201)
          .json(entries);
      })
      .catch(next);
  });

module.exports = EntriesRouter;