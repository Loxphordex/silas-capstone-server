const supertest = require('supertest');
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Auth', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
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

  describe('POST /auth/login', () => {
    beforeEach('insert users', () => {
      helpers.seedUsers(db, testUsers);
    });

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = { 
        username: testUser.username,
        password: testUser.password,
      };

      it(`responds 400 when ${field} is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/auth/login')
          .send(loginAttemptBody)
          .expect({ error: `Missing ${field} in request body` });
      });
    });

    it('responds 400 invalid username or password when bad username', () => {
      const invalidUser = { username: 'Tomas', password: 'nothingHere1!' };

      return supertest(app)
        .post('/auth/login')
        .send(invalidUser)
        .expect(400, { error: 'Incorrect username or password' });
    });

    it ('responds 400 invalid username or password when bad password', () => {
      const invalidPass = { username: testUser.username, password: 'nothingHere1!' };

      return supertest(app)
        .post('/auth/login')
        .send(invalidPass)
        .expect(400, { error: 'Incorrect username or password' });
    });

    it ('responds 200 and jwt secret when valid credentials', () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password
      };

      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      );

      return supertest(app)
        .post('/auth/login')
        .send(userValidCreds)
        .expect(200, { authToken: expectedToken });
    });
  });
});