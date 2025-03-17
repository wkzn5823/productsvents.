const db = require("../db"); // 🔹 Importar la conexión a la base de datos
const { logger } = require("../middlewares/logger"); // ✅ Importamos winston

exports.getDashboard = async (req, res) => {
  try {
    logger.info("📊 Obteniendo métricas del dashboard...");

    const ventas = await db.query("SELECT COUNT(*) AS total_ventas FROM ventas");
    const productos = await db.query("SELECT COUNT(*) AS total_productos FROM productos");

    logger.info(`✅ Datos obtenidos - Ventas: ${ventas.rows[0].total_ventas}, Productos: ${productos.rows[0].total_productos}`);

    res.json({
      total_ventas: ventas.rows[0].total_ventas,
      total_productos: productos.rows[0].total_productos,
    });
  } catch (error) {
    logger.error(`❌ Error en getDashboard: ${error.message}`);
    res.status(500).json({ error: "Error al obtener métricas", detalle: error.message });
  }
};
