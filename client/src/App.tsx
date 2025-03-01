import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Tshirts from "./pages/Tshirts";
import Hoodies from "./pages/Hoddies";
import Accessories from "./pages/Accesories";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Legal from "./pages/Legal";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminCategorias from "./pages/AdminCategorias";
import AdminVentas from "./pages/AdminVentas";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Importamos la protección global

function App() {
  // Filtramos los errores para evitar que se muestren las advertencias relacionadas con 'true' para chunk
  if (process.env.NODE_ENV === "development") {
    const originalConsoleError = console.error;
    console.error = (message) => {
      if (typeof message === "string" && message.includes("Received 'true' for chunk")) {
        // Evitamos que se muestre el error relacionado con 'true' for chunk
        return;
      }
      originalConsoleError(); // Llamamos al comportamiento original para otros errores
    };
  }

  return (
    <CartProvider>
      <Router>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              padding: "16px",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Routes>
          {/* 🔹 Ruta de login (única accesible sin autenticación) */}
          <Route path="/login" element={<Login />} />

          {/* 🔹 Rutas protegidas (nadie puede acceder sin iniciar sesión) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/tshirts" element={<Tshirts />} />
            <Route path="/hoodies" element={<Hoodies />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/returns" element={<ReturnsPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />

            {/* 🔹 Rutas de administración */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-usuarios" element={<AdminUsuarios />} />
            <Route path="/admin-categorias" element={<AdminCategorias />} />
            <Route path="/admin-ventas" element={<AdminVentas />} />
          </Route>

          {/* 🔹 Si alguien intenta acceder a una ruta inválida, lo redirigimos a /login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
