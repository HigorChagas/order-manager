import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Orders (
      orderId TEXT PRIMARY KEY,
      value REAL,
      creationDate TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Items (
      orderId TEXT,
      productId INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY(orderId) REFERENCES Orders(orderId) ON DELETE CASCADE
    )
  `);
});

export default db;
