"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CamisasImg from "../assets/Camisas.webp"
import HoodiesImg from "../assets/Hoddies.webp"
import AccesoriosImg from "../assets/Accesorios.webp"

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const categories = [
    {
      id: "tshirts",
      name: "CAMISETAS",
      imageUrl: CamisasImg,
      link: "/tshirts",
    },
    {
      id: "hoodies",
      name: "HOODIES",
      imageUrl: HoodiesImg,
      link: "/hoodies",
    },
    {
      id: "accessories",
      name: "ACCESORIOS",
      imageUrl: AccesoriosImg,
      link: "/accessories",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main
        className={`flex-grow container mx-auto px-4 pt-24 pb-16 transition-opacity duration-1000 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.link}
              className="block transform transition-all duration-300 hover:scale-105 hover:rotate-0"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.2}s forwards`, // Asegura que la animación esté bien estructurada
                opacity: 1, // Cambio aquí a 1 para asegurar que no haya problemas con el valor
              }}
            >
              <div className="relative group">
                <div
                  className="absolute top-1 left-1 w-full h-full bg-white shadow-md rounded-lg transition-transform duration-300 group-hover:rotate-6"
                  style={{ transform: "rotate(3deg)" }}
                />
                <div
                  className="absolute top-0.5 left-0.5 w-full h-full bg-white shadow-md rounded-lg transition-transform duration-300 group-hover:-rotate-4"
                  style={{ transform: "rotate(-2deg)" }}
                />
                <div
                  className="relative bg-white p-4 shadow-lg rounded-lg transition-transform duration-300 group-hover:rotate-0"
                  style={{ transform: "rotate(1deg)" }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={category.imageUrl || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="relative mt-4 pb-2 text-center">
                    <h3
                      className="text-3xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: "0.1em",
                        transform: "rotate(-2deg)",
                        textShadow: "1px 1px 0px rgba(0,0,0,0.1)",
                      }}
                    >
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Home
