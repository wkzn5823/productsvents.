import { Link } from 'react-router-dom'

interface PolaroidCardProps {
  id: number
  imageUrl: string
  title: string
  subtitle?: string
  overlayColor?: string
}

const PolaroidCard = ({ id, imageUrl, title, subtitle, overlayColor = "pink" }: PolaroidCardProps) => {
  return (
    <Link to={`/product/${id}`} className="block">
      <div className="relative group transition-transform duration-200 hover:scale-105">
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <div className="relative w-full aspect-square mb-4">
            <img 
              src={imageUrl || "/placeholder.svg"} 
              alt={title} 
              className="w-full h-full object-contain"
            />
            <div
              className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
              style={{ backgroundColor: overlayColor === "pink" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.1)" }}
            />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-bold text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PolaroidCard
