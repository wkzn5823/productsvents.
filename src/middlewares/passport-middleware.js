const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const db = require("../db");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston

// 🔹 Extrae el token JWT desde el header o las cookies
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies["token"];
    return token;
};

// 🔹 Configuración de la estrategia JWT
const opts = {
    secretOrKey: process.env.SECRET, 
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor, 
    ]),
};

// 🔹 Estrategia JWT
passport.use(
    new Strategy(opts, async ({ id }, done) => {
        try {
            logger.info(`🔍 Intentando autenticar usuario con ID: ${id}`);

            const { rows } = await db.query(
                `SELECT id, nombre, email, role_id FROM usuarios WHERE id = $1`,
                [id]
            );

            if (!rows.length) {
                logger.warn(`⚠️ Autenticación fallida: Usuario no encontrado (ID: ${id})`);
                return done(null, false);
            }

            const user = {
                id: rows[0].id,
                nombre: rows[0].nombre,
                email: rows[0].email,
                role_id: rows[0].role_id,
            };

            logger.info(`✅ Autenticación exitosa: Usuario ${user.email} (ID: ${user.id})`);
            return done(null, user);
        } catch (error) {
            logger.error(`❌ Error al autenticar usuario: ${error.message}`);
            return done(null, false);
        }
    })
);

module.exports = passport;
