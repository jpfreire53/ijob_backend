const salesModel = require("../models/salesModel.js");
const salesDao = require("../dao/salesDao.js");
const itemsDao = require("../dao/itemsDao.js");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");

const salesControler = {
  async registrarVenda(req, res) {
    try {
      console.log(req.body);
      const sales = new salesModel(req.body.salesModel);
      console.log(sales);
      const items = req.body.items;
      console.log(items);
      const allsales = await salesDao.getSales();
      if (
        sales.name == null ||
        sales.name == "" ||
        sales.cpf == null ||
        sales.cpf == "" ||
        sales.email == null ||
        sales.email == "" ||
        sales.value == "" ||
        sales.value == null
      ) {
        res.status(400).json({ message: "Há campos em branco.", type: "e" });
      } else {
        if (allsales == undefined || allsales.length == 0) {
          await salesDao.insertSales(sales);
          const lastSale = await salesDao.getLastSale();

          for (var i = 0; i < items.length; i++) {
            await itemsDao.insertItems(lastSale[0], items[i]);
          }

          res
            .status(201)
            .json({ message: "Venda registrada com sucesso.", type: "s" });
        } else {
          await salesDao.insertSales(sales);
          const lastSale = await salesDao.getLastSale();

          for (var i = 0; i < items.length; i++) {
            await itemsDao.insertItems(lastSale[0], items[i]);
          }
          res
            .status(201)
            .json({ message: "Venda criada com sucesso.", type: "s" });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar a venda.", type: "e" });
    }
  },
  async listarVendas(req, res) {
    try {
      const sales = await salesDao.getSales();
      const salesWithItems = [];

      for (const sale of sales) {
        let items = await itemsDao.getItemsBySaleId(sale);

        salesWithItems.push({
          sale: sale,
          items: items,
        });
      }

      res.json({ sales: salesWithItems });
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar as vendas.", type: "e" });
    }
  },
  async enviarEmailVenda(req, res) {
    try {
      const { id } = req.params;
      const sales = await salesDao.getSalesById(id);
      const saleModel = sales[0];

      const formattedValue = (saleModel.value / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const emailBody = `
        <h2>Dados da Venda</h2>
        <p>Nome: ${saleModel.name}</p>
        <p>CPF: ${saleModel.cpf}</p>
        <p>Email: ${saleModel.email}</p>
        <p>Valor: ${formattedValue}</p>
      `;

      const pdfBuffer = await new Promise((resolve, reject) => {
        pdf.create(emailBody).toBuffer((err, buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        });
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "luisandreclaudio@gmail.com",
          pass: "Luisandreclaudio@3",
        },
      });

      const mailOptions = {
        from: "SALES BUDDY <COMPROVANTE DE VENDA>",
        to: saleModel.email,
        subject: "Detalhes da Venda",
        attachments: [
          {
            filename: "Detalhes_da_Venda.pdf",
            content: pdfBuffer,
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .json({ message: "E-mail enviado com sucesso.", type: "s" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao enviar o e-mail.", type: "e" });
    }
  },
};

module.exports = salesControler;
