const dogapi = require("dogapi");

const options = {
  api_key: process.env.DATADOG_API_KEY || "3a4f1087c1f664fa5cd7b0cb92017e80", // Usa la variable de entorno
};

dogapi.initialize(options);

/**
 * Función para enviar logs a Datadog
 */
const enviarLogDatadog = (nivel, mensaje) => {
  dogapi.event.create(
    "Backend Log",
    mensaje,
    {
      alert_type: nivel, // Puede ser "info", "warning", "error"
      source_type_name: "nodejs-backend",
    },
    (err, res) => {
      if (err) {
        console.error("❌ Error al enviar log a Datadog:", err);
      }
    }
  );
};

module.exports = enviarLogDatadog;
