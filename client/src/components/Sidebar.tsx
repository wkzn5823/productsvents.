"use client"

import { X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (user) {
      try {
        const parsedUser = JSON.parse(user)
        setIsAdmin(parsedUser.role_id === 1)
      } catch (error) {
        console.error("Error al parsear el usuario desde localStorage:", error)
        setIsAdmin(false)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const linkClass = useCallback(
    (path: string) => `
    block py-2 px-4 rounded-md transition-all duration-200 ease-in-out
    ${location.pathname === path ? "text-gray-900 bg-gray-200" : "text-gray-700"}
    hover:text-gray-900 hover:bg-gray-100
    relative overflow-hidden
  `,
    [location.pathname],
  )

  const handleNavigation = useCallback(
    (path: string) => {
      onClose()
      setTimeout(() => navigate(path), 50)
    },
    [navigate, onClose],
  )

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-50 transition-opacity" onClick={onClose} />}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-md" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
            <X className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
          </button>

          <nav className="mt-8">
            <ul className="space-y-1">
              {[
                { path: "/home", label: "Inicio" },
                { path: "/tshirts", label: "Camisetas" },
                { path: "/hoodies", label: "Hoodies" },
                { path: "/accessories", label: "Accesorios" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <button className={linkClass(path)} onClick={() => handleNavigation(path)}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {isAdmin && (
            <div className="mt-8 pt-8 border-t border-gray-300">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Administración</h2>
              <ul className="space-y-1">
                {[
                  { path: "/admin-ventas", label: "Gestionar Ventas" },
                  { path: "/admin-productos", label: "Gestionar Productos" },
                  { path: "/admin-categorias", label: "Gestionar Categorías" },
                  { path: "/admin-usuarios", label: "Gestionar Usuarios" },
                ].map(({ path, label }) => (
                  <li key={path}>
                    <button className={linkClass(path)} onClick={() => handleNavigation(path)}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-300">
            <ul className="space-y-1">
              {[
                { path: "/nosotros", label: "Sobre Nosotros" },
                { path: "/contacto", label: "Contacto" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <button className={linkClass(path)} onClick={() => handleNavigation(path)}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

