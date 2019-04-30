require('dotenv').config();

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  port: process.env.MIGRATION_DB_PORT,
  database: process.env.MIGRATION_DB_NAME,
  host: process.env.MIGRATION_DB_HOST,
  username: process.env.MIGRATION_DB_USER,
  password: process.env.MIGRATION_DB_PASS
};