"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, memo } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

interface ValueProps {
  title: string
  description: string
  icon: string
}

const values: ValueProps[] = [
  {
    title: "AUTENTICIDAD",
    description: "Cada pieza cuenta una historia única de la cultura urbana.",
    icon: "🎨",
  },
  {
    title: "CALIDAD",
    description: "Materiales premium para que tu estilo dure tanto como tu actitud.",
    icon: "💎",
  },
  {
    title: "COMUNIDAD",
    description: "Más que una tienda, somos un punto de encuentro para la cultura urbana.",
    icon: "🤝",
  },
]

const ValueCard = memo(({ title, description, icon }: ValueProps) => (
  <motion.div
    className="bg-white p-8 rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 50 }}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
      {title}
    </h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
))

ValueCard.displayName = "ValueCard"

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <motion.div
              className="relative h-[40vh] bg-black flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 opacity-50">
                <img
                  src="https://images.unsplash.com/photo-1523398002811-999ca8dec234"
                  alt="Street background"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <h1
                className="text-6xl md:text-8xl font-bold text-white relative z-10"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                STORE
              </h1>
            </motion.div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16">
              {/* Mission Statement */}
              <motion.div
                className="max-w-4xl mx-auto text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  NUESTRA MISIÓN
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Nacimos de la pasión por la cultura urbana y el streetwear. No solo vendemos ropa, creamos
                  una experiencia que refleja el espíritu de la calle y la autenticidad de la cultura urbana.
                </p>
              </motion.div>

              {/* Values Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <ValueCard {...value} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Story Section */}
              <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-4xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    NUESTRA HISTORIA
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Desde 2023, hemos sido más que una tienda de ropa - somos un movimiento. Nacimos en las calles
                    de México, inspirados por el arte urbano, la música y la cultura del streetwear.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nuestra colección representa la fusión perfecta entre el estilo urbano contemporáneo y la comodidad.
                    Cada diseño es cuidadosamente seleccionado para aquellos que viven y respiran la cultura urbana.
                  </p>
                </motion.div>
                <motion.div
                  className="flex-1 relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
                      alt="Street culture"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      EST. 2023
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default About
