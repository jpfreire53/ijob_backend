const DBopen = require("../ConfigDB.js");

const userDao = {
  async insertUser(user) {
    const senhaPadrao = "2276092681356";
    const hashedPassword = btoa(senhaPadrao);
    user.password = hashedPassword;
    await DBopen.openDB().then((db) => {
      db.run(
        "INSERT INTO users (user, name, company, cnpj, password) VALUES (?, ?, ?, ?, ?)",
        [user.user, user.name, user.company, user.cnpj, user.password]
      );
      db.close();
    });
  },

  async getUsers() {
    return DBopen.openDB().then((db) => {
      return db
        .all("SELECT id, user, name, company, cnpj FROM users")
        .then((res) => res);
    });
  },

  async getUsersWithPassword() {
    return DBopen.openDB().then((db) => {
      return db
        .all("SELECT id, user, name, company, cnpj, password FROM users")
        .then((res) => res);
    });
  },

  async getUserId(id) {
    return DBopen.openDB().then((db) =>
      db
        .all("SELECT user, name, company, cnpj FROM users WHERE id = " + id)
        .then((res) => res)
    );
  },

  async updateUser(user) {
    await DBopen.openDB().then((db) => {
      return db.run(
        "UPDATE users SET user = ?, name = ?, company = ?, cnpj = ? WHERE id = ?",
        [user.user, user.name, user.company, user.cnpj, user.id]
      );
    });
  },

  async updatePassword(user) {
    await DBopen.openDB().then((db) => {
      return db.run("UPDATE users SET password = ? WHERE id = ? ", [
        user.password,
        user.id,
      ]);
    });
  },

  async deleteUser(user) {
    return DBopen.openDB().then((db) => {
      return db.get("DELETE FROM users WHERE id = ?", [user.id]);
    });
  },
};

module.exports = userDao;
