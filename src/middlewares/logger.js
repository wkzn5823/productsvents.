const { createLogger, format, transports } = require("winston");
const morgan = require("morgan");
const path = require("path");

// 📌 Winston para registrar logs en archivos
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, "../../logs/error.log"), level: "error" }),
    new transports.File({ filename: path.join(__dirname, "../../logs/combined.log") })
  ]
});

// 📌 Morgan para registrar logs de peticiones HTTP
const httpLogger = morgan("combined");

// 📌 Exportar correctamente
module.exports = { logger, httpLogger };
