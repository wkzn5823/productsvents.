import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm text-gray-600 flex-wrap gap-2">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span>&copy;2024 Reservados todos los derechos</span>
            <span className="hidden sm:inline">·</span>
            <Link to="/shipping" className="hover:text-gray-900">
              Política de envíos
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/returns" className="hover:text-gray-900">
              Cambios y Devoluciones
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/cookies" className="hover:text-gray-900">
              Política de cookies
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/privacy" className="hover:text-gray-900">
              Política de privacidad
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/terms-of-service" className="hover:text-gray-900">
              Términos de servicio
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/legal" className="hover:text-gray-900">
              Legal
            </Link>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-900"
          >
            <Facebook className="w-5 h-5"/>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-900"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
