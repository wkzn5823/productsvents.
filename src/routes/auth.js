const { Router } = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');  // Asegurar que esté importado
const { login, register, refreshToken, logout, getUsers, protected } = require('../controllers/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth, verifyRole } = require('../middlewares/auth-middleware');

const router = Router();

// 🔹 Proteger la obtención de usuarios SOLO para Admins
router.get('/get-users', userAuth, verifyRole([1]), getUsers);

// 🔹 Rutas protegidas
router.get('/protected', userAuth, protected);
router.post('/logout', userAuth, logout);
router.post('/refresh', refreshToken);

// 🔹 Login y Registro
router.post('/login', validationMiddleware, login);

// Ruta de registro de cliente
router.post("/register-client", register);

// 🔹 Endpoint de Registro (Ajustado y mejorado)
router.post('/register', async (req, res) => { 
    const { nombre, email, contraseña, role_id } = req.body;

    // Validación de datos de entrada
    if (!nombre || !email || !contraseña) { 
        return res.status(400).json({ error: "Todos los campos son obligatorios" }); 
    }

    let newRoleId = role_id || 3; // Asigna cliente por defecto si no se envía role_id

    // Validar el formato de email
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        return res.status(400).json({ error: "El formato del email es inválido." });
    }

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar usuario en la base de datos de forma segura
        const query = `
            INSERT INTO usuarios (nombre, email, contraseña, role_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [nombre, email, hashedPassword, newRoleId];

        const result = await db.query(query, values);

        // No exponemos la contraseña al cliente
        res.status(201).json({ success: true, message: "Usuario registrado exitosamente" }); 
    } catch (error) { 
        console.error("Error en el registro:", error); 
        res.status(500).json({ error: "Error al procesar el registro." }); 
    } 
});

// 🔹 Ruta para Eliminar Usuarios (Solo Admins)
router.delete('/delete-user/:id', userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el usuario existe antes de deshabilitarlo
        const userCheck = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Soft delete: cambiamos el estado de 'activo' a FALSE
        await db.query('UPDATE usuarios SET activo = FALSE WHERE id = $1', [id]);

        res.status(200).json({ success: true, message: 'Usuario deshabilitado correctamente' });
    } catch (error) {
        console.error('Error al deshabilitar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 🔹 Ruta para Actualizar el Rol (Solo Admins)
router.put('/update-role/:id', userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    try {
        // Validar si el rol es válido
        const roleCheck = await db.query('SELECT * FROM roles WHERE id = $1', [role_id]);
        if (roleCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        await db.query('UPDATE usuarios SET role_id = $1 WHERE id = $2', [role_id, id]);
        res.status(200).json({ success: true, message: "Rol actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar el rol:", error);
        res.status(500).json({ error: "Error al actualizar el rol" });
    }
});

// 🔹 Ruta para eliminar productos (Añadir seguridad)
router.delete('/delete-producto/:id', userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        await db.query('DELETE FROM productos WHERE id = $1', [id]);
        return res.status(200).json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;
