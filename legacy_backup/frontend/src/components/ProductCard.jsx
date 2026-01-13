import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from './ui/badge';

const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Handle both API format and mock data format
  const images = product.images || [product.image];
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const displayPrice = product.sale_price || product.price;
  const discount = hasDiscount ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  return (
    <Link 
      to={`/products/${product.slug}`}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      data-testid={`product-card-${product.id}`}
    >
      {/* Product Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-gray-100"
        onMouseEnter={() => images.length > 1 && setCurrentImage(1)}
        onMouseLeave={() => setCurrentImage(0)}
      >
        <img
          src={images[currentImage] || images[0] || 'https://via.placeholder.com/400x500'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-all duration-200 z-10"
        >
          <Heart
            size={18}
            className={`transition-colors ${
              isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {product.ready_to_ship && (
            <Badge className="bg-green-500 text-white text-[10px] hover:bg-green-600">
              Ready To Ship
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-red-500 text-white text-[10px] hover:bg-red-600">
              {discount}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 lg:p-4">
        <h3 className="text-xs lg:text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-sm lg:text-base font-semibold text-gray-900">
              ₹{displayPrice?.toLocaleString('en-IN')}
            </p>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
                ₹{product.price?.toLocaleString('en-IN')}
              </p>
            )}
          </div>
          {product.fabric && (
            <p className="text-[10px] lg:text-xs text-gray-500 hidden sm:block">{product.fabric}</p>
          )}
        </div>
        
        {/* Colors preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10px] text-gray-400">
              {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none" />
    </Link>
  );
};

export default ProductCard;
