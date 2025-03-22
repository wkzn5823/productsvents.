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
  ]
});

const httpLogger = morgan("combined");

// ✅ Middleware para guardar logs en BD
const logToDatabase = async (req, res, next) => {
  const mensaje = `📥 Nueva solicitud: ${req.method} ${req.url}`;
  const usuario = req.user?.email || "anónimo"; // si usas passport
  await guardarLog("info", mensaje, req.url, req.method, usuario);
  logger.info(mensaje);
  next();
};

module.exports = { logger, httpLogger, logToDatabase };
