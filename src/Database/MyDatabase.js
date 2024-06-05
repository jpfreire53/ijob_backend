const DBopen = require("../ConfigDB.js");

const Database = {
	async createTable() {
		return DBopen.openDB().then((db) => {
			db.exec(
				"CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY, userId INTEGER, customer TEXT, service TEXT, date TEXT, hour TEXT, price TEXT)"
			);
			db.close();
		});
	},

	async dropTable() {
		return DBopen.openDB().then((db) => {
			db.exec("DROP TABLE IF EXISTS services");
			db.close();
		});
	},
};

module.exports = Database;
