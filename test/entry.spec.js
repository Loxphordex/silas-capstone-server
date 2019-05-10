const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');

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

  describe('POST /auth/entry', () => {
    const entry = { 
      title: 'NewStuff', 
      content: 'New ideas for old people.',
      user_id: 1
    };

    context('Given an XSS attack entry', () => {
      const evilUser = testUsers[1];
      const {
        maliciousEntry,
        expectedEntry,
      } = helpers.makeMaliciousEntry(evilUser);

      beforeEach('insert malicious article', () => {
        return helpers.seedMaliciousEntry(db, evilUser, maliciousEntry);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/auth/entry')
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedEntry.title);
            expect(res.body[0].content).to.eql(expectedEntry.content);
          });
      });
    });

    it('returns 200 when user submits entry', () => {
      return supertest(app)
        .post('/auth/entry')
        .set('authorization', helpers.makeAuthHeader(testUser))
        .send({ entry })
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.title).to.eql(entry.title);
          expect(res.body.content).to.eql(entry.content);
          expect(res.body.user_id).to.eql(entry.user_id);
          expect(res.headers.location).to.eql(`/auth/entry/${res.body.id}`);
        })
        .expect(res => {
          db.from('entries')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.title).to.eql(entry.title);
              expect(row.content).to.eql(entry.content);
              expect(row.user_id).to.eql(entry.user_id);
            });
        });
    });
  });

  describe('GET /auth/entry/list', () => {
    it('returns 201 and an array when valid user && populated', () => {
      return supertest(app)
        .get('/auth/entry/list')
        .set('authorization', helpers.makeAuthHeader(testUser))
        .expect(201);
    });
  });
});