const winston = require("winston");
const { DatadogTransport } = require("winston-datadog");
const morgan = require("morgan");

// 📌 DATADOG CONFIG
const DATADOG_API_KEY = "3a4f1087c1f664fa5cd7b0cb92017e80"; // Reemplaza con tu API Key
const SERVICE_NAME = "backend-productos"; // Nombre identificador en Datadog

// 📌 Configuración de Winston con Datadog
const logger = winston.createLogger({
    transports: [
      new DatadogTransport({
        apiKey: DATADOG_API_KEY,
        service: SERVICE_NAME,
        ddsource: "nodejs",
        hostname: require("os").hostname(),
        site: "us5.datadoghq.com" // Usa el mismo sitio que en tu configuración
      }),
      new winston.transports.Console(), // Logs en consola
    ],
  });

// 📌 Morgan para capturar logs HTTP y enviarlos a Winston
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => {
      logger.info({ message });
    },
  },
});

module.exports = { logger, httpLogger };
