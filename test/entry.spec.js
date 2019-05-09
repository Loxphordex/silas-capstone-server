const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Entry', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testEntries = helpers.makeEntriesArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  //before('cleanup', () => helpers.cleanTables(db));
  //afterEach('cleanup', () => helpers.cleanTables(db));
  after('disconnect from db', () => db.destroy());

  describe.only('POST /auth/entry', () => {
    const entry = { 
      title: 'NewStuff', 
      content: 'New ideas for old people.',
      user_id: 1
    };

    it('returns 200 when user submits entry', () => {
      return supertest(app)
        .post('/auth/entry')
        .set('authorization', helpers.makeAuthHeader(testUser))
        .send({ entry })
        .expect(201);
    });
  });
});