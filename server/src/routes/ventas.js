const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { userAuth, verifyRole } = require('../middlewares/auth-middleware');

router.get('/', userAuth, verifyRole(['admin', 'vendedor']), ventasController.getVentas);
router.get('/:id', userAuth, verifyRole(['admin', 'vendedor']), ventasController.getVentaById);
router.post('/', userAuth, verifyRole(['vendedor']), ventasController.createVenta);
router.put('/:id', userAuth, verifyRole(['admin']), ventasController.updateVenta);
router.delete('/:id', userAuth, verifyRole(['admin']), ventasController.deleteVenta);

module.exports = router;

