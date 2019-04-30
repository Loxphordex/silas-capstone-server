const RegisterServices = {

  getById(db, id) {
    return db
      .select('*')
      .from('users')
      .where('users.id', id)
      .first();
  },
  
  insertUser(db, username, password) {

    const newUser = { username, password };

    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
      .then(user => {
        RegisterServices.getById(db, user.id);
      });

  }
};

module.exports = RegisterServices;