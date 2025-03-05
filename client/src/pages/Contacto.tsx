"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, memo } from "react"
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook, type LucideIcon } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

interface ContactItemProps {
  icon: LucideIcon
  title: string
  info: string
}

const contactItems: ContactItemProps[] = [
  {
    icon: MapPin,
    title: "VISÍTANOS",
    info: "Calle Gran Vía 1, 28013 Montemorelos, México",
  },
  {
    icon: Phone,
    title: "LLÁMANOS",
    info: "+34 912 345 678",
  },
  {
    icon: Mail,
    title: "ESCRÍBENOS",
    info: "info@store.com",
  },
]

const ContactCard = memo(({ icon: Icon, title, info }: ContactItemProps) => (
  <motion.div
    className="bg-white p-8 rounded-lg shadow-lg text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 50 }}
  >
    <div className="text-4xl mb-4 flex justify-center text-gray-700">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
      {title}
    </h3>
    <p className="text-gray-600">{info}</p>
  </motion.div>
))

ContactCard.displayName = "ContactCard"

const SocialIcon = memo(({ icon: Icon, href = "#" }: { icon: LucideIcon; href?: string }) => (
  <a href={href} className="text-gray-700 hover:text-black transition-colors duration-300">
    <Icon size={32} />
  </a>
))

SocialIcon.displayName = "SocialIcon"

const Contact = () => {
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
                  src="https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5"
                  alt="Urban background"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h1
                className="text-6xl md:text-8xl font-bold text-white relative z-10"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                CONTÁCTANOS
              </h1>
            </motion.div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16">
              <motion.div
                className="max-w-4xl mx-auto text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  ESTAMOS AQUÍ PARA TI
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Valoramos la conexión con nuestra comunidad. No dudes en contactarnos para cualquier
                  consulta, colaboración o simplemente para compartir tu amor por el streetwear.
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <ContactCard {...item} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-4xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  SÍGUENOS
                </h2>
                <div className="flex justify-center space-x-6">
                  <SocialIcon icon={Instagram} href="https://Instagram.com" />
                  <SocialIcon icon={Twitter} href="https://twitter.com" />
                  <SocialIcon icon={Facebook} href="https://Facebook.com" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Contact
