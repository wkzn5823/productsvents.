import type React from "react"
import Header from "./Header"
import Footer from "./Footer"

interface PolicyLayoutProps {
  children: React.ReactNode
  title: string
}

const PolicyLayout = ({ children, title }: PolicyLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
        <div className="bg-white p-8 rounded-lg shadow">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

export default PolicyLayout

