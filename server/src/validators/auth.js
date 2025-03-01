const { check } = require('express-validator');
const db = require('../db');
const { compare } = require('bcryptjs');

// Validar la longitud de la contraseña
const password = check('contraseña')
  .exists().withMessage('La contraseña es obligatoria.')
  .isLength({ min: 6, max: 15 }).withMessage('La contraseña debe tener entre 6 y 15 caracteres.');

// Validar email
const email = check('email')
  .exists().withMessage('El email es obligatorio.')
  .isEmail().withMessage('Por favor, proporciona un email válido.');

// Verificar si el email ya está registrado (para el registro)
const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [value]);

  if (rows.length) {
    throw new Error('El email ya está registrado.');
  }
});

// Verificar si el role_id existe en la base de datos (para el registro)
const roleExists = check('role_id').custom(async (value) => {
  const { rows } = await db.query('SELECT * FROM roles WHERE id = $1', [value]);
  if (rows.length === 0) {
    throw new Error('El rol especificado no existe.');
  }
});

// Verificación de login: Verificar si el email y la contraseña son correctos
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
  console.log("Verificando email:", value);  // Verifica que estamos entrando en esta validación

  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [value]);

  if (!rows.length) {
    throw new Error('El email no está registrado.');
  }

  const user = rows[0];

  const validPassword = await compare(req.body.contraseña, user.contraseña);

  if (!validPassword) {
    throw new Error('Contraseña incorrecta.');
  }

  req.user = user;  // Almacenamos al usuario en la solicitud para usarlo en el controlador
});

module.exports = {
  registerValidation: [email, password, emailExists, roleExists],
  loginValidation: [email, password, loginFieldsCheck]  // Asegúrate de que validamos la contraseña en el login también
};
