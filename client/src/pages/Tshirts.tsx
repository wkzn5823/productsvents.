"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PolaroidCard from "../components/PolaroidCard"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: string
  imagen_url: string
  categoria: string
}

const Tshirts = () => {
  const [tshirts, setTshirts] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = `${process.env.REACT_APP_API_URL}/api/productos` // Combinamos la URL de la API de Vercel

  useEffect(() => {
    const fetchTshirts = async () => {
      try {
        const response = await axios.get<Producto[]>(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })

        const filteredTshirts = response.data.filter((product) => product.categoria.toLowerCase() === "camisetas")

        setTshirts(filteredTshirts)
      } catch (err) {
        setError("Error al cargar productos.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTshirts()
  }, [API_URL])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <motion.main
        className="flex-grow container mx-auto px-4 pt-24 pb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          CAMISETAS
        </motion.h1>

        {loading && <p className="text-center text-lg">Cargando productos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tshirts.map((tshirt) => (
              <motion.div key={tshirt.id} variants={itemVariants}>
                <PolaroidCard
                  id={tshirt.id}
                  imageUrl={tshirt.imagen_url}
                  title={tshirt.nombre}
                  subtitle={`$${tshirt.precio}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
      <Footer />
    </div>
  )
}

export default Tshirts

