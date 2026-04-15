import { createBrowserRouter } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Orders } from './pages/Orders';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'tienda', Component: Shop },
      { path: 'carrito', Component: Cart },
      { path: 'acerca', Component: About },
      { path: 'login', Component: Login },
      { path: 'registro', Component: Signup },
      { path: 'pedidos', Component: Orders },
    ],
  },
]);