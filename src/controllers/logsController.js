// src/controllers/logsController.js
const db = require("../db");

const obtenerLogs = async (req, res) => {
  const resultado = await db.query("SELECT * FROM logs ORDER BY fecha DESC LIMIT 100");
  res.json(resultado.rows);
};

module.exports = { obtenerLogs };
