const db = require('../db');
const { verifyRole } = require('../middlewares/auth-middleware');


// Obtener todas las ventas
exports.getVentas = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ventas');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una venta por ID
exports.getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM ventas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva venta
exports.createVenta = async (req, res) => {
    try {
        const { usuario_id, total } = req.body;

        const result = await db.query(
            'INSERT INTO ventas (usuario_id, total) VALUES ($1, $2) RETURNING *',
            [usuario_id, total] // Corrección aquí
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error en createVenta:", error); // 🔹 Mostrar error en consola
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una venta
exports.updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, total } = req.body;
        const result = await db.query(
            'UPDATE ventas SET usuario_id = $1, total = $2 WHERE id = $3 RETURNING *',
            [usuario_id, total, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una venta
exports.deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM ventas WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
