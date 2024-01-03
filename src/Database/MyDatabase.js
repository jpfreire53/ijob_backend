const DBopen = require("../ConfigDB.js");

const Database = {
  async createTable() {
    return DBopen.openDB().then((db) => {
      db.exec(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, user TEXT, name TEXT, company TEXT, cnpj TEXT, password TEXT)"
      );
      db.exec(
        "CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY, name TEXT, cpf TEXT, email TEXT, value DECIMAL(10,2), moneyChange DECIMAL(10,2))"
      );
      db.exec(
        "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, description TEXT, sales_id INTEGER NOT NULL , FOREIGN KEY(sales_id) REFERENCES sales(id))"
      );
      db.close();
    });
  },

  async dropTable() {
    return DBopen.openDB().then((db) => {
      db.exec("DROP TABLE IF EXISTS users");
      db.exec("DROP TABLE IF EXISTS sales");
      db.exec("DROP TABLE IF EXISTS items ");
      db.close();
    });
  },
};

module.exports = Database;
