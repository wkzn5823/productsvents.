const express = require("express");
const { exec } = require("child_process");
const app = express();
const { PORT } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const { logger } = require("./middlewares/logger");

// 📌 Middlewares esenciales
app.use(express.json());
app.use(cookieParser());

// 📌 Middleware para subir logs en cada petición
app.use((req, res, next) => {
  logger.info(`📥 Nueva solicitud: ${req.method} ${req.url}`);

  // 🚀 Ejecutar comando para subir logs a GitHub automáticamente
  exec(
    "git add logs/*.log && git commit -m '🚀 Logs actualizados' && GIT_ASKPASS=echo 'echo $GITHUB_PAT' git push",
    (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error al subir logs:", error);
        return;
      }
      console.log("✅ Logs subidos a GitHub:", stdout);
    }
  );

  next();
});

// 📌 Importar rutas
const productoRoutes = require("./routes/productoroutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const pedidosRoutes = require("./routes/pedidos");
const categoriasRoutes = require("./routes/categorias");

// 📌 Importar middleware de autenticación
require("./middlewares/passport-middleware");

// 📌 Configuración de CORS
app.use(
  cors({
    origin: "https://front-rj6daociw-wkzn5823s-projects.vercel.app",
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
