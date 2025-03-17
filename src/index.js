const express = require("express");
const app = express();
const { PORT } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const axios = require("axios");
const { logger, httpLogger } = require("./middlewares/logger");

const BETTERSTACK_TOKEN = "NtXVhwBxvMRPvsxwzpAyRiaW"; // ✅ Token de Better Stack
const BETTERSTACK_HOST = "https://s1239074.eu-nbg-2.betterstackdata.com"; // ✅ Host de Better Stack

app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);

const productoRoutes = require("./routes/productoroutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const pedidosRoutes = require("./routes/pedidos");
const categoriasRoutes = require("./routes/categorias");

require("./middlewares/passport-middleware");

app.use(
  cors({
    origin: "https://front-rj6daociw-wkzn5823s-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", productoRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/categorias", categoriasRoutes);

// ✅ Capturar errores no manejados
process.on("uncaughtException", (err) => {
  logger.error(`❌ Error no manejado: ${err.message}`);
  enviarLogBetterStack("error", `❌ Error no manejado: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`🚨 Promesa rechazada sin manejar: ${err}`);
  enviarLogBetterStack("error", `🚨 Promesa rechazada sin manejar: ${err}`);
});

// ✅ Función para enviar logs a Better Stack
const enviarLogBetterStack = async (nivel, mensaje) => {
    try {
      await axios.post(
        `https://s1239074.eu-nbg-2.betterstackdata.com/`, // ✅ Corregimos la URL
        { level: nivel, message: mensaje },
        { headers: { Authorization: `Bearer NtXVhwBxvMRPvsxwzpAyRiaW` } } // ✅ Corrección del token
      );
  
      console.log("✅ Log enviado a Better Stack:", mensaje);
    } catch (error) {
      console.error("❌ Error al enviar log a Better Stack:", error.response?.data || error.message);
    }
  };
  

// ✅ Iniciar servidor con prueba de conexión a Better Stack
const appStart = () => {
  try {
    // 🔴 Prueba de conexión a Better Stack antes de iniciar el servidor
    enviarLogBetterStack("info", "🔴 Probando conexión a Better Stack desde Render");

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en el puerto ${PORT}`);
      enviarLogBetterStack("info", `🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
    enviarLogBetterStack("error", `❌ Error al iniciar el servidor: ${error.message}`);
  }
};

appStart();
