const DBopen = require("../ConfigDB.js");

const salesDao = {
  async insertSales(sales) {
    await DBopen.openDB().then((db) => {
      db.run(
        "INSERT INTO sales (name, cpf, email, value, moneyChange) VALUES (?, ?, ?, ?, ?)",
        [sales.name, sales.cpf, sales.email, sales.value, sales.moneyChange]
      );
    });
  },
  async getSales() {
    return DBopen.openDB().then((db) => {
      return db.all("SELECT * FROM sales").then((res) => res);
    });
  },
  async deleteSale(sales) {
    return DBopen.openDB().then((db) => {
      return db.get("DELETE FROM sales WHERE id = ?", [sales.id]);
    });
  },

  async getSalesById(id) {
    return DBopen.openDB().then((db) => {
      return db
        .get("SELECT * FROM sales WHERE id = ?", [id])
        .then((res) => res);
    });
  },
  async getLastSale() {
    return DBopen.openDB().then((db) => {
      return db
        .all("SELECT * FROM sales ORDER BY id DESC LIMIT 1")
        .then((res) => res);
    });
  },
};

module.exports = salesDao;
