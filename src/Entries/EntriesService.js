const xss = require('xss');

const EntriesService = {

  getById(db, id) {
    return db('entries')
      .select('*')
      .where('entries.id', id)
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
  }
};

module.exports = EntriesService;