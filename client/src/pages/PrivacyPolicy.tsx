"use client"

import { motion } from "framer-motion"
import PolicyLayout from "../components/PolicyLayout"

const PrivacyPolicy = () => {
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
    <PolicyLayout title="Política de Privacidad">
      <motion.div className="prose max-w-none" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Información que recopilamos
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Recopilamos información personal cuando realizas una compra, te registras en nuestra web o te suscribes a
          nuestro boletín. Esta información puede incluir:
        </motion.p>
        <motion.ul className="list-disc pl-6 mb-4" variants={containerVariants}>
          <motion.li variants={itemVariants}>Nombre y apellidos</motion.li>
          <motion.li variants={itemVariants}>Dirección de correo electrónico</motion.li>
          <motion.li variants={itemVariants}>Dirección de envío</motion.li>
          <motion.li variants={itemVariants}>Información de pago</motion.li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Uso de la información
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Utilizamos tu información personal para:
        </motion.p>
        <motion.ul className="list-disc pl-6 mb-4" variants={containerVariants}>
          <motion.li variants={itemVariants}>Procesar tus pedidos</motion.li>
          <motion.li variants={itemVariants}>Enviarte actualizaciones sobre tu pedido</motion.li>
          <motion.li variants={itemVariants}>Mejorar nuestros productos y servicios</motion.li>
          <motion.li variants={itemVariants}>Personalizar tu experiencia de compra</motion.li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Protección de datos
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Implementamos medidas de seguridad para proteger tu información personal contra acceso, alteración,
          divulgación o destrucción no autorizada.
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Tus derechos
        </motion.h2>
        <motion.p variants={itemVariants}>
          Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos. Para ejercer estos
          derechos, contacta con nosotros a través de nuestro formulario de contacto.
        </motion.p>
      </motion.div>
    </PolicyLayout>
  )
}

export default PrivacyPolicy

