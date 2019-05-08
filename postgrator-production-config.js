require('dotenv').config();

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  port: process.env.PROD_MIGRATION_DB_PORT,
  database: process.env.PROD_MIGRATION_DB_NAME,
  host: process.env.PROD_MIGRATION_DB_HOST,
  username: process.env.PROD_MIGRATION_DB_USER,
  password: process.env.PROD_MIGRATION_DB_PASS,
  ssl: true,
};