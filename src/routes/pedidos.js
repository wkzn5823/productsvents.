const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const { userAuth, verifyRole } = require("../middlewares/auth-middleware");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

// ✅ Verificación de controladores antes de cargar rutas
if (!pedidosController.getPedidos || 
    !pedidosController.getPedidoById || 
    !pedidosController.createPedido || 
    !pedidosController.getDetallesPedido) {
    throw new Error("❌ Error: Alguna función del pedidosController no está definida");
}

// 🔹 Obtener todos los pedidos (Admins y Clientes)
router.get("/", userAuth, verifyRole([1, 3]), async (req, res) => {
    try {
        logger.info(`📋 Solicitando lista de pedidos para Usuario ID: ${req.user.id}`);
        await pedidosController.getPedidos(req, res);
    } catch (error) {
        logger.error(`❌ Error al obtener pedidos: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Obtener un pedido por ID (Admins y Clientes)
router.get("/:id", userAuth, verifyRole([1, 3]), async (req, res) => {
    try {
        logger.info(`📋 Solicitando pedido con ID: ${req.params.id}`);
        await pedidosController.getPedidoById(req, res);
    } catch (error) {
        logger.error(`❌ Error al obtener pedido por ID: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Crear un nuevo pedido (Solo Clientes)
router.post("/", userAuth, verifyRole([3]), async (req, res) => {
    try {
        logger.info(`🛒 Creando nuevo pedido para Usuario ID: ${req.user.id}`);
        await pedidosController.createPedido(req, res);
    } catch (error) {
        logger.error(`❌ Error al crear pedido: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Obtener detalles de un pedido por ID (Admins y Clientes)
router.get("/:id/detalles", userAuth, verifyRole([1, 3]), async (req, res) => {
    try {
        logger.info(`📦 Solicitando detalles del pedido ID: ${req.params.id}`);
        await pedidosController.getDetallesPedido(req, res);
    } catch (error) {
        logger.error(`❌ Error al obtener detalles del pedido: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
