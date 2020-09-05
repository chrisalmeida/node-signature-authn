const dbConfig = require("../knexfile"),
  knex = require("knex")(dbConfig);

const findApplicationByAPIKey = async (api_key) => {
  return await knex("applications")
    .where({ api_key })
    .select("credentials_path", "id")
    .first();
};

module.exports = { findApplicationByAPIKey };
