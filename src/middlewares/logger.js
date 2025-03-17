const winston = require("winston");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// 📌 Directorio donde guardaremos los logs
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 📌 Configuración de Winston con formato JSON
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // ✅ Ahora los logs estarán bien estructurados
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDirectory, "server.log"), level: "info" }),
    new winston.transports.File({ filename: path.join(logDirectory, "errors.log"), level: "error" }),
  ],
});

// 📌 Morgan para registrar peticiones HTTP de forma estructurada
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => {
      logger.info({ message }); // ✅ Convertimos en JSON para evitar errores
    },
  },
});

module.exports = { logger, httpLogger };
