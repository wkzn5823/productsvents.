const winston = require("winston");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const { LogtailTransport } = require("@logtail/winston");
const logtail = require("../utils/logger"); // Importamos Logtail

// 📌 Directorio donde guardaremos los logs
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // Crea la carpeta si no existe
}

// 📌 Configuración de Winston con Logtail
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.colorize({ all: true }) }),
    new winston.transports.File({ filename: path.join(logDirectory, "server.log"), level: "info" }),
    new winston.transports.File({ filename: path.join(logDirectory, "errors.log"), level: "error" }),
    new LogtailTransport(logtail), // 🚀 Enviamos logs a Logtail
  ],
});

// 📌 Configuración de Morgan para registrar cada petición HTTP en Logtail
const httpLogger = morgan("combined", {
  stream: logtail, // Enviar logs HTTP a Logtail
});

module.exports = { logger, httpLogger };
