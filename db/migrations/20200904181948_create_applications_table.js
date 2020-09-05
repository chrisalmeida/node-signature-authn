exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await knex.schema.createTable("applications", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("api_key").notNull();
    table
      .string("credentials_path")
      .notNull()
      .defaultTo(knex.raw("'secret/' || uuid_generate_v4() || '/credentials'"));
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable("applications");
};
