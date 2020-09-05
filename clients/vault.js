const vault = require("node-vault");

class Vault {
  static options = {
    apiVersion: "v1",
    endpoint: process.env.VAULT_ADDRESS,
    token: process.env.VAULT_TOKEN,
  };

  client = null;

  constructor() {
    this.client = vault(this.options);
  }

  readPath = async (path) => {
    const { data } = await this.client.read(path);
    return data;
  };

  writeToPath = async (path, newData) => {
    await this.client.write(path, newData);
    return true;
  };
}

module.exports = Vault;
