const userModel = require("../models/userModel.js");
const userDao = require("../dao/userDao.js");
const jwt = require("jsonwebtoken");
const SECRET = "750139581985";
const authMiddleware = require("../services/authMiddleware.js");

const useControler = {
  async criarUsuario(req, res) {
    try {
      const user = new userModel(req.body);
      const alluser = await userDao.getUsers();

      if (
        user.user == null ||
        user.user == "" ||
        user.name == null ||
        user.name == "" ||
        user.company == null ||
        user.company == "" ||
        user.cnpj == "" ||
        user.cnpj == null
      ) {
        res.status(400).json({ message: "Há campos em branco.", type: "e" });
      } else {
        if (alluser == undefined || alluser.length == 0) {
          await userDao.insertUser(user);
          res
            .status(201)
            .json({ message: "Usuário criado com sucesso.", type: "s" });
        } else {
          let isInsert = false;
          for (var i = 0; i < alluser.length; i++) {
            if (alluser[i].user == user.user) {
              isInsert = true;
            }
          }

          if (!isInsert) {
            await userDao.insertUser(user);
            res
              .status(201)
              .json({ message: "Usuário criado com sucesso.", type: "s" });
          } else {
            res.status(409).json({
              message: "Já existe um usuário cadastrado com esses dados",
              type: "e",
            });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário.", type: "e" });
    }
  },

  async listarUsuarios(req, res) {
    try {
      const users = await userDao.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar usuários.", type: "e" });
    }
  },

  async listaUsuarioPorId(req, res) {
    try {
      const { id } = req.params;

      const user = await userDao.getUserId(id);
      res.json(user);
    } catch (e) {
      res.status(400).json({ erro: "Erro ao recuperar usuários: ", type: "e" });
    }
  },

  async editarUsuario(req, res) {
    try {
      const { id } = req.params;

      const updatedUser = new userModel(req.body);

      const allUsers = await userDao.getUsers();

      const userToEdit = allUsers.find((user) => user.id == id);

      if (!userToEdit) {
        res.status(404).json({ message: "Usuário não encontrado.", type: "e" });
      } else {
        userToEdit.user = updatedUser.user;
        userToEdit.name = updatedUser.name;
        userToEdit.company = updatedUser.company;
        userToEdit.cnpj = updatedUser.cnpj;

        await userDao.updateUser(userToEdit);

        res
          .status(200)
          .json({ message: "Usuário editado com sucesso.", type: "s" });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao editar usuário.", type: "e" });
    }
  },

  async deletarUsuario(req, res) {
    try {
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds)) {
        res.status(400).json({
          message: "IDs de usuários ausentes ou em formato inválido.",
          type: "e",
        });
        return;
      }

      const allUsers = await userDao.getUsers();
      const usersToDelete = allUsers.filter((user) =>
        userIds.includes(user.id)
      );

      if (usersToDelete.length !== userIds.length) {
        res.status(404).json({
          message: "Um ou mais usuários não foram encontrados.",
          type: "e",
        });
      } else {
        await Promise.all(
          usersToDelete.map((user) => userDao.deleteUser(user))
        );
        res.status(200).json({
          message: "Usuário(s) excluído(s) com sucesso.",
          type: "s",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao excluir o(s) usuário(s).", type: "e" });
    }
  },

  async loginUsuario(req, res) {
    try {
      if (!req.body) {
        res
          .status(400)
          .json({ message: "Corpo da solicitação vazio.", type: "e" });
        return;
      }

      const { user, password } = req.body;
      if (!user || !password) {
        res
          .status(400)
          .json({ message: "Usuário e senha são obrigatórios.", type: "e" });
        return;
      }

      const hashedPassword = btoa(password);
      const allUsers = await userDao.getUsersWithPassword();
      const loginUser = allUsers.find(
        (u) => u.user == user && u.password == hashedPassword
      );

      if (!loginUser) {
        res
          .status(401)
          .json({ message: "Usuário ou senha inválidos.", type: "e" });
        return;
      }

      const token = jwt.sign({ userId: loginUser.id }, SECRET, {
        expiresIn: "1h",
      });

      const expirationTime = 3600000;

      setTimeout(() => {
        res.status(401).json({
          message: "Sessão expirada! Faça o Login novamente.",
          type: "e",
        });
      }, expirationTime);

      res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

      res.status(200).json({ message: "Login bem-sucedido", token, type: "s" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer login.", type: "e" });
    }
  },

  async resetarSenha(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res
          .status(400)
          .json({ message: "Nova senha não fornecida", type: "e" });
      }

      const allUsers = await userDao.getUsers();
      const userToResetPassword = allUsers.find((user) => user.id == id);

      if (!userToResetPassword) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado", type: "e" });
      }

      userToResetPassword.password = newPassword;
      await userDao.updatePassword(userToResetPassword);

      res
        .status(200)
        .json({ message: "Senha resetada com sucesso", type: "s" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao resetar a senha", type: "e" });
    }
  },
};

module.exports = useControler;
