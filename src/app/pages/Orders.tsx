import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { projectId } from '/utils/supabase/info';
import { Package, ShoppingBag } from 'lucide-react';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export function Orders() {
  const { user, accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502/orders`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        
        if (response.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, accessToken, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando tus pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl mb-4">No tenés pedidos aún</h2>
          <p className="text-gray-600 mb-8">
            ¡Realizá tu primera compra y empieza a disfrutar de nuestros productos!
          </p>
          <Link
            to="/tienda"
            className="inline-block bg-[#c7e47d] text-[#4a5f2f] px-8 py-3 rounded-lg hover:bg-[#b8d66e] transition-colors"
          >
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl mb-8">Mis Pedidos</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-[#c7e47d]" />
                    <h3 className="font-semibold text-lg">
                      Pedido #{order.id.slice(0, 8)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className="bg-[#c7e47d]/20 text-[#6b8e3d] px-3 py-1 rounded-full text-sm">
                  {order.status === 'completed' ? 'Completado' : order.status}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Productos:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#c7e47d]">
                  ${order.total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
