"use client"

import { motion } from "framer-motion"
import PolicyLayout from "../components/PolicyLayout"

const TermsOfService = () => {
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
    <PolicyLayout title="Términos de Servicio">
      <motion.div className="prose max-w-none" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Aceptación de los términos
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso. Si no estás
          de acuerdo con alguna parte de estos términos, no podrás acceder al sitio web.
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Uso del sitio
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Te concedemos una licencia limitada para acceder y hacer uso personal de este sitio web. No puedes:
        </motion.p>
        <motion.ul className="list-disc pl-6 mb-4" variants={containerVariants}>
          <motion.li variants={itemVariants}>Modificar o copiar los materiales</motion.li>
          <motion.li variants={itemVariants}>Usar los materiales para fines comerciales</motion.li>
          <motion.li variants={itemVariants}>Intentar descompilar o realizar ingeniería inversa del software</motion.li>
          <motion.li variants={itemVariants}>Eliminar cualquier copyright u otras notaciones propietarias</motion.li>
        </motion.ul>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Precios y disponibilidad
        </motion.h2>
        <motion.p className="mb-4" variants={itemVariants}>
          Los precios y la disponibilidad de los productos están sujetos a cambios sin previo aviso. Nos reservamos el
          derecho de modificar o discontinuar cualquier producto en cualquier momento.
        </motion.p>

        <motion.h2 className="text-xl font-semibold mb-4" variants={itemVariants}>
          Cuenta de usuario
        </motion.h2>
        <motion.p variants={itemVariants}>
          Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Nos reservamos el derecho de
          rechazar el servicio, eliminar cuentas, o cancelar pedidos a nuestra única discreción.
        </motion.p>
      </motion.div>
    </PolicyLayout>
  )
}

export default TermsOfService

