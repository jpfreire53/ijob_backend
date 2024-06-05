const express = require("express");
const cookieParser = require("cookie-parser");

const serviceController = require("../controller/serviceController");

const router = express.Router();

router.use(cookieParser());

router.post("/registrar", serviceController.criarServiço);
router.get("/listar", serviceController.listarServiços);
router.get("/listar/:id", serviceController.listarServiçoPorId);

module.exports = router;
