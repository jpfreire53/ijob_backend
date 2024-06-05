const express = require("express");
const app = express();
const routes = require("./routes/routes.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require("../src/Database/MyDatabase.js");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
Database.createTable();

app.use(cookieParser());
app.use(cors());

app.use(routes);

app.listen(3000, () => {
    console.log("API Rodando, Porta: 3000");
});
