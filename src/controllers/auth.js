const db = require("../db");
const bcrypt = require("bcryptjs");
const { compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const { logger } = require("../middlewares/logger"); // ✅ Importamos Winston
const { SECRET } = process.env;  

const refreshTokens = [];

// 🔹 Función para generar Access Token
const generateAccessToken = (user) => {
  return sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    SECRET,
    { expiresIn: "1h" }
  );
};

// 🔹 Función para generar Refresh Token
const generateRefreshToken = (user) => {
  return sign({ id: user.id }, SECRET, { expiresIn: "7d" });
};

// 🔹 Obtener usuarios
exports.getUsers = async (req, res) => {
  try {
    logger.info("📋 Solicitando lista de usuarios activos...");
    const { rows } = await db.query(
      "SELECT id, nombre, email, role_id, fecha_registro FROM usuarios WHERE activo = $1",
      [true]  
    );
    logger.info(`✅ Se encontraron ${rows.length} usuarios activos`);
    return res.status(200).json({ success: true, users: rows });
  } catch (error) {
    logger.error(`❌ Error al obtener usuarios: ${error.message}`);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// 🔹 Registrar usuario
exports.register = async (req, res) => {
  const { nombre, email, contraseña, role_id } = req.body;

  if (!nombre || !email || !contraseña) {
    logger.warn("⚠️ Intento de registro con datos incompletos");
    return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
  }

  let newRoleId = role_id || 3; 

  try {
    logger.info(`📝 Registrando nuevo usuario: ${email}`);

    const roleCheck = await db.query("SELECT * FROM roles WHERE id = $1", [newRoleId]);
    if (roleCheck.rows.length === 0) {
      logger.warn(`⚠️ Intento de registro con un rol inexistente (ID: ${newRoleId})`);
      return res.status(400).json({ error: "El rol especificado no existe" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const query = `
      INSERT INTO usuarios (nombre, email, contraseña, role_id, activo) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [nombre, email, hashedPassword, newRoleId, true];

    const result = await db.query(query, values);
    logger.info(`✅ Usuario registrado: ${result.rows[0].email}`);

    return res.status(201).json({ success: true, message: "Usuario registrado exitosamente", usuario: result.rows[0] });
  } catch (error) {
    logger.error(`❌ Error en el registro: ${error.message}`);
    return res.status(500).json({ error: "Error al registrar usuario." });
  }
};

// 🔹 Login
exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
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
      logger.warn(`⚠️ Cuenta bloqueada para usuario: ${email}`);
      return res.status(403).json({ error: "Cuenta bloqueada. Intenta nuevamente más tarde." });
    }

    const validPassword = await compare(contraseña, user.contraseña);
    if (!validPassword) {
      logger.warn(`⚠️ Intento de login con contraseña incorrecta: ${email}`);
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    await db.query(`UPDATE usuarios SET intentos_fallidos = 0 WHERE id = $1`, [user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    logger.info(`✅ Usuario autenticado: ${email}`);

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
    logger.error(`❌ Error en el login: ${error.message}`);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Refresh Token
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) {
    logger.warn("⚠️ Intento de refresh token no válido");
    return res.sendStatus(403);
  }

  verify(token, SECRET, (err, user) => {
    if (err) {
      logger.warn("⚠️ Refresh token expirado o inválido");
      return res.sendStatus(403);
    }
    const newAccessToken = generateAccessToken(user);
    logger.info(`✅ Refresh token generado para usuario ID: ${user.id}`);
    res.json({ accessToken: newAccessToken });
  });
};

// 🔹 Logout
exports.logout = async (req, res) => {
  try {
    logger.info(`👋 Usuario ${req.user?.email || "desconocido"} cerró sesión`);
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error(`❌ Error al cerrar sesión: ${error.message}`);
    return res.status(500).json({ error: "Algo salió mal al cerrar sesión" });
  }
};

// 🔹 Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`🗑 Intentando eliminar usuario con ID: ${id}`);
    const userCheck = await db.query("SELECT * FROM usuarios WHERE id = $1 AND activo = $2", [id, true]);

    if (userCheck.rowCount === 0) {
      logger.warn(`⚠️ Usuario no encontrado en eliminación (ID: ${id})`);
      return res.status(404).json({ error: "Usuario no encontrado o no está activo" });
    }

    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
    logger.info(`✅ Usuario eliminado correctamente (ID: ${id})`);
    return res.status(200).json({ success: true, message: "Usuario eliminado exitosamente" });
  } catch (error) {
    logger.error(`❌ Error al eliminar usuario: ${error.message}`);
    return res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// 🔹 Función para ruta protegida
exports.protected = async (req, res) => {
  try {
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
    logger.error(`❌ Error en la ruta protegida: ${error.message}`);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
