const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { userAuth, verifyRole } = require('../middlewares/auth-middleware');

// Ruta protegida solo para administradores
router.get('/admin-only', userAuth, verifyRole(['admin']), (req, res) => {
    res.status(200).json({ success: true, message: 'Acceso autorizado solo para administradores' });
});

router.get('/dashboard', userAuth, verifyRole(['admin']), adminController.getDashboard);

module.exports = router;