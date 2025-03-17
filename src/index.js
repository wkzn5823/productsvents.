const express = require("express");
const app = express();
const { PORT } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const axios = require("axios"); // ✅ Importamos axios para probar conexión a Better Stack
const { logger, httpLogger } = require("./middlewares/logger"); // ✅ Importamos winston y morgan

app.use(express.json()); 
app.use(cookieParser());
app.use(httpLogger); // ✅ Morgan registrará todas las peticiones HTTP

// Importar rutas
const productoRoutes = require("./routes/productoroutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const pedidosRoutes = require("./routes/pedidos");
const categoriasRoutes = require("./routes/categorias");

// Importar middleware de autenticación
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

// Inicializar rutas
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", productoRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/categorias", categoriasRoutes);

// Capturar errores no manejados
process.on("uncaughtException", (err) => {
  logger.error(`❌ Error no manejado: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`🚨 Promesa rechazada sin manejar: ${err}`);
});

// Iniciar servidor
const appStart = () => {
    try {
        // 🔴 Prueba si Render puede enviar logs a Better Stack
        axios.post("s1239074.eu-nbg-2.betterstackdata.com", 
            { message: "🔴 Probando si Render puede enviar logs" }, 
            { headers: { "Authorization": `Bearer NtXVhwBxvMRPvsxwzpAyRiaW` } }
        )
        .then(res => console.log("✅ Logs enviados correctamente"))
        .catch(err => console.log("❌ Error al enviar logs:", err.response?.data || err.message));

        app.listen(PORT, () => {
            logger.info(`Servidor corriendo en el puerto ${PORT}`); 
        });
    } catch (error) {
        logger.error(`Error al iniciar el servidor: ${error.message}`);
    }
};

appStart();
