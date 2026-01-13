import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts({ page_size: 8, sort: 'featured' }),
          api.getCategories()
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setFeaturedProducts(data.products);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.filter(c => c.slug !== 'new-arrivals').slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-pink-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1 bg-pink-200 text-pink-700 text-sm font-medium rounded-full mb-4">
                New Collection 2025
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Celebrate Your
                <span className="text-pink-600 block">Ethnic Beauty</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover the finest collection of Indian ethnic wear. From elegant sarees to stunning lehengas, find your perfect outfit for every occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/collections/new-arrivals"
                  className="px-8 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                  data-testid="shop-now-btn"
                >
                  Shop New Arrivals
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/collections/suits"
                  className="px-8 py-3 border-2 border-pink-600 text-pink-600 font-medium rounded-md hover:bg-pink-50 transition-colors"
                >
                  Explore Collections
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop"
                  alt="Indian ethnic wear"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-2xl font-bold text-pink-600">₹2,499</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections of Indian ethnic wear
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/collections/${category.slug}`}
                className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square hover:shadow-lg transition-all"
                data-testid={`category-${category.slug}`}
              >
                <img
                  src={`https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&q=80`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Featured Collection
              </h2>
              <p className="text-gray-600 mt-2">Handpicked styles for you</p>
            </div>
            <Link
              to="/collections/new-arrivals"
              className="hidden sm:flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700"
            >
              View All
              <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/collections/new-arrivals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold mb-2">10K+</p>
              <p className="text-pink-200 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">500+</p>
              <p className="text-pink-200 text-sm">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">50+</p>
              <p className="text-pink-200 text-sm">Cities Delivered</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-2">4.8★</p>
              <p className="text-pink-200 text-sm">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Follow Us on Instagram
          </h2>
          <p className="text-gray-600 mb-8">@aleesaethnicwear</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-gray-100 rounded overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img
                  src={`https://images.unsplash.com/photo-16100304699${80 + i}-98e550d6193c?w=200&h=200&fit=crop`}
                  alt="Instagram post"
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
