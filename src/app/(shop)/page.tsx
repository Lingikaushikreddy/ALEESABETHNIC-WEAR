
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Heart, Zap } from 'lucide-react'

// Neerus-style Product Card
const ProductCard = ({ product }: { product: any }) => (
  <Link href={`/products/${product.slug}`} className="group block relative cursor-pointer">
    <div className="aspect-[2/3] bg-gray-100 overflow-hidden relative">
      {/* Image */}
      <img
        src={product.images[0] || 'https://placehold.co/600x900?text=No+Image'}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Wishlist Icon */}
      <button className="absolute top-3 right-3 text-white/80 hover:text-primary transition-colors z-20">
        <Heart strokeWidth={1.5} size={24} />
      </button>

      {/* Ready to Ship Badge */}
      <div className="absolute bottom-3 left-0 bg-primary/90 text-white text-[10px] uppercase font-bold px-2 py-1 flex items-center gap-1">
        <Zap size={10} fill="currentColor" /> Ready to Ship
      </div>
    </div>

    <div className="mt-3 text-center">
      <h3 className="text-sm text-text-main font-medium truncate px-2 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <div className="mt-1 flex justify-center items-center gap-2">
        <span className="text-sm font-bold text-text-main">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        {product.salePrice && (
          <span className="text-xs text-gray-500 line-through">
            ₹{product.salePrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </div>
  </Link>
)

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden bg-gradient-to-br from-purple-900 to-purple-700">
        {/* Background Image */}
        <img
          src="/hero-banner.png"
          className="w-full h-full object-cover object-center"
          alt="Aleesa Ethnic Wear - Timeless Traditions, Refined"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-center">
          <div className="max-w-2xl px-4 animate-fade-in-up">
            <h2 className="text-white font-heading font-medium tracking-[4px] uppercase text-sm mb-4">#aleesaethnicwear</h2>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Timeless Traditions,<br />Refined
            </h1>
            <p className="text-white/90 text-lg mb-8 font-light">
              We dream not only of making women more beautiful but happier too
            </p>
            <Link
              href="/collections/new-arrivals"
              className="inline-block bg-white text-black px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Categories / Collections Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Sarees', img: '/category-sarees.png' },
            { title: 'Suits', img: '/category-suits.png' },
            { title: 'Lehengas', img: '/category-lehengas.png' },
          ].map((cat) => (
            <Link key={cat.title} href={`/collections/${cat.title.toLowerCase()}`} className="group relative aspect-[3/4] overflow-hidden cursor-pointer">
              <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <h3 className="text-white font-heading font-bold text-2xl uppercase tracking-widest border-b-2 border-white pb-2 hover:border-primary transition-all">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold uppercase tracking-widest mb-3">Trending Now</h2>
          <div className="w-16 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/collections/all"
            className="inline-block border border-black text-black px-12 py-3 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
