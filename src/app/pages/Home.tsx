import { Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';

export function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl mb-6">
            Bienvenido a Mates Aconcagua
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Los mejores mates, bombillas y accesorios para disfrutar de tu tradición favorita
          </p>
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 bg-white text-green-800 px-8 py-3 rounded-lg text-lg hover:bg-green-50 transition-colors"
          >
            Ver Catálogo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Ver Todos los Productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              La Tradición del Mate
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              El mate es más que una bebida, es un ritual que une a familias y amigos.
              En Mate Shop encontrarás todo lo necesario para mantener viva esta hermosa tradición.
            </p>
            <p className="text-lg text-gray-700">
              Desde mates artesanales hasta termos de última generación, tenemos todo lo que necesitas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
