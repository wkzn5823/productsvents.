const winston = require("winston");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const DatadogTransport = require("winston-datadog");

const DATADOG_API_KEY = process.env.DATADOG_API_KEY || "3a4f1087c1f664fa5cd7b0cb92017e80";
const SERVICE_NAME = process.env.SERVICE_NAME || "backend-products";

// 📌 Directorio donde guardaremos los logs en archivos
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 📌 Configuración de Winston con formato JSON y Datadog
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDirectory, "server.log"), level: "info" }),
    new winston.transports.File({ filename: path.join(logDirectory, "errors.log"), level: "error" }),

    // 📌 Enviar logs a Datadog
    new DatadogTransport({
      apiKey: DATADOG_API_KEY,
      service: SERVICE_NAME,
      hostname: "api.datadoghq.com",
      ddsource: "nodejs",
    }),
  ],
});

// 📌 Morgan para registrar peticiones HTTP en Winston y Datadog
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => {
      logger.info({ message });
    },
  },
});

module.exports = { logger, httpLogger };
