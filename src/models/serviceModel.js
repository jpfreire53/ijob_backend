class serviceModel {
    constructor(service) {
        this.id = service.id;
        this.userId = service.userId;
        this.customer = service.customer;
        this.service = service.service;
        this.date = service.date;
		this.hour = service.hour;
        this.price = service.price;
    }
}

module.exports = serviceModel;

