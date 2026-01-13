import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const CollectionPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  
  // Filter sections expand state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    size: true,
    color: false,
  });

  const sizes = ['M', 'L', 'XL', 'XXL', '3XL'];
  const colors = ['Pink', 'Blue', 'Green', 'Red', 'Yellow', 'Purple', 'White', 'Black', 'Maroon', 'Gold'];

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.getCategory(slug);
        if (response.ok) {
          const data = await response.json();
          setCategory(data);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };
    
    if (slug && slug !== 'all') {
      fetchCategory();
    }
  }, [slug]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          page_size: 12,
          sort: sortBy,
        };
        
        if (slug && slug !== 'all') {
          params.category = slug;
        }
        
        if (priceRange[0] > 0) {
          params.min_price = priceRange[0];
        }
        if (priceRange[1] < 25000) {
          params.max_price = priceRange[1];
        }
        if (selectedSizes.length > 0) {
          params.sizes = selectedSizes.join(',');
        }
        if (selectedColors.length > 0) {
          params.colors = selectedColors.join(',');
        }
        
        const response = await api.getProducts(params);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          setTotalProducts(data.total);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [slug, currentPage, sortBy, priceRange, selectedSizes, selectedColors]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [currentPage, sortBy, setSearchParams]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPriceRange([0, 25000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 25000;

  const categoryTitle = useMemo(() => {
    if (category) return category.name;
    if (slug === 'all') return 'All Products';
    return slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }, [category, slug]);

  const FilterSidebar = ({ isMobile = false, onClose }) => (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white overflow-y-auto' : 'sticky top-24'} bg-white rounded-lg border border-gray-200 p-4`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Price
          {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={(val) => { setPriceRange(val); setCurrentPage(1); }}
              min={0}
              max={25000}
              step={500}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
              <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Size
          {expandedSections.size ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.size && (
          <div className="space-y-2">
            {sizes.map(size => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => handleSizeToggle(size)}
                />
                <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Color
          {expandedSections.color ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedSections.color && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {colors.map(color => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={() => handleColorToggle(color)}
                />
                <Label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                  {color}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50"
        >
          Clear All Filters
        </button>
      )}

      {isMobile && (
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Apply Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" data-testid="collection-page">
      {/* Hero Section */}
      <div className="bg-white py-8 lg:py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {categoryTitle}
          </h1>
          {category?.description && (
            <p className="text-gray-600 max-w-3xl">{category.description}</p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              data-testid="filter-btn"
            >
              <Filter size={18} />
              Filter
            </button>
            <p className="text-gray-600">
              <span className="font-semibold">{totalProducts}</span> products
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-[180px]" data-testid="sort-select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="name-az">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <FilterSidebar isMobile onClose={() => setShowMobileFilters(false)} />
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6" data-testid="product-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
