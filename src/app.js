const express = require("express");
const app = express();
const routes = require("./routes/routes.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require("../src/Database/MyDatabase.js");
const cookieParser = require("cookie-parser");
const userDao = require("./dao/userDao.js");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
Database.createTable();

let users = [];

userDao.getUsers().then((res) => {
  users = res;

  const user = {
    id: "",
    user: "pedro.silva",
    name: "Pedro Silva",
    company: "Água é vida",
    cnpj: "29.674.345/0001-45",
    password: "",
  };

  if (users.length == 0 || users == null) {
    userDao.insertUser(user);
  }
});

app.use(cookieParser());
app.use(
  cors({
    origin: "http://192.168.124.35:3000",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://192.168.124.35:5000"); // Altere para o seu domínio React
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(routes);

app.listen(3000, () => {
  console.log("API Rodando, Porta: 3000");
});
