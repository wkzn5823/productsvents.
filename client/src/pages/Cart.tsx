"use client";

import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { X } from "lucide-react";

function Cart() {
  const { cart, clearCart, removeFromCart } = useCart();

  useEffect(() => {}, [cart]);

  // Calcular totales con seguridad
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const handleFinalizarCompra = async () => {
    if (cart.length === 0) {
      toast.warning("⚠️ Tu carrito está vacío.", { position: "top-center", autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("⚠️ Debes iniciar sesión para finalizar la compra.", { position: "top-center", autoClose: 3000 });
        return;
      }

      const usuarioData = localStorage.getItem("user");
      if (!usuarioData) {
        toast.error("⚠️ No se pudieron obtener los datos del usuario.", { position: "top-center", autoClose: 3000 });
        return;
      }

      const usuario = JSON.parse(usuarioData);
      const usuario_id = usuario?.id;
      const usuario_nombre = usuario?.nombre || "No disponible";
      const usuario_email = usuario?.email || "No disponible";

      if (!usuario_id) {
        toast.error("⚠️ No se pudo obtener el ID del usuario.", { position: "top-center", autoClose: 3000 });
        return;
      }

      const pedidoData = {
        usuario_id,
        usuario_nombre,
        usuario_email,
        total: Number(total.toFixed(2)),
        productos: cart.map((item) => ({
          producto_id: item.id,
          nombre: item.title,
          cantidad: item.quantity,
          precio_unitario: Number(item.price),
          subtotal: Number((Number(item.price) * item.quantity).toFixed(2)),
        })),
      };

      // Usamos la variable de entorno REACT_APP_API_URL para la URL del backend
      const API_URL = `${import.meta.env.VITE_API_URL}`;


      const response = await axios.post(`${API_URL}/api/pedidos`, pedidoData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        toast.success("✅ Compra realizada con éxito. Generando ticket...", { position: "top-center", autoClose: 3000 });
        generarTicketPDF(pedidoData);
        clearCart();
      } else {
        toast.error("❌ Error al procesar la compra.", { position: "top-center", autoClose: 3000 });
      }
    } catch (error: unknown) {
      console.error("🚨 Error al finalizar la compra:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`❌ Error al procesar la compra: ${errorMessage}`, { position: "top-center", autoClose: 3000 });
    }
  };

  // 📜 Función para generar el ticket PDF
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generarTicketPDF = (pedidoData: any) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 130],
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TIENDA XYZ", 40, 10, { align: "center" });

    doc.setFontSize(10);
    doc.text("Dirección: Calle  123", 40, 15, { align: "center" });
    doc.text("Clabe: 638180010125857119", 40, 20, { align: "center" });
    doc.text("Enviar comprobante de pago a: ", 40, 25, { align: "center" });
    doc.text("alexisencarnacion5823@gmail.com", 40, 30, { align: "center" });

    doc.line(5, 33, 75, 34);

    doc.setFontSize(9);
    doc.text(`Cliente: ${pedidoData.usuario_nombre}`, 5, 37);
    doc.text(`Correo: ${pedidoData.usuario_email}`, 5, 40);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 5, 44);

    doc.line(5, 46, 75, 46);

    let y = 50;
    doc.setFontSize(9);
    doc.text("Cant", 5, y);
    doc.text("Producto", 20, y);
    doc.text("Precio", 55, y);
    doc.text("Total", 65, y);
    y += 5;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pedidoData.productos.forEach((item: any) => {
      doc.setFontSize(8);
      doc.text(`${item.cantidad}`, 5, y);
      doc.text(`${item.nombre}`, 20, y);
      doc.text(`$${item.precio_unitario.toFixed(2)}`, 55, y);
      doc.text(`$${item.subtotal.toFixed(2)}`, 65, y);
      y += 5;
    });

    doc.line(5, y, 75, y);
    y += 5;

    doc.setFontSize(9);
    doc.text("Subtotal:", 5, y);
    doc.text(`$${(pedidoData.total / 1.21).toFixed(2)}`, 65, y);

    y += 5;
    doc.text("IVA (21%):", 5, y);
    doc.text(`$${(pedidoData.total - pedidoData.total / 1.21).toFixed(2)}`, 65, y);

    y += 5;
    doc.setFontSize(10);
    doc.text("TOTAL A PAGAR:", 5, y);
    doc.text(`$${pedidoData.total.toFixed(2)}`, 65, y);

    y += 8;
    doc.setFontSize(8);
    doc.text("Gracias por su compra", 40, y, { align: "center" });

    doc.save("ticket-compra.pdf");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white">
          <div className="flex items-center justify-between mb-6"></div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b">
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500">0.400 kg</p>
                          <p className="text-sm">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-gray-600">
                            <X className="h-4 w-4" />
                          </button>
                          <p className="font-medium mt-2">{Number(item.price).toFixed(2)} $</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mt-6 pt-6 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} $</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>IVA (21%)</span>
                  <span>{tax.toFixed(2)} $</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3">
                  <span>Total</span>
                  <span>{total.toFixed(2)} $</span>
                </div>
              </div>

              <button
                onClick={handleFinalizarCompra}
                className="mt-6 w-full bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition"
              >
                Finalizar Compra
              </button>
            </>
          )}
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Cart;
