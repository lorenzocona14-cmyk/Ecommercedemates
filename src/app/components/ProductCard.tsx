import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl text-green-700">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-green-700 hover:bg-green-600 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Agregado
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Agregar
              </>
            )}
          </button>
        </div>
        {isInCart && !isAdded && (
          <p className="text-xs text-green-600 mt-2">Ya está en tu carrito</p>
        )}
      </div>
    </div>
  );
}
