const express = require('express');
const app = express();
const { PORT, CLIENT_URL } = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');




app.use(express.json()); // 🔹 Necesario para que `req.body` funcione

// Importar rutas
const productoRoutes = require('./routes/productoroutes'); // Agregar rutas de productos
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const pedidosRoutes = require('./routes/pedidos');
const categoriasRoutes = require('./routes/categorias');
// Importar middleware de autenticación
require('./middlewares/passport-middleware');

// Inicializar middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// Inicializar rutas
app.use('/api/admin', adminRoutes);  // Debe ir después de la importación de adminRoutes
app.use('/api/auth', authRoutes);
app.use('/api', productoRoutes);  // Nueva ruta de productos
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/categorias', categoriasRoutes);
// Iniciar servidor
const appStart = () => {
    try {
        app.listen(5000, "0.0.0.0", () => {
            console.log("Servidor corriendo en el puerto 5000");
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

appStart();