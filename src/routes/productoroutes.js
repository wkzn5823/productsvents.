const { Router } = require("express");
const { 
    getProductos, 
    getProductoById, 
    addProducto, 
    deleteProducto, 
    updateProducto 
} = require("../controllers/productocontroller");
const { userAuth, verifyRole } = require("../middlewares/auth-middleware");
const db = require("../db");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

const router = Router();

// 🔹 Obtener un producto por ID (Requiere autenticación)
router.get("/productos/:id", userAuth, async (req, res) => {
    try {
        logger.info(`📋 Solicitando producto con ID: ${req.params.id}`);
        await getProductoById(req, res);
    } catch (error) {
        logger.error(`❌ Error al obtener producto por ID: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Obtener todos los productos (Requiere autenticación)
router.get("/productos", userAuth, async (req, res) => {
    try {
        logger.info("📋 Solicitando todos los productos...");
        await getProductos(req, res);
    } catch (error) {
        logger.error(`❌ Error al obtener productos: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Agregar un nuevo producto (Solo Admins)
router.post("/productos", userAuth, verifyRole([1]), async (req, res) => {
    try {
        logger.info(`📝 Intentando agregar producto: ${req.body.nombre}`);
        await addProducto(req, res);
    } catch (error) {
        logger.error(`❌ Error al agregar producto: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Actualizar un producto (Solo Admins)
router.put("/productos/:id", userAuth, verifyRole([1]), async (req, res) => {
    try {
        logger.info(`✏️ Intentando actualizar producto con ID: ${req.params.id}`);
        await updateProducto(req, res);
    } catch (error) {
        logger.error(`❌ Error al actualizar producto: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Eliminar un producto permanentemente (Solo Admins)
router.delete("/productos/:id", userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;
    
    try {
        logger.info(`🗑 Intentando eliminar producto con ID: ${id}`);

        const producto = await db.query("SELECT * FROM productos WHERE id = $1", [id]);

        if (producto.rows.length === 0) {
            logger.warn(`⚠️ Producto no encontrado para eliminación (ID: ${id})`);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await db.query("DELETE FROM productos WHERE id = $1", [id]);

        logger.info(`✅ Producto eliminado permanentemente (ID: ${id})`);
        res.status(200).json({ success: true, message: "Producto eliminado permanentemente" });
    } catch (error) {
        logger.error(`❌ Error al eliminar producto: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
