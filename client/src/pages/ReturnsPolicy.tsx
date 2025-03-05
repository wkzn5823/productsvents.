"use client"

import { motion } from "framer-motion"
import PolicyLayout from "../components/PolicyLayout"

const ReturnsPolicy = () => {
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
    <PolicyLayout title="Cambios y Devoluciones">
      <motion.div className="prose max-w-none" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Política de Devoluciones
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Dispones de 30 días desde la recepción de tu pedido para realizar una devolución. Los artículos deben estar en
          su estado original, sin usar y con todas las etiquetas.
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Proceso de Devolución
        </motion.h2>
        <motion.ol className="list-decimal pl-6 mb-4" variants={containerVariants}>
          <motion.li className="mb-2" variants={itemVariants}>
            Accede a tu cuenta y selecciona el pedido que deseas devolver
          </motion.li>
          <motion.li className="mb-2" variants={itemVariants}>
            Selecciona los artículos y el motivo de la devolución
          </motion.li>
          <motion.li className="mb-2" variants={itemVariants}>
            Imprime la etiqueta de devolución
          </motion.li>
          <motion.li variants={itemVariants}>Envía el paquete a través de la empresa de transporte indicada</motion.li>
        </motion.ol>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Reembolsos
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Una vez recibida y verificada la devolución, procesaremos el reembolso en un plazo de 3-5 días laborables
          utilizando el mismo método de pago de la compra original.
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Cambios de Talla
        </motion.h2>
        <motion.p variants={itemVariants}>
          Para cambios de talla, sigue el mismo proceso de devolución y realiza un nuevo pedido con la talla deseada.
          Esto garantiza la disponibilidad del artículo en el momento del cambio.
        </motion.p>
      </motion.div>
    </PolicyLayout>
  )
}

export default ReturnsPolicy

