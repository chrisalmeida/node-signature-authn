module.exports = {
  client: "pg",
  connection: {
    database: "identifi_api_dev",
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    timezone: "utc",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};
