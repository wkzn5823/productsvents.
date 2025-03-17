const db = require("../db");
const bcrypt = require("bcryptjs");
const { compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston
const { SECRET } = process.env; 

const refreshTokens = [];

const generateAccessToken = (user) => sign(
  { id: user.id, email: user.email, role_id: user.role_id },
  SECRET,
  { expiresIn: "1h" }
);

const generateRefreshToken = (user) => sign({ id: user.id }, SECRET, { expiresIn: "7d" });

exports.getUsers = async (req, res) => {
  try {
    logger.info("📋 Obteniendo lista de usuarios...");

    const { rows } = await db.query(
      "SELECT id, nombre, email, role_id, fecha_registro FROM usuarios WHERE activo = $1",
      [true]
    );

    logger.info(`✅ Usuarios obtenidos (${rows.length} encontrados)`);
    return res.status(200).json({ success: true, users: rows });
  } catch (error) {
    logger.error(`❌ Error al obtener usuarios: ${error.message}`);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.register = async (req, res) => {
  const { nombre, email, contraseña, role_id } = req.body;

  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
  }

  let newRoleId = role_id || 3;

  try {
    logger.info(`📝 Registrando nuevo usuario: ${email} con rol ${newRoleId}`);

    const roleCheck = await db.query("SELECT * FROM roles WHERE id = $1", [newRoleId]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ error: "El rol especificado no existe" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = `
      INSERT INTO usuarios (nombre, email, contraseña, role_id, activo) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [nombre, email, hashedPassword, newRoleId, true];
    const result = await db.query(query, values);

    logger.info(`✅ Usuario registrado con ID: ${result.rows[0].id}`);
    return res.status(201).json({ success: true, message: "Usuario registrado exitosamente" });
  } catch (error) {
    logger.error(`❌ Error al registrar usuario: ${error.message}`);
    return res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    logger.info(`🔑 Intento de inicio de sesión para: ${email}`);

    const { rows } = await db.query(
      `SELECT id, nombre, email, contraseña, role_id, intentos_fallidos, bloqueado_hasta 
       FROM usuarios WHERE email = $1 AND activo = $2`,
      [email, true]
    );

    if (!rows.length) {
      logger.warn(`⚠️ Intento de login con email no registrado: ${email}`);
      return res.status(401).json({ error: "Email no registrado" });
    }

    const user = rows[0];

    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      logger.warn(`⛔ Usuario bloqueado: ${email}`);
      return res.status(403).json({ error: "Cuenta bloqueada. Intenta nuevamente más tarde." });
    }

    const validPassword = await compare(contraseña, user.contraseña);
    if (!validPassword) {
      const intentosFallidos = (user.intentos_fallidos || 0) + 1;

      await db.query(`UPDATE usuarios SET intentos_fallidos = $1 WHERE id = $2`, [intentosFallidos, user.id]);

      if (intentosFallidos >= 5) {
        const bloqueado_hasta = new Date();
        bloqueado_hasta.setMinutes(bloqueado_hasta.getMinutes() + 15);
        await db.query(`UPDATE usuarios SET bloqueado_hasta = $1 WHERE id = $2`, [bloqueado_hasta, user.id]);
        logger.warn(`⛔ Usuario bloqueado por intentos fallidos: ${email}`);
        return res.status(403).json({ error: "Cuenta bloqueada. Intenta nuevamente más tarde." });
      }

      logger.warn(`❌ Contraseña incorrecta para: ${email}`);
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    await db.query(`UPDATE usuarios SET intentos_fallidos = 0 WHERE id = $1`, [user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`✅ Inicio de sesión exitoso: ${email}`);
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    logger.error(`❌ Error en login: ${error.message}`);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`🗑 Eliminando usuario con ID: ${id}`);

    const userCheck = await db.query("SELECT * FROM usuarios WHERE id = $1 AND activo = $2", [id, true]);
    if (userCheck.rowCount === 0) {
      logger.warn(`⚠️ Usuario no encontrado o inactivo: ID ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado o no está activo" });
    }

    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);

    logger.info(`✅ Usuario eliminado con éxito: ID ${id}`);
    return res.status(200).json({ success: true, message: "Usuario eliminado exitosamente" });
  } catch (error) {
    logger.error(`❌ Error al eliminar usuario: ${error.message}`);
    return res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

exports.protected = async (req, res) => {
  try {
    logger.info(`🔒 Acceso a ruta protegida para: ${req.user.email}`);
    return res.status(200).json({
      success: true,
      message: "Ruta protegida accesible",
      user: {
        id: req.user.id,
        email: req.user.email,
        role_id: req.user.role_id,
      },
    });
  } catch (error) {
    logger.error(`❌ Error en ruta protegida: ${error.message}`);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
