const serviceModel = require("../models/serviceModel");
const serviceDao = require("../dao/serviceDao");

const employeeController = {
	async criarServiço(req, res) {
		try {
			const service = new serviceModel(req.body);
			await serviceDao.insertServices(service);
			console.log(service)
			res.status(200).json({ message: "Serviço registrado com sucesso.", type: "s" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao criar o serviço.", type: "e" });
		}
	},

	async listarServiços(req, res) {
		try {
			const services = await serviceDao.getServices();
			res.json(services);
		} catch (error) {
			res.status(500).json({ error: "Erro ao listar os serviços.", type: "e" });
		}
	},

	async listarServiçoPorId(req, res) {
		try {
			const { id } = req.params;

			const service = await serviceDao.getServicesId(id);
			res.json(service);
		} catch (e) {
			res.status(400).json({ erro: "Erro ao recuperar o serviço: ", type: "e" });
		}
	},

	async editarServiço(req, res) {
		try {
			const { id } = req.params;
			const serviçoAtualizado = new serviceModel(req.body);

			await serviceDao.updateServices(id, serviçoAtualizado);
			res.status(200).json({ message: "serviço editado com sucesso.", type: "s" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao editar o serviço.", type: "e" });
		}
	},

	async avaliarServico(req, res) {
		try {
			const { id } = req.params;
			const serviçoAtualizado = new serviceModel(req.body);

			await serviceDao.updateServiceAvaliacao(id, serviçoAtualizado);
			res.status(200).json({ message: "serviço avaliado com sucesso.", type: "s" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao avaliar o serviço.", type: "e" });
		}
	},

	async deletarServiço(req, res) {
		try {
			const { serviceId } = req.params.id;

			await serviceDao.deleteServices(serviceId);
			res.status(200).json({ message: "serviço excluído com sucesso.", type: "s" });
		} catch (error) {
			res.status(500).json({ error: "Erro ao excluir o serviço.", type: "e" });
		}
	},
};

module.exports = employeeController;
