const DBopen = require("../ConfigDB.js");

const serviceDao = {
    async insertServices(service) {
        await DBopen.openDB().then((db) => {
            db.run(
                "INSERT INTO services (userId, customer, service, date, hour, price, avaliacao) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    service.userId,
                    service.customer,
                    service.service,
                    service.date,
                    service.hour,
                    service.price,
                    service.avaliacao,
                ]
            );
            db.close();
        });
    },

    async getServices() {
        return DBopen.openDB().then((db) => {
            return db
                .all(
                    "SELECT id, customer, service, date, hour, price, avaliacao FROM services"
                )
                .then((res) => res);
        });
    },

    async getServicesId(userId) {
        console.log(userId);
        return DBopen.openDB().then((db) =>
            db
                .all(
                    "SELECT customer, service, date, hour, price, avaliacao FROM services WHERE userId = ?",
                    [userId]
                )
                .then((res) => res)
        );
    },

    async updateServices(id, service) {
        await DBopen.openDB().then((db) => {
            return db.run(
                "UPDATE services SET customer = ?, service = ?, date = ?, hour = ?, price = ? WHERE userId = ?",
                [
                    service.customer,
                    service.service,
                    service.date,
                    service.hour,
                    service.price,
                    id,
                ]
            );
        });
    },

    async updateServiceAvaliacao(id, service) {
        await DBopen.openDB().then((db) => {
            return db.run(
                "UPDATE services SET avaliacao = ? WHERE userId = ?",
                [
                    service.avaliacao,
                    id,
                ]
            );
        });
    },

    async deleteServices(id) {
        return DBopen.openDB().then((db) => {
            return db
                .get("DELETE FROM services WHERE id = ?", [id])
                .then((res) => res);
        });
    },
};

module.exports = serviceDao;
