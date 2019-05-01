const bcrypt = require('bcryptjs');

const LoginServies = {
  getUserWithUsername(db, username) {
    return db('users')
      .where('username')
      .first();
  },

  comparePasswords(loginPassword, hash) {
    return bcrypt.compare(loginPassword, hash);
  }
};

module.exports = LoginServies;