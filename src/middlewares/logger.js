const winston = require("winston");
const morgan = require("morgan");
const enviarLogDatadog = require("../utils/datadog"); // Importar Datadog

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// Middleware para enviar logs a Datadog
const datadogLogger = (req, res, next) => {
  const message = `${req.method} ${req.url} - ${res.statusCode}`;
  enviarLogDatadog("info", message);
  next();
};

// Middleware para Morgan y Datadog
const httpLogger = morgan("combined", {
  stream: {
    write: (message) => {
      logger.info({ message });
      enviarLogDatadog("info", message);
    },
  },
});

module.exports = { logger, httpLogger, datadogLogger };
