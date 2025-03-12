"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, ShoppingCart, Package2 } from "lucide-react";

interface Pedido {
  usuario_nombre: string;
  usuario_email: string;
  id: number;
  fecha: string;
  total: number;
  estado: string;
}

export default function AdminVentas() {
  const [ventasTotales, setVentasTotales] = useState<number>(0);
  const [cantidadVentas, setCantidadVentas] = useState<number>(0);
  const [ventasActivas, setVentasActivas] = useState<number>(0);
  const [ventasRecientes, setVentasRecientes] = useState<Pedido[]>([]);
  const [ventasPorMes, setVentasPorMes] = useState<{ mes: string; total: number }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Usamos la variable de entorno REACT_APP_API_URL configurada en Vercel
  const API_URL = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        if (!user || ![1, 3].includes(user.role_id)) {
          console.error("🚨 No tienes permisos para obtener pedidos.");
          return;
        }

        // Usamos la variable de entorno para construir la URL completa
        const pedidosRes = await axios.get(`${API_URL}/api/pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pedidos: Pedido[] = pedidosRes.data.pedidos;
        setVentasTotales(pedidos.reduce((sum, p) => sum + Number(p.total ?? 0), 0));
        setCantidadVentas(pedidos.length);
        setVentasActivas(pedidos.filter((p) => ["pendiente", "procesando"].includes(p.estado)).length);
        setVentasRecientes(pedidos.slice(-5));

        const ventasMensuales: { [key: number]: number } = pedidos.reduce(
          (acc, p) => {
            if (!p.fecha) return acc;
            const mesNumero = new Date(p.fecha).getMonth();
            const totalVenta = Number(p.total) || 0;
            acc[mesNumero] = (acc[mesNumero] || 0) + totalVenta;
            return acc;
          },
          {} as { [key: number]: number }
        );

        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const datosGrafica = meses.map((mes, index) => ({
          mes,
          total: ventasMensuales[index] || 0,
        }));

        setVentasPorMes(datosGrafica);
        setIsLoaded(true);
      } catch (err) {
        console.error("🚨 Error al obtener datos:", err);
      }
    };

    fetchDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <motion.div
        className="flex-grow p-8 pt-24" // Aumentado el padding-top
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.h2
          className="text-3xl font-bold mb-8" // Añadido margin-bottom
          variants={itemVariants}
        >
          Gestión de Ventas
        </motion.h2>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${ventasTotales.toFixed(2)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                <ShoppingCart className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">+{cantidadVentas}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Activas</CardTitle>
                <Package2 className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">+{ventasActivas}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="p-4 transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Resumen de Ventas Mensuales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey="mes"
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis axisLine={{ stroke: "#e5e7eb" }} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    wrapperStyle={{ outline: "none" }}
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Ventas"]}
                    labelStyle={{ color: "#6b7280" }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#000000"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-4 transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Ventas Recientes</h3>
              {ventasRecientes.map((pedido, index) => (
                <motion.div
                  key={pedido.id}
                  className="flex justify-between py-2 border-b transition-all duration-200 hover:bg-gray-50 rounded-lg px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <p className="font-semibold">{pedido.usuario_nombre}</p>
                    <p className="text-sm text-gray-500">{pedido.usuario_email}</p>
                  </div>
                  <p className="font-semibold text-black">+${Number(pedido.total ?? 0).toFixed(2)}</p>
                </motion.div>
              ))}
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
