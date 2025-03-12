const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController'); // ✅ IMPORTACIÓN CORRECTA
const { userAuth, verifyRole } = require('../middlewares/auth-middleware');

// ✅ Asegurar que los controladores existen
if (!pedidosController.getPedidos || !pedidosController.getPedidoById || !pedidosController.createPedido || !pedidosController.getDetallesPedido) {
    throw new Error("Error: Alguna función del pedidosController no está definida");
}

router.get('/', userAuth, verifyRole([1, 3]), pedidosController.getPedidos);
router.get('/:id', userAuth, verifyRole(['admin', 'cliente']), pedidosController.getPedidoById);
router.post('/', userAuth, verifyRole([3]), pedidosController.createPedido);
router.get('/:id/detalles', userAuth, verifyRole(['admin', 'cliente']), pedidosController.getDetallesPedido);

module.exports = router;
