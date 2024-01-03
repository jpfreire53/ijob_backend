const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

const DBopen = {
  async openDB() {
    return sqlite.open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });
  },
};
module.exports = DBopen;
