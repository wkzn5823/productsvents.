const winston = require("winston");
const path = require("path");

// Configuración de los niveles de logs
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Selección del nivel según el entorno
const level = () => (process.env.NODE_ENV === "production" ? "info" : "debug");

// Formatos de logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Transportes (dónde se almacenan los logs)
const transports = [
  new winston.transports.Console({ level: "debug" }),
  new winston.transports.File({ filename: path.join(__dirname, "../../logs/error.log"), level: "error" }),
  new winston.transports.File({ filename: path.join(__dirname, "../../logs/combined.log") }),
];

// Instancia del logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;
