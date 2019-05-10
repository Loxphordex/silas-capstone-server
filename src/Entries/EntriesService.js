const xss = require('xss');

const EntriesService = {

  getById(db, id) {
    return db('entries')
      .select('*')
      .where('entries.id', id)
      .first();
  },

  getUserbyId(id) {
    return db('users')
      .select('*')
      .where('users.id', id)
      .first();
  },

  getAllByUserId(db, id) {
    return db('entries')
      .select('*')
      .where('entries.user_id', id);
  },

  insertEntry(db, newEntry) {
    return db
      .insert(newEntry)
      .into('entries')
      .returning('*')
      .then(([entry]) => entry)
      .then(entry => EntriesService.getById(db, entry.id));
  },

  serializeEntry(entry) {
    const user = EntriesService.getUserbyId(entry.user_id);
    return {
      id: entry.id,
      title: xss(entry.title),
      content: xss(entry.content),
      user_id: entry.user_id,
      date_created: new Date(entry.date_created),
      user: {
        id: user.id,
        username: user.username,
      }
    };
  }
};

module.exports = EntriesService;