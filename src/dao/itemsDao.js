const DBopen = require("../ConfigDB.js");

const itemsDao = {
  async insertItems(saleId, items) {
    await DBopen.openDB().then((db) => {
      db.run("INSERT INTO items (description, sales_id) VALUES (?, ?)", [
        items.description,
        saleId,
      ]);
      db.close;
    });
  },

  async getItems() {
    return DBopen.openDB().then((db) => {
      return db.all("SELECT * FROM items").then((res) => res);
    });
  },
  async getItemsBySaleId(sale) {
    return DBopen.openDB().then((db) => {
      return db
        .all("SELECT * FROM items WHERE sales_id = ?", [sale.id])
        .then((res) => res);
    });
  },
};

module.exports = itemsDao;
