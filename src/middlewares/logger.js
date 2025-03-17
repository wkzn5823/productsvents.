const winston = require("winston");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// 📌 Directorio donde guardaremos los logs
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // Crea la carpeta si no existe
}

// 📌 Configuración de Winston
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
  ],
});

// 📌 Configuración de Morgan para registrar cada petición HTTP
const httpLogger = morgan("combined", {
  stream: fs.createWriteStream(path.join(logDirectory, "requests.log"), { flags: "a" }), // 📂 Guardamos los logs HTTP
});

module.exports = { logger, httpLogger };
