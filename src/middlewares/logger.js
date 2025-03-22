const { createLogger, format, transports } = require("winston");
const path = require("path");
const morgan = require("morgan");
const { guardarLog } = require("../utils/logsModel");

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: path.join(__dirname, "../../logs/error.log"), level: "error" }),
    new transports.File({ filename: path.join(__dirname, "../../logs/combined.log") }),
  ],
});

// 📌 Manda TODOS los logs también a la BD
const logToDatabase = async (req, res, next) => {
  const mensaje = `📥 Nueva solicitud: ${req.method} ${req.url}`;
  const usuario = req.user?.email || "anónimo";
  await guardarLog("info", mensaje, req.url, req.method, usuario);
  logger.info(mensaje);
  next();
};

// 🆕 Envoltura para logger.info, logger.warn, etc. que también los guarde en la base de datos
["info", "warn", "error"].forEach((level) => {
  const originalFn = logger[level];
  logger[level] = async function (mensaje) {
    await guardarLog(level, mensaje, "", "", "anónimo"); // ruta y método vacíos
    originalFn.call(logger, mensaje);
  };
});

const httpLogger = morgan("combined");

module.exports = { logger, httpLogger, logToDatabase };
