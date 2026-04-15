import { Link } from 'react-router';
import { ShoppingCart, Menu, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Header() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            Mates Aconcagua
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-green-200 transition-colors">
              Inicio
            </Link>
            <Link to="/tienda" className="hover:text-green-200 transition-colors">
              Catálogo
            </Link>
            <Link to="/acerca" className="hover:text-green-200 transition-colors">
              Acerca de
            </Link>
            <Link
              to="/carrito"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name || user.email}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                    <Link
                      to="/pedidos"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-2">
            <Link
              to="/"
              className="hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className="hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              to="/acerca"
              className="hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </Link>
            <Link
              to="/carrito"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors w-fit relative"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/pedidos"
                  className="flex items-center gap-2 hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  Mis Pedidos
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-green-200 transition-colors py-2 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión ({user.name || user.email})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                Iniciar Sesión
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}