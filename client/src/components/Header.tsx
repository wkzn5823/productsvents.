import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, LogOut, X } from 'lucide-react'; // ✅ Importamos X para cerrar el carrito
import Sidebar from './Sidebar';
import Cart from '../pages/Cart';
import { useCart } from '../context/CartContext';
import Logo from "../assets/Logo.png";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role_id');
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <Link to="/Home" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-12 w-auto" />
            </Link>

            <div className="flex items-center gap-4">
              <button 
                className="text-sm relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-5 h-5" />
                  Carrito
                </span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* ✅ Agregamos el botón de cierre dentro del carrito */}
      {isCartOpen && (
        <div className="fixed top-16 right-4 z-50 bg-white shadow-lg p-4 rounded-lg w-96">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold">Carrito</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsCartOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <Cart />
        </div>
      )}
    </>
  );
};

export default Header;
