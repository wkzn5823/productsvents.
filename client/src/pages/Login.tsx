"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"
import { motion } from "framer-motion"
import ElegantNotification from "../components/ElegantNotification"
import myImage from '../assets/imgI.webp'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const API_URL = "http://localhost:8000/api"
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (accessToken && user.role_id) {
      navigate(user.role_id === 1 ? "/admin-dashboard" : "/home")
    }
  }, [navigate])

  useEffect(() => {
    setTimeout(() => setImageLoaded(true), 100)
  }, [])

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (accessToken && user.role_id === 1 && location.pathname !== "/admin-dashboard") {
      navigate("/admin-dashboard")
    }
  }, [navigate, location])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setNotification(null)

    try {
      let response

      if (isLogin) {
        response = await axios.post(
          `${API_URL}/auth/login`,
          {
            email,
            contraseña: password,
          },
          { withCredentials: true },
        )

        if (response.data.success) {
          const user = response.data.user
          const token = response.data.accessToken


          localStorage.setItem("accessToken", token)
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: user.id,
              nombre: user.nombre,
              email: user.email,
              role_id: user.role_id,
            }),
          )

          setNotification({ type: "success", text: "Inicio de sesión exitoso. Redirigiendo..." })

          setTimeout(() => {
            navigate(user.role_id === 1 ? "/admin-dashboard" : "/home")
            window.location.reload()
          }, 2000)
        }
      } else {

        response = await axios.post(
          `${API_URL}/auth/register-client`,
          {
            nombre: name,
            email,
            contraseña: password,
          },
          {
            headers: { "Content-Type": "application/json" },
          },
        )
        setNotification({ type: "success", text: "Registro exitoso. Redirigiendo a inicio de sesión..." })

        setTimeout(() => {
          setIsLogin(true)
          setName("")
          setEmail("")
          setPassword("")
        }, 2000)
      }
    } catch (err: unknown) {
      console.error("🚨 Error en la solicitud:", err)

      if (axios.isAxiosError(err)) {
        setNotification({ type: "error", text: err.response?.data?.error || "Error en el proceso" })
      } else {
        setNotification({ type: "error", text: "Ocurrió un error inesperado." })
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 20 },
    },
  }

  return (
    <div style={styles.pageContainer}>
      <ElegantNotification
        message={notification?.text}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={styles.leftContainer}
      >
        <motion.div style={styles.formContainer} variants={containerVariants} initial="hidden" animate="visible">
          <motion.form onSubmit={handleSubmit} style={styles.form} variants={containerVariants}>
            <motion.h2 style={styles.title} variants={itemVariants}>
              {isLogin ? "LOGIN" : "REGÍSTRATE"}
            </motion.h2>

            <motion.div style={styles.inputContainer} variants={itemVariants}>
              {isLogin ? <FaEnvelope style={styles.icon} /> : <FaUser style={styles.icon} />}
              <input
                type={isLogin ? "email" : "text"}
                value={isLogin ? email : name}
                onChange={(e) => (isLogin ? setEmail(e.target.value) : setName(e.target.value))}
                style={styles.input}
                placeholder={isLogin ? "Correo" : "Nombre"}
                required
              />
            </motion.div>

            {!isLogin && (
              <motion.div style={styles.inputContainer} variants={itemVariants}>
                <FaEnvelope style={styles.icon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="Correo"
                  required
                />
              </motion.div>
            )}

            <motion.div style={styles.inputContainer} variants={itemVariants}>
              <FaLock style={styles.icon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Contraseña"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              style={styles.button}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{isLogin ? "INICIAR" : "REGISTRAR"}</span>
            </motion.button>

            <motion.p style={styles.registerText} variants={itemVariants}>
              {isLogin ? "No tienes una cuenta?" : "Ya tienes una cuenta?"}{" "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} style={styles.registerLink}>
                {isLogin ? "Regístrate" : "Inicia Sesión"}
              </button>
            </motion.p>
          </motion.form>
        </motion.div>
      </motion.div>
      <motion.div
        style={{
          ...styles.rightContainer,
          opacity: imageLoaded ? 1 : 0,
        }}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

const styles = {
  pageContainer: {
    display: "flex",
    width: "100vw",
    height: "100vh",
  },
  leftContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    position: "relative" as const,
  },
  rightContainer: {
    width: "50%",
    height: "100vh",
    backgroundImage: `url(${myImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "15px",
    transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
  },
  title: {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  form: {
    textAlign: "center" as const,
    width: "280px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    borderBottom: "2px solid #000",
    marginBottom: "15px",
    paddingBottom: "5px",
  },
  icon: {
    marginRight: "10px",
    fontSize: "18px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    padding: "8px",
    background: "transparent",
    fontFamily: "Poppins, sans-serif",
  },
  button: {
    background: "#000",
    border: "none",
    padding: "10px 20px",
    fontSize: "15px",
    fontWeight: 600,
    width: "120px",
    cursor: "pointer",
    transform: "skew(-21deg)",
    color: "#fff",
  },
  registerText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  registerLink: {
    border: "none",
    color: "black",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
    background: "transparent",
  },
}

export default Login

