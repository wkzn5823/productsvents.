const db = require('../db'); // 🔹 Importar la conexión a la base de datos

exports.getDashboard = async (req, res) => {
    try {
        const ventas = await db.query('SELECT COUNT(*) AS total_ventas FROM ventas');
        const productos = await db.query('SELECT COUNT(*) AS total_productos FROM productos');

        res.json({
            total_ventas: ventas.rows[0].total_ventas,
            total_productos: productos.rows[0].total_productos
        });
    } catch (error) {
        console.error("Error en getDashboard:", error); // 🔹 Imprime el error en la consola
        res.status(500).json({ error: 'Error al obtener métricas', detalle: error.message });
    }
};