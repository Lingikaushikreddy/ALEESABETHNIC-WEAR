import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../componen@/components/ProductCard';
import { products } from '../mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../componen@/components/ui/select';
import { Filter } from 'lucide-react';

const NewArrivals = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    sizes: [],
    colors: [],
    categories: []
  });
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const handleWishlistToggle = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Filter products
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const hasMatchingSize = filters.sizes.some(size => product.size.includes(size));
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (filters.colors.length > 0) {
        if (!filters.colors.includes(product.color)) return false;
      }

      // Category filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) return false;
      }

      return true;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-za':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={0} wishlistCount={wishlist.length} />

      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              New Arrivals: Latest Indian Ethnic Wear Online – Fresh Styles Every Week
            </h1>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              Stay ahead of trends with Neeru's <strong>latest collection of Indian ethnic wear</strong> — fresh silhouettes, 
              vibrant hues, and modern detailing that redefine tradition. From elegant sarees and chic kurtas to festive 
              lehengas and statement gowns, discover <strong>new styles added every week</strong> to elevate every occasion.
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                Filter
              </button>
              <p className="text-gray-600">
                <span className="font-semibold">{sortedProducts.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-az">Name: A to Z</SelectItem>
                  <SelectItem value="name-za">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar filters={filters} setFilters={setFilters} isMobile={false} />
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
              />
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, 500],
                      sizes: [],
                      colors: [],
                      categories: []
                    })}
                    className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewArrivals;
