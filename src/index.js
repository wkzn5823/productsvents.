const express = require("express");
const { exec } = require("child_process");
const app = express();
const { PORT } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const { logger, httpLogger, logToDatabase} = require("./middlewares/logger");


// 📌 Middlewares esenciales
app.use(express.json());
app.use(cookieParser());
app.use(httpLogger); // ✅ Morgan registrará todas las peticiones HTTP
app.use(logToDatabase); // Esto irá antes de tus rutas
// 📌 Almacenar logs temporalmente en un buffer
let logPending = false;

/* const subirLogsAGitHub = () => {
  if (logPending) {
    console.log("🚀 Subiendo logs a GitHub...");
    exec(
      `rm -f /opt/render/project/src/.git/index.lock && \
       git config --global user.email "alexisencarnacion5823@gmail.com" && \
       git config --global user.name "wkzn5823" && \
       git checkout -B server && \
       git add logs/*.log && \
       git commit -m "🚀 Logs actualizados" && \
       git push https://${process.env.GITHUB_PAT}@github.com/wkzn5823/productsvents..git server`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Error al subir logs:", error);
          return;
        }
        console.log("✅ Logs subidos a GitHub:", stdout);
        logPending = false; // Resetea la bandera después de subir
      }
    );
  }
}; */

// 📌 Ejecutar la subida de logs cada 2 minutos (120000 ms)
//setInterval(subirLogsAGitHub, 120000);


// 📌 Importar rutas
const productoRoutes = require("./routes/productoroutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const pedidosRoutes = require("./routes/pedidos");
const categoriasRoutes = require("./routes/categorias");
const logsRoutes = require("./routes/logs");
// 📌 Importar middleware de autenticación
require("./middlewares/passport-middleware");

// 📌 Configuración de CORS
app.use(
  cors({
    origin: "https://front-bpsp3g9ar-wkzn5823s-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(passport.initialize());

// 📌 Inicializar rutas
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", productoRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/logs", logsRoutes);

// 📌 Capturar errores no manejados
process.on("uncaughtException", (err) => {
  logger.error(`❌ Error no manejado: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`🚨 Promesa rechazada sin manejar: ${err}`);
});

// 📌 Iniciar servidor
const appStart = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Error al iniciar el servidor: ${error.message}`);
  }
};

appStart();
