const db = require('../db');
const bcrypt = require("bcryptjs");
const { compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const { SECRET } = process.env;  // Usa SECRET desde variables de entorno

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

// 🔹 Función para obtener usuarios
exports.getUsers = async (req, res) => {
  try {
    // Aseguramos que solo los usuarios activos sean seleccionados
    const { rows } = await db.query(
      "SELECT id, nombre, email, role_id, fecha_registro FROM usuarios WHERE activo = $1",
      [true]  // Compara con TRUE para obtener solo los usuarios activos
    );
    return res.status(200).json({ success: true, users: rows });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);  // Evitar exponer el error completo al usuario
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// 🔹 Función para registrar usuario
exports.register = async (req, res) => {
  const { nombre, email, contraseña, role_id } = req.body;

  // Validación de datos de entrada
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
  }

  let newRoleId = role_id || 3; // Asignamos cliente por defecto si no se envía role_id

  try {
    // Verificar que el role_id exista en la base de datos
    const roleCheck = await db.query("SELECT * FROM roles WHERE id = $1", [newRoleId]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ error: "El rol especificado no existe" });
    }

    // Hashear la contraseña antes de insertarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario en la BD
    const query = `
      INSERT INTO usuarios (nombre, email, contraseña, role_id, activo) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;  // Aseguramos que se inserte el valor para 'activo'
    const values = [nombre, email, hashedPassword, newRoleId, true];  // Asignamos TRUE por defecto para "activo"
    const result = await db.query(query, values);

    return res.status(201).json({ success: true, message: "Usuario registrado exitosamente", usuario: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar usuario:", error);  // Evitar exponer el error completo al usuario
    return res.status(500).json({ error: "Error al registrar usuario." });
  }
};

// 🔹 Función para login
exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    // Aseguramos que solo los usuarios activos puedan iniciar sesión
    const { rows } = await db.query(
      `SELECT id, nombre, email, contraseña, role_id, intentos_fallidos, bloqueado_hasta 
       FROM usuarios WHERE email = $1 AND activo = $2`,
      [email, true]  // Usamos TRUE para asegurar que solo los usuarios activos sean seleccionados
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Email no registrado" });
    }

    const user = rows[0];

    // Verificar si la cuenta está bloqueada
    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      return res.status(403).json({ error: "Cuenta bloqueada. Intenta nuevamente más tarde." });
    }

    // Verificar la contraseña
    const validPassword = await compare(contraseña, user.contraseña);
    if (!validPassword) {
      // Incrementar intentos fallidos (si es null o undefined, asignar 0)
      const intentosFallidos = (user.intentos_fallidos || 0) + 1;

      // Actualizamos intentos fallidos
      await db.query(
        `UPDATE usuarios SET intentos_fallidos = $1 WHERE id = $2`,
        [intentosFallidos, user.id]
      );

      // Bloquear al usuario si supera 5 intentos fallidos
      if (intentosFallidos >= 5) {
        const bloqueado_hasta = new Date();
        bloqueado_hasta.setMinutes(bloqueado_hasta.getMinutes() + 15);  // Bloquear por 15 minutos
        await db.query(
          `UPDATE usuarios SET bloqueado_hasta = $1 WHERE id = $2`,
          [bloqueado_hasta, user.id]
        );
        return res.status(403).json({ error: "Cuenta bloqueada. Intenta nuevamente más tarde." });
      }

      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Resetear los intentos fallidos si la contraseña es correcta
    await db.query(
      `UPDATE usuarios SET intentos_fallidos = 0 WHERE id = $1`,
      [user.id]
    );

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🔹 Función para refrescar el Access Token
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) return res.sendStatus(403);

  verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

// 🔹 Cerrar sesión
exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Algo salió mal al cerrar sesión",
    });
  }
};

// 🔹 Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe y está activo antes de eliminarlo
    const userCheck = await db.query("SELECT * FROM usuarios WHERE id = $1 AND activo = $2", [
      id, true  // Aseguramos que el usuario esté activo antes de eliminarlo
    ]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado o no está activo" });
    }

    // Eliminar usuario
    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return res.status(200).json({ success: true, message: "Usuario eliminado exitosamente" });
  } catch (error) {
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
    return res.status(500).json({ error: "Error interno del servidor" });
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
    console.log(error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
