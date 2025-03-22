const db = require("../db");

const guardarLog = async (nivel, mensaje, ruta, metodo, usuario = "anónimo") => {
  const query = `
    INSERT INTO logs (nivel, mensaje, ruta, metodo, usuario)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [nivel, mensaje, ruta, metodo, usuario];
  await db.query(query, values);
};

module.exports = { guardarLog };
