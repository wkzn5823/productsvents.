const db = require("../db");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

// 🔹 Obtener todas las categorías
exports.getCategorias = async (req, res) => {
    try {
        logger.info("📋 Obteniendo lista de categorías...");

        const result = await db.query("SELECT * FROM categorias WHERE activo = $1", [true]); 

        logger.info(`✅ Categorías obtenidas (${result.rows.length} encontradas)`);
        res.json(result.rows);
    } catch (error) {
        logger.error(`❌ Error al obtener categorías: ${error.message}`);
        res.status(500).json({ error: "Error al obtener categorías" });
    }
};

// 🔹 Obtener una categoría por ID
exports.getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`📌 Buscando categoría con ID: ${id}`);

        const result = await db.query("SELECT * FROM categorias WHERE id = $1 AND activo = $2", [id, true]);
        if (result.rows.length === 0) {
            logger.warn(`⚠️ Categoría con ID ${id} no encontrada o deshabilitada`);
            return res.status(404).json({ error: "Categoría no encontrada o ya deshabilitada" });
        }

        logger.info(`✅ Categoría encontrada: ${JSON.stringify(result.rows[0])}`);
        res.json(result.rows[0]);
    } catch (error) {
        logger.error(`❌ Error al obtener la categoría: ${error.message}`);
        res.status(500).json({ error: "Error al obtener la categoría" });
    }
};

// 🔹 Crear nueva categoría
exports.createCategoria = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
    }

    try {
        logger.info(`📝 Creando nueva categoría: ${nombre}`);

        const newCategoria = await db.query(
            "INSERT INTO categorias (nombre, activo) VALUES ($1, $2) RETURNING *",
            [nombre, true]
        );

        logger.info(`✅ Categoría creada con ID: ${newCategoria.rows[0].id}`);
        return res.status(201).json(newCategoria.rows[0]);
    } catch (error) {
        logger.error(`❌ Error al crear la categoría: ${error.message}`);
        return res.status(500).json({ error: "Error al crear la categoría." });
    }
};

// 🔹 Actualizar una categoría
exports.updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
        }

        logger.info(`✏️ Actualizando categoría ID ${id} con nombre: ${nombre}`);

        const result = await db.query("UPDATE categorias SET nombre = $1 WHERE id = $2 AND activo = $3", [nombre, id, true]);

        if (result.rowCount === 0) {
            logger.warn(`⚠️ Categoría con ID ${id} no encontrada o ya deshabilitada`);
            return res.status(404).json({ error: "Categoría no encontrada o ya deshabilitada" });
        }

        logger.info(`✅ Categoría ID ${id} actualizada exitosamente`);
        res.json({ message: "Categoría actualizada exitosamente" });
    } catch (error) {
        logger.error(`❌ Error al actualizar la categoría: ${error.message}`);
        res.status(500).json({ error: "Error al actualizar la categoría" });
    }
};

// 🔹 Deshabilitar una categoría (soft delete)
exports.deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`🗑 Intentando deshabilitar categoría con ID: ${id}`);

        const categoriaCheck = await db.query("SELECT * FROM categorias WHERE id = $1 AND activo = $2", [id, true]);

        if (categoriaCheck.rows.length === 0) {
            logger.warn(`⚠️ Categoría con ID ${id} no encontrada o ya deshabilitada`);
            return res.status(404).json({ error: "Categoría no encontrada o ya deshabilitada" });
        }

        await db.query("UPDATE categorias SET activo = $1 WHERE id = $2", [false, id]);

        logger.info(`✅ Categoría con ID ${id} deshabilitada correctamente`);
        res.json({ message: "Categoría deshabilitada correctamente" });
    } catch (error) {
        logger.error(`❌ Error al deshabilitar la categoría: ${error.message}`);
        res.status(500).json({ error: "Error al deshabilitar la categoría" });
    }
};
