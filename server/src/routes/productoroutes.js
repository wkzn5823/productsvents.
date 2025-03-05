const { Router } = require('express');
const { getProductos, getProductoById, addProducto, deleteProducto, updateProducto } = require('../controllers/productocontroller');
const { userAuth, verifyRole } = require('../middlewares/auth-middleware');
const db = require('../db');


const router = Router();

// ✅ Agregar esta nueva ruta para obtener un producto por ID
router.get('/productos/:id', userAuth, getProductoById);

router.get('/productos', userAuth, getProductos);
router.post('/productos', userAuth, verifyRole([1]), addProducto);
router.put('/productos/:id', userAuth, verifyRole(['admin']), updateProducto);
router.delete('/productos/:id', userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar si el producto existe antes de eliminarlo
        const producto = await db.query('SELECT * FROM productos WHERE id = $1', [id]);

        if (producto.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // ✅ Eliminar el producto permanentemente
        await db.query('DELETE FROM productos WHERE id = $1', [id]);

        res.status(200).json({ success: true, message: 'Producto eliminado permanentemente' });
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



module.exports = router;
