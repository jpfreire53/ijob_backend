const DBopen = require("../ConfigDB.js");

const serviceDao = {
	async insertServices(service) {
		await DBopen.openDB().then((db) => {
			db.run("INSERT INTO services (userId, customer, service, date, hour, price) VALUES (?, ?, ?, ?, ?, ?)", [
				service.userId,
				service.customer,
				service.service,
				service.date,
				service.hour,
				service.price,
			]);
			db.close();
		});
	},

	async getServices() {
		return DBopen.openDB().then((db) => {
			return db.all("SELECT id, customer, service, date, hour, price FROM services").then((res) => res);
		});
	},

	async getServicesId(userId) {
		console.log(userId)
		return DBopen.openDB().then((db) =>
			db.all("SELECT customer, service, date, hour, price FROM services WHERE userId = ?", [
				userId
			]).then((res) => res)
		);
	},

	async updateServices(id, employee) {
		await DBopen.openDB().then((db) => {
			return db.run("UPDATE services SET customer = ?, service = ?, date = ?, hour = ?, price = ? WHERE userId = ?", [
				employee.customer,
				employee.service,
				employee.date,
				employee.hour,
				employee.price,
				id,
			]);
		});
	},

	async deleteServices(id) {
		return DBopen.openDB().then((db) => {
			return db.get("DELETE FROM services WHERE id = ?", [id]);
		});
	},
};

module.exports = serviceDao;
