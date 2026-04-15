import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { projectId } from '/utils/supabase/info';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousUser, setPreviousUser] = useState<typeof user>(null);

  // Initialize cart from localStorage on first load
  useEffect(() => {
    if (!user && !isInitialized) {
      const savedCart = localStorage.getItem('mateShopCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Handle user logout - save cart to localStorage
  useEffect(() => {
    if (previousUser && !user && isInitialized) {
      // User just logged out, save cart to localStorage
      localStorage.setItem('mateShopCart', JSON.stringify(cart));
    }
    setPreviousUser(user);
  }, [user, previousUser, cart, isInitialized]);

  // Load cart from backend when user logs in
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (user && accessToken && !isInitialized) {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502/cart`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const backendCart = data.cart || [];
            
            // Merge local cart with backend cart if there's a local cart
            const localCart = localStorage.getItem('mateShopCart');
            if (localCart) {
              const parsedLocalCart = JSON.parse(localCart);
              const mergedCart = [...backendCart];
              
              // Add items from local cart that aren't in backend cart
              parsedLocalCart.forEach((localItem: CartItem) => {
                const existingItem = mergedCart.find(item => item.id === localItem.id);
                if (existingItem) {
                  existingItem.quantity += localItem.quantity;
                } else {
                  mergedCart.push(localItem);
                }
              });
              
              setCart(mergedCart);
              // Clear local storage after merging
              localStorage.removeItem('mateShopCart');
              
              // Save merged cart to backend
              await saveCartToBackend(mergedCart, accessToken);
            } else {
              setCart(backendCart);
            }
          }
        } catch (error) {
          console.error('Error loading cart from backend:', error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    loadCartFromBackend();
  }, [user, accessToken]);

  // Save cart to backend or localStorage
  useEffect(() => {
    if (!isInitialized) return;

    if (user && accessToken) {
      saveCartToBackend(cart, accessToken);
    } else {
      localStorage.setItem('mateShopCart', JSON.stringify(cart));
    }
  }, [cart, user, accessToken, isInitialized]);

  const saveCartToBackend = async (cartData: CartItem[], token: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502/cart`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: cartData }),
        }
      );
    } catch (error) {
      console.error('Error saving cart to backend:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = async () => {
    if (!user || !accessToken) {
      throw new Error('Debes iniciar sesión para realizar una compra');
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ cart, total: totalPrice }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al procesar la compra');
      }

      const data = await response.json();
      clearCart();
      return data.order;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}