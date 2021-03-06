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
      return res.status(400).json({ error: 'Missing entry in request body' });
    }

    entry.user_id = req.user.id;

    const newEntry = {
      title: entry.title,
      content: entry.content,
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
        if (!entries) {
          return res.status(200).json();
        }
        res.status(200)
          .json(entries);
      })
      .catch(next);
  });

EntriesRouter
  .route('/:id')
  .get(requireAuth, (req, res, next) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'Missing id in request' });
    }

    EntriesService.getById(req.app.get('db'), id)
      .then(entry => {
        res.status(200)
          .json(entry);
      })
      .catch(next);
  });

EntriesRouter
  .route('/:entry_id')
  .delete(requireAuth, (req, res, next) => {
    const entry_id = req.params.entry_id;

    if (!entry_id) {
      return res.status(400).json({ error: 'Entry ID not specified' });
    }

    EntriesService.deleteById(req.app.get('db'), entry_id)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(next);
  });

EntriesRouter
  .route('/:entry_id')
  .patch(requireAuth, bodyParser, (req, res, next) => {
    const entry_id = req.params.entry_id;
    const { entry } = req.body;

    if (!entry_id) {
      return res.status(400).json({ error: 'Entry ID not specified' });
    }

    if (!entry) {
      return res.status(400).json({ error: 'No entry in request body' });
    }

    EntriesService.patchById(req.app.get('db'), entry_id, entry)
      .then(entry => {
        return res.status(201).json(entry);
      })
      .catch(next);
  });

module.exports = EntriesRouter;