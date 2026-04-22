import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const searchTerm = searchParams.get('search') || '';

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'mates', name: 'Mates' },
    { id: 'bombillas', name: 'Bombillas' },
    { id: 'yerba', name: 'Yerba' },
    { id: 'accesorios', name: 'Accesorios' },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchTerm) {
      setSearchParams({});
    }
  };

  let filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(lowerSearch) ||
      p.description.toLowerCase().includes(lowerSearch) ||
      p.category.toLowerCase().includes(lowerSearch)
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-8">
          Nuestro Catálogo
        </h1>

        {searchTerm && (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">
              Resultados de búsqueda para: <span className="font-semibold">"{searchTerm}"</span>
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSelectedCategory('all');
              }}
              className="text-[#6b8e3d] hover:text-[#a8c95f] text-sm mt-2"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Category Filter */}
        {!searchTerm && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#c7e47d] text-[#4a5f2f]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-center text-gray-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-12">
            No se encontraron productos.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex gap-2">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[#c7e47d] text-[#4a5f2f]'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
