"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const CATEGORIA_ACCESORIOS: number = 3;
const TALLAS_DISPONIBLES = ["S", "M", "L", "XL", "XXL"];
const MEDIDAS_TALLAS: Record<string, { ancho: number; largo: number }> = {
  S: { ancho: 46, largo: 68 },
  M: { ancho: 50, largo: 70 },
  L: { ancho: 54, largo: 72 },
  XL: { ancho: 58, largo: 74 },
  XXL: { ancho: 62, largo: 76 },
};

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen_url: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);

  // Usamos la variable de entorno REACT_APP_API_URL para la URL base
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchProducto = useCallback(async () => {
    try {
      const response = await axios.get<Producto>(`${API_URL}/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProducto(response.data);
    } catch (err) {
      setError("Error al cargar el producto.");
    } finally {
      setLoading(false);
    }
  }, [id, API_URL]);

  useEffect(() => {
    fetchProducto();
  }, [fetchProducto]);

  const handleAddToCart = () => {
    if (!producto) return;

    if (producto.categoria_id !== CATEGORIA_ACCESORIOS && !tallaSeleccionada) {
      toast.error("Por favor, selecciona una talla antes de añadir al carrito", {
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "10px",
        },
        icon: "👕",
      });
      return;
    }

    addToCart({
      id: producto.id,
      title:
        producto.categoria_id !== CATEGORIA_ACCESORIOS
          ? `${producto.nombre} (Talla: ${tallaSeleccionada})`
          : producto.nombre,
      price: producto.precio,
      quantity: 1,
      imageUrl: producto.imagen_url,
    });

    toast.success(`¡${producto.nombre} añadido al carrito!`, {
      duration: 3000,
      style: {
        background: "#333",
        color: "#fff",
        borderRadius: "10px",
      },
      icon: "✨",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500 animate-bounce">{error}</p>
      </div>
    );

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-500 animate-pulse">Producto no encontrado.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-visible">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-16 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center transform transition-transform duration-500 hover:scale-105">
            <img
              src={producto.imagen_url || "/placeholder.svg"}
              alt={producto.nombre}
              className="w-full max-w-md object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="flex flex-col animate-slideIn">
            <h1 className="text-3xl font-bold hover:text-gray-700 transition-colors">{producto.nombre}</h1>
            <p className="text-lg text-gray-700 mt-2 hover:text-gray-900 transition-colors">{producto.descripcion}</p>
            <p className="text-2xl font-semibold text-green-600 mt-4 animate-pulse">${producto.precio}</p>

            {producto.categoria_id !== CATEGORIA_ACCESORIOS ? (
              <div className="mt-4 transform transition-all duration-300 hover:translate-x-2">
                <p className="text-lg font-semibold">Selecciona una talla:</p>
                <div className="flex gap-2 mt-2">
                  {TALLAS_DISPONIBLES.map((talla) => (
                    <button
                      key={talla}
                      onClick={() => setTallaSeleccionada(talla)}
                      className={`px-4 py-2 border rounded-md transition-all duration-300 transform hover:scale-110 ${
                        tallaSeleccionada === talla ? "bg-black text-white shadow-lg" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>

                {tallaSeleccionada && (
                  <p className="mt-2 text-gray-600 animate-fadeIn">
                    📏 Medidas para <strong>{tallaSeleccionada}</strong>: Ancho{" "}
                    {MEDIDAS_TALLAS[tallaSeleccionada].ancho} cm, Largo {MEDIDAS_TALLAS[tallaSeleccionada].largo} cm
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 animate-fadeIn">
                <h2 className="text-lg font-semibold">Detalles del producto</h2>
                <p className="text-gray-700 mt-2">{producto.descripcion}</p>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="mt-6 bg-black text-white px-6 py-3 rounded-md 
                transform transition-all duration-300 
                hover:bg-gray-800 hover:scale-105 hover:shadow-xl 
                active:scale-95"
            >
              Añadir a la cesta
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
