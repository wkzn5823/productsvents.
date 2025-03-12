const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env
const db = require('../db');  // Conexión a la base de datos (ajustar según tu configuración)

// Extrae el token JWT desde el header o las cookies
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies['token'];
    return token;
};

// Configuración de la estrategia JWT
const opts = {
    secretOrKey: process.env.SECRET, // Asegúrate de que esta variable esté definida en tu archivo .env
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Aceptar tokens en los headers
        cookieExtractor, // Aceptar tokens en las cookies
    ])
};

// Estrategia JWT
passport.use(
    new Strategy(opts, async ({ id }, done) => {
        try {
            // Consulta a la base de datos usando parámetros para prevenir inyecciones SQL
            const { rows } = await db.query(`
                SELECT id, nombre, email, role_id
                FROM usuarios
                WHERE id = $1
            `, [id]);

            if (!rows.length) {
                // No se encontró el usuario, rechazar la autenticación
                console.warn(`Usuario no encontrado: ${id}`);
                return done(null, false);
            }

            const user = { 
                id: rows[0].id, 
                nombre: rows[0].nombre, 
                email: rows[0].email, 
                role_id: rows[0].role_id 
            };

            return done(null, user); // Usuario autenticado
        } catch (error) {
            // Manejo de errores más seguro, sin exponer detalles sensibles
            console.error("Error al autenticar usuario:", error.message);
            return done(null, false);
        }
    })
);

module.exports = passport;
