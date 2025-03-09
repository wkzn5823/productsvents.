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

const Accessories = () => {
  const [accessories, setAccessories] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = `${process.env.REACT_APP_API_URL}/api/productos` // Combinamos la URL de la API de Vercel



  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axios.get<Producto[]>(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })

        const filteredAccessories = response.data.filter((product) => product.categoria.toLowerCase() === "accesorios")

        setAccessories(filteredAccessories)
      } catch (err) {
        setError("Error al cargar los productos.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccessories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          ACCESORIOS
        </motion.h1>

        {loading && (
          <motion.p
            className="text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Cargando productos...
          </motion.p>
        )}
        {error && (
          <motion.p
            className="text-center text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {accessories.map((accessory) => (
              <motion.div key={accessory.id} variants={itemVariants}>
                <PolaroidCard
                  id={accessory.id}
                  imageUrl={accessory.imagen_url}
                  title={accessory.nombre}
                  subtitle={`$${accessory.precio}`}
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

export default Accessories

