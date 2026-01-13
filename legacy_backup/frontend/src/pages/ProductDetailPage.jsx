import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.getProduct(slug);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          // Select first variant by default
          if (data.variants?.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedSize) {
      toast.error('Please select size');
      return;
    }

    try {
      await addToCart(product.id, selectedVariant.id, selectedSize, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const currentImages = selectedVariant?.images || [];
  const currentPrice = product?.sale_price || product?.price;
  const originalPrice = product?.sale_price ? product?.price : null;
  const discount = originalPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

  // Get stock for selected size
  const getStockForSize = (size) => {
    if (!selectedVariant) return 0;
    const sizeInfo = selectedVariant.sizes?.find(s => s.size === size);
    return sizeInfo?.stock_qty || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white" data-testid="product-loading">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
              <div className="h-20 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/collections/all" className="text-pink-600 hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="product-detail-page">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <span>/</span>
          <Link to={`/collections/${product.category_name?.toLowerCase().replace(' ', '-')}`} className="hover:text-pink-600">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {currentImages.length > 0 ? (
                <img
                  src={currentImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="main-image"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              
              {/* Navigation arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(i => i === 0 ? currentImages.length - 1 : i - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(i => i === currentImages.length - 1 ? 0 : i + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Discount badge */}
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded">
                  {discount}% OFF
                </span>
              )}

              {/* Wishlist button */}
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-pink-50">
                <Heart size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Thumbnail gallery */}
            {currentImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-24 rounded overflow-hidden border-2 ${
                      currentImageIndex === idx ? 'border-pink-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-pink-600 font-medium mb-2">{product.category_name}</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900" data-testid="product-name">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900" data-testid="product-price">
                ₹{currentPrice?.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Fabric */}
            {product.fabric && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fabric:</span> {product.fabric}
              </p>
            )}

            {/* Color Selection */}
            {product.variants?.length > 1 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Color: <span className="text-gray-600">{selectedVariant?.color}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedSize(null);
                        setCurrentImageIndex(0);
                      }}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedVariant?.id === variant.id
                          ? 'border-pink-600 bg-pink-50 text-pink-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      data-testid={`color-${variant.color}`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">
                Size: <span className="text-gray-600">{selectedSize || 'Select a size'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedVariant?.sizes?.map((sizeInfo) => {
                  const inStock = sizeInfo.stock_qty > 0;
                  const isSelected = selectedSize === sizeInfo.size;
                  
                  return (
                    <button
                      key={sizeInfo.size}
                      onClick={() => inStock && setSelectedSize(sizeInfo.size)}
                      disabled={!inStock}
                      className={`w-14 h-10 border rounded-md text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-pink-600 bg-pink-600 text-white'
                          : inStock
                          ? 'border-gray-300 hover:border-pink-600'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                      }`}
                      data-testid={`size-${sizeInfo.size}`}
                    >
                      {sizeInfo.size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && getStockForSize(selectedSize) <= 5 && (
                <p className="text-sm text-orange-600 mt-2">
                  Only {getStockForSize(selectedSize)} left in stock
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Quantity</p>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  disabled={quantity >= 10 || (selectedSize && quantity >= getStockForSize(selectedSize))}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || cartLoading}
                className="flex-1 py-4 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="add-to-cart-btn"
              >
                {cartLoading ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
              <button className="px-4 py-4 border border-gray-300 rounded-md hover:bg-gray-50">
                <Heart size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center">
                <Truck size={24} className="text-pink-600 mb-2" />
                <p className="text-xs text-gray-600">Free Shipping above ₹2000</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={24} className="text-pink-600 mb-2" />
                <p className="text-xs text-gray-600">7 Day Easy Returns</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield size={24} className="text-pink-600 mb-2" />
                <p className="text-xs text-gray-600">COD Available</p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
