const Vault = require("../../clients/vault");

exports.seed = async (knex) => {
  const applications = [
    { api_key: "1234" },
    { api_key: "5678" },
    { api_key: "1111" },
  ];

  await knex("applications").del();
  // Create new applications and return autogenerated vault credential paths.
  const newApplications = await knex("applications")
    .insert(applications)
    .returning("credentials_path");

  // Insert "secret" in each credential path within Vault
  const vault = new Vault();
  await Promise.all(
    newApplications.map(async (credentials_path) => {
      await vault.writeToPath(credentials_path, { secret: "secret" });
    })
  );
};