const express = require("express");
const cookieParser = require("cookie-parser");

const serviceController = require("../controller/serviceController");

const router = express.Router();

router.use(cookieParser());

router.post("/registrar", serviceController.criarServiço);
router.get("/listar", serviceController.listarServiços);
router.get("/listar/:id", serviceController.listarServiçoPorId);
router.put("/editar/:id", serviceController.editarServiço);
router.put("/avaliar/:id", serviceController.avaliarServico);
router.delete("/deletar/:id", serviceController.deletarServiço);

module.exports = router;
