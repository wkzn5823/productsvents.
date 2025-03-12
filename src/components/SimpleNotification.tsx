"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface SimpleNotificationProps {
  message: string | null
  type: "success" | "error" | null
  onClose: () => void
}

const SimpleNotification: React.FC<SimpleNotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 min-w-[300px] max-w-md"
      >
        <div className="bg-gray-900 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            {type === "success" && (
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-green-400" />
              </div>
            )}
            <p className="text-white flex-1">{message}</p>
            <button
              onClick={onClose}
              className="px-4 py-1 bg-blue-100/20 hover:bg-blue-100/30 
                text-blue-100 rounded-lg text-sm transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SimpleNotification

