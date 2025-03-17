const winston = require("winston");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// 📌 Token de Better Stack (asegúrate de no exponerlo públicamente)
const BETTERSTACK_TOKEN = "NtXVhwBxvMRPvsxwzpAyRiaW";

// 📌 Directorio donde guardaremos los logs en archivos
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 📌 Configuración de Winston con formato JSON
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // ✅ Formato estructurado en JSON
  ),
  transports: [
    new winston.transports.Console(), // ✅ Mostrar logs en consola
    new winston.transports.File({ filename: path.join(logDirectory, "server.log"), level: "info" }),
    new winston.transports.File({ filename: path.join(logDirectory, "errors.log"), level: "error" }),

    // 📌 Enviar logs a Better Stack
    new winston.transports.Http({
      host: "in.logs.betterstack.com",
      path: `/logs/${BETTERSTACK_TOKEN}`,
      ssl: true,
    }),
  ],
});

// 📌 Morgan para registrar peticiones HTTP en Winston y Better Stack
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => {
      logger.info({ message }); // ✅ Convertimos en JSON para evitar errores
    },
  },
});

module.exports = { logger, httpLogger };
