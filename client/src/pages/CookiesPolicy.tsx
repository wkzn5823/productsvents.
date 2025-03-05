"use client"

import { motion } from "framer-motion"
import PolicyLayout from "../components/PolicyLayout"

const CookiesPolicy = () => {
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
        stiffness: 50,
      },
    },
  }

  return (
    <PolicyLayout title="Política de Cookies">
      <motion.div className="prose max-w-none" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          ¿Qué son las cookies?
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestra web.
          Estas nos ayudan a proporcionar funcionalidades esenciales y mejorar tu experiencia.
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Tipos de cookies que utilizamos
        </motion.h2>
        <motion.ul className="list-disc pl-6 mb-4" variants={containerVariants}>
          <motion.li className="mb-2" variants={itemVariants}>
            <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio.
          </motion.li>
          <motion.li className="mb-2" variants={itemVariants}>
            <strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo utilizas nuestra web.
          </motion.li>
          <motion.li className="mb-2" variants={itemVariants}>
            <strong>Cookies de funcionalidad:</strong> Permiten recordar tus preferencias.
          </motion.li>
          <motion.li variants={itemVariants}>
            <strong>Cookies de publicidad:</strong> Utilizadas para mostrarte anuncios relevantes.
          </motion.li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Control de cookies
        </motion.h2>
        <motion.p variants={itemVariants}>
          Puedes gestionar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar
          ciertas cookies puede afectar al funcionamiento de nuestra web.
        </motion.p>
      </motion.div>
    </PolicyLayout>
  )
}

export default CookiesPolicy

