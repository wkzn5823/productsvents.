"use client"

import { motion } from "framer-motion"
import PolicyLayout from "../components/PolicyLayout"

const ShippingPolicy = () => {
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
    <PolicyLayout title="Política de Envíos">
      <motion.div className="prose max-w-none" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Plazos de Entrega
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Los pedidos se procesan y envían en un plazo de 24-48 horas laborables desde la confirmación del pago. Los
          plazos de entrega estimados son:
        </motion.p>
        <motion.ul className="list-disc pl-6 mb-4" variants={itemVariants}>
          <li>Península: 2-3 días laborables</li>
          <li>Baleares: 3-4 días laborables</li>
          <li>Canarias: 5-7 días laborables</li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Costes de Envío
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Los gastos de envío se calculan en función del destino y se muestran antes de finalizar la compra:
        </motion.p>
        <motion.ul className="list-disc pl-6 mb-4" variants={itemVariants}>
          <li>Península: Envío gratuito para pedidos superiores a 50€</li>
          <li>Baleares: 5€ adicionales</li>
          <li>Canarias: 10€ adicionales (impuestos y tasas no incluidos)</li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Seguimiento del Pedido
        </motion.h2>
        <motion.p variants={itemVariants}>
          Una vez realizado el envío, recibirás un email con el número de seguimiento para que puedas consultar el
          estado de tu pedido en tiempo real.
        </motion.p>
      </motion.div>
    </PolicyLayout>
  )
}

export default ShippingPolicy

