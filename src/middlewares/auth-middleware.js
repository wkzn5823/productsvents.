const passport = require("passport");
const jwt = require("jsonwebtoken");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston
const { SECRET } = require("../constants"); 

// 🔹 Middleware para autenticar al usuario manualmente
exports.userAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("⚠️ Intento de acceso sin token válido.");
        return res.status(401).json({ error: "No autorizado. Token no proporcionado o formato incorrecto." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // 🔹 Almacenar usuario en req.user

        logger.info(`🔑 Usuario autenticado: ID ${decoded.id}, Email: ${decoded.email}`);
        next();
    } catch (err) {
        logger.error(`🚨 Error al verificar token: ${err.message}`);
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};

// 🔹 Mapeo de roles por ID
const roleMapping = { admin: 1, vendedor: 2, cliente: 3 };

// 🔹 Middleware para verificar roles
exports.verifyRole = (rolesPermitidos) => (req, res, next) => {
    if (!req.user || !req.user.role_id) {
        logger.warn("🚨 No se encontró role_id en req.user, acceso denegado.");
        return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
    }

    if (!rolesPermitidos.includes(req.user.role_id)) {
        logger.warn(`🚨 Acceso denegado. El role_id ${req.user.role_id} no está permitido.`);
        return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
    }

    logger.info(`✅ Acceso permitido para usuario ID: ${req.user.id}, Rol: ${req.user.role_id}`);
    next();
};
