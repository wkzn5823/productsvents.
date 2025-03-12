"use client"

import { motion } from "framer-motion"
import PolicyLayout from "../components/PolicyLayout"

const Legal = () => {
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
    <PolicyLayout title="Información Legal">
      <motion.div className="prose max-w-none" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Información de la empresa
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          F S.L.
          <br />
          CIF: B12345678
          <br />
          Dirección: Calle XX, 123
          <br />
          67528 Montemorelos, Mexico
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Registro Mercantil
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Inscrita en el Registro Mercantil de Madrid
          <br />
          Tomo: XXXX
          <br />
          Folio: XXX
          <br />
          Hoja: M-XXXXXX
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Normativa aplicable
        </motion.h2>
        <motion.ul className="list-disc pl-6 mb-4" variants={containerVariants}>
          <motion.li variants={itemVariants}>
            Ley 34/2002, de Servicios de la Sociedad de la Información (LSSI)
          </motion.li>
          <motion.li variants={itemVariants}>Reglamento General de Protección de Datos (RGPD)</motion.li>
          <motion.li variants={itemVariants}>
            Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales
          </motion.li>
          <motion.li variants={itemVariants}>
            Real Decreto Legislativo 1/2007, Ley General para la Defensa de Consumidores y Usuarios
          </motion.li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Resolución de disputas
        </motion.h2>
        <motion.p variants={itemVariants}>
          Cualquier disputa relacionada con el uso de nuestro sitio web o servicios estará sujeta a las leyes de México.
          Ambas partes se someten a la jurisdicción exclusiva de los tribunales de México.
        </motion.p>
      </motion.div>
    </PolicyLayout>
  )
}

export default Legal

