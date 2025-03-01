const passport = require('passport');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants'); // Asegúrate de que es el mismo SECRET

// Middleware para autenticar al usuario manualmente
exports.userAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado. Token no proporcionado o formato incorrecto." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        
        req.user = decoded; // 🔹 Almacenar usuario en req.user
        
        next();
    } catch (err) {
        console.error("🚨 Error al verificar token:", err);
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};


// Mapeo de roles por ID
const roleMapping = { admin: 1, vendedor: 2, cliente: 3 };

// Middleware para verificar roles
exports.verifyRole = (rolesPermitidos) => (req, res, next) => {
    
    if (!req.user || !req.user.role_id) {
        console.error("🚨 No se encontró role_id en req.user");
        return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
    }
    
    if (!rolesPermitidos.includes(req.user.role_id)) {
        console.error("🚨 Acceso denegado. El role_id no está permitido.");
        return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
    }

    next();
};

