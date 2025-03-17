const { Router } = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston
const { 
    login, register, refreshToken, logout, getUsers, protected: protectedRoute 
} = require("../controllers/auth");
const { validationMiddleware } = require("../middlewares/validations-middleware");
const { userAuth, verifyRole } = require("../middlewares/auth-middleware");

const router = Router();

// 🔹 Obtener usuarios (solo para Admins)
router.get("/get-users", userAuth, verifyRole([1]), getUsers);

// 🔹 Rutas protegidas
router.get("/protected", userAuth, protectedRoute);
router.post("/logout", userAuth, logout);
router.post("/refresh", refreshToken);

// 🔹 Login y Registro
router.post("/login", validationMiddleware, login);
router.post("/register-client", register);

// 🔹 Registro de usuario con logging mejorado
router.post("/register", async (req, res) => { 
    const { nombre, email, contraseña, role_id } = req.body;

    if (!nombre || !email || !contraseña) { 
        logger.warn("⚠️ Intento de registro con datos incompletos");
        return res.status(400).json({ error: "Todos los campos son obligatorios" }); 
    }

    let newRoleId = role_id || 3; 

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        logger.warn(`⚠️ Formato de email inválido en registro: ${email}`);
        return res.status(400).json({ error: "El formato del email es inválido." });
    }

    try {
        logger.info(`📝 Registrando nuevo usuario: ${email}`);

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const query = `
            INSERT INTO usuarios (nombre, email, contraseña, role_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [nombre, email, hashedPassword, newRoleId];

        const result = await db.query(query, values);

        logger.info(`✅ Usuario registrado: ${result.rows[0].email}`);
        res.status(201).json({ success: true, message: "Usuario registrado exitosamente" }); 
    } catch (error) { 
        logger.error(`❌ Error en el registro: ${error.message}`);
        res.status(500).json({ error: "Error al procesar el registro." }); 
    } 
});

// 🔹 Deshabilitar usuario (solo Admins)
router.delete("/delete-user/:id", userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;

    try {
        logger.info(`🗑 Intentando deshabilitar usuario con ID: ${id}`);

        const userCheck = await db.query("SELECT * FROM usuarios WHERE id = $1", [id]);

        if (userCheck.rows.length === 0) {
            logger.warn(`⚠️ Usuario no encontrado al intentar deshabilitar (ID: ${id})`);
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await db.query("UPDATE usuarios SET activo = FALSE WHERE id = $1", [id]);

        logger.info(`✅ Usuario deshabilitado correctamente (ID: ${id})`);
        res.status(200).json({ success: true, message: "Usuario deshabilitado correctamente" });
    } catch (error) {
        logger.error(`❌ Error al deshabilitar usuario: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 Actualizar rol de usuario (solo Admins)
router.put("/update-role/:id", userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;

    try {
        logger.info(`✏️ Intentando actualizar rol de usuario (ID: ${id})`);

        const roleCheck = await db.query("SELECT * FROM roles WHERE id = $1", [role_id]);
        if (roleCheck.rows.length === 0) {
            logger.warn(`⚠️ Intento de asignar rol no válido (ID: ${role_id})`);
            return res.status(400).json({ error: "Rol no válido" });
        }

        await db.query("UPDATE usuarios SET role_id = $1 WHERE id = $2", [role_id, id]);

        logger.info(`✅ Rol actualizado correctamente (Usuario ID: ${id}, Nuevo Rol: ${role_id})`);
        res.status(200).json({ success: true, message: "Rol actualizado correctamente" });
    } catch (error) {
        logger.error(`❌ Error al actualizar rol: ${error.message}`);
        res.status(500).json({ error: "Error al actualizar el rol" });
    }
});

// 🔹 Eliminar producto (solo Admins)
router.delete("/delete-producto/:id", userAuth, verifyRole([1]), async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            logger.warn(`⚠️ ID inválido para eliminar producto: ${id}`);
            return res.status(400).json({ error: "El ID del producto debe ser un número válido." });
        }

        logger.info(`🗑 Eliminando producto con ID: ${id}`);

        const { rowCount } = await db.query("DELETE FROM productos WHERE id = $1", [id]);

        if (rowCount === 0) {
            logger.warn(`⚠️ Producto no encontrado en eliminación (ID: ${id})`);
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        logger.info(`✅ Producto eliminado correctamente (ID: ${id})`);
        res.status(200).json({ success: true, message: "Producto eliminado" });
    } catch (error) {
        logger.error(`❌ Error al eliminar producto: ${error.message}`);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

module.exports = router;
