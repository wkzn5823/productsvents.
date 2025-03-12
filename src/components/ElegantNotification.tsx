"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

interface ElegantNotificationProps {
  message: string | undefined
  type: "success" | "error" | undefined
  onClose: () => void
}

const ElegantNotification = ({ message, type, onClose }: ElegantNotificationProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  const getColor = () => {
    switch (type) {
      case "success":
        return "#10B981" // Verde para éxito
      case "error":
        return "#EF4444" // Rojo para error
      default:
        return "#4B5563" // Gris oscuro para otros casos
    }
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            backgroundColor: "white",
            color: getColor(),
            padding: "1rem 2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
            maxWidth: "400px",
            fontFamily: "Poppins, sans-serif",
            border: `2px solid ${getColor()}`,
          }}
        >
          <span style={{ fontSize: "1rem", flex: 1 }}>{message}</span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: getColor(),
              cursor: "pointer",
              padding: "4px",
              marginLeft: "16px",
              fontSize: "1.2rem",
              opacity: 0.8,
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ElegantNotification

