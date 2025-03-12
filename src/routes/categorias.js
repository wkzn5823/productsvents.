const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { userAuth, verifyRole } = require('../middlewares/auth-middleware');
const db = require('../db'); // ✅ Agregar la conexión a la base de datos

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await db.query('SELECT * FROM categorias WHERE activo = TRUE');
        res.json(categorias.rows);
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


// Obtener una categoría por ID
router.get('/:id', categoriasController.getCategoriaById);

// Crear una nueva categoría (Solo Admins)
router.post('/', userAuth, verifyRole([1]), categoriasController.createCategoria);
router.put('/:id', userAuth, verifyRole([1]), categoriasController.updateCategoria);
router.delete('/:id', userAuth, verifyRole([1]), categoriasController.deleteCategoria);


module.exports = router;
