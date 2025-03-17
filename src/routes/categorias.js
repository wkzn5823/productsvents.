const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");
const { userAuth, verifyRole } = require("../middlewares/auth-middleware");
const db = require("../db");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

// 🔹 Obtener todas las categorías
router.get("/", async (req, res) => {
    try {
        logger.info("📋 Solicitando todas las categorías activas...");

        const categorias = await db.query("SELECT * FROM categorias WHERE activo = TRUE");

        logger.info(`✅ Se encontraron ${categorias.rows.length} categorías activas`);
        res.json(categorias.rows);
    } catch (error) {
        logger.error(`❌ Error al obtener categorías: ${error.message}`);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 🔹 Obtener una categoría por ID
router.get("/:id", categoriasController.getCategoriaById);

// 🔹 Crear una nueva categoría (Solo Admins)
router.post("/", userAuth, verifyRole([1]), categoriasController.createCategoria);
router.put("/:id", userAuth, verifyRole([1]), categoriasController.updateCategoria);
router.delete("/:id", userAuth, verifyRole([1]), categoriasController.deleteCategoria);

module.exports = router;
