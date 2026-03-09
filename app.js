import express from "express";
import db from "./database.js";
import { randomBytes, randomInt } from "crypto";

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/order", (req, res) => {
  const { value } = req.body;
  const orderId = randomBytes(9).toString("base64url");

  db.run(
    "INSERT INTO Orders (orderId, value) VALUES (?, ?)",
    [orderId, value],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        orderId,
        value,
      });
    },
  );
});

app.post("/order/:id/items", (req, res) => {
  const orderId = req.params.id;
  const productId = randomInt(0, 2000);
  const { quantity, price } = req.body;

  db.get(
    "SELECT orderId FROM Orders WHERE orderId = ?",
    [orderId],
    (err, order) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado " });
      }
    },
  );

  db.run(
    "INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
    [orderId, productId, quantity, price],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        orderId,
        productId,
        quantity,
        price,
      });
    },
  );
});

app.get("/order/:id", (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM Orders WHERE orderId = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (!row) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(row);
  });
});

app.get("/orders", (req, res) => {
  db.all("SELECT * FROM Orders", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

app.put("/order/:id", (req, res) => {
  const id = req.params.id;
  const { value } = req.body;

  db.run(
    "UPDATE Orders SET value = ? WHERE orderId = ?",
    [value, id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      res.json({
        message: "Pedido atualizado",
        orderId: id,
        value,
      });
    },
  );
});

app.delete("/order/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM Orders WHERE orderId = ?", [id], function (err) {
    if (err) {
      return res.status(500).json(err);
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json({
      message: "Pedido deletado com sucesso",
      orderId: id,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
