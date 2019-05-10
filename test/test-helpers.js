const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
  return db.transaction(trx => {
    trx.raw(`TRUNCATE users, entries`)
      .then(() => 
        Promise.all([
          trx.raw('ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1'),
          trx.raw(`ALTER SEQUENCE entries_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('entries_id_seq', 0)`),
        ])
      );
  });
}

function makeUsersArray() {
  return [
    {
      id: 1, 
      username: 'firstTester',
      password: 'Schkept1!ck',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },

    {
      id: 2,
      username: 'boild_skrmsher',
      password: 'Temp0rar7',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },

    {
      id: 3,
      username: 'hndi-tmrik',
      password: 'ex6sSS!!!',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    }
  ];
}

function makeEntriesArray() {
  return [
    {
      id: 1,
      title: 'Excellent',
      content: 'This is the paragraph I am choosing, nothing can stop me.',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      user_id: 2
    },

    {
      id: 2,
      title: 'Trial',
      content: 'This is the trial I am choosing, anything could call me.',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      user_id: 1
    },

    {
      id: 3,
      title: 'This Idea',
      content: 'The paragraph this is, if not for nothing, is ending here.',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      user_id: 2
    }
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function makeAuthHeader(user, secret=process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });

  return `Bearer ${token}`;
}

function makeExpectedEntry(users, entry) {
  const user = users.find(author => author.id === entry.user_id)

  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date_created: entry.date_created.toISOString(),
    user: {
      id: user.id,
      username: user.username,
    }
  }
}

function makeMaliciousEntry(user) {
  const maliciousEntry = {
    id: 911,
    title: '<script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id,
    date_created: new Date(),
  }
  const expectedEntry = {
    ...makeExpectedEntry([user], maliciousEntry),
    title: '&lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousEntry,
    expectedEntry,
  }
}

function seedMaliciousEntry(db, user, entry) {
  return seedUsers(db, [user])
    .then(() => 
      db.into('entries')
        .insert([entry])
    )
}

module.exports = {
  cleanTables,
  makeUsersArray,
  makeEntriesArray,
  seedUsers,
  makeAuthHeader,
  makeExpectedEntry,
  makeMaliciousEntry,
  seedMaliciousEntry,
};