import { Link } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function ProductCard({ product }) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(rating)) return <FaStar key={i} className="text-yellow-400" size={12} />
      if (i < rating) return <FaStarHalfAlt key={i} className="text-yellow-400" size={12} />
      return <FaRegStar key={i} className="text-gray-300" size={12} />
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-border hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow animate-pulse">
              NEW
            </span>
          )}
          {product.badge && (
            <span className="bg-coral text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
              -{discount}%
            </span>
          )}
        </div>


      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-dark font-semibold text-sm mb-2 line-clamp-2 hover:text-teal transition">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-teal font-bold text-lg">₹{product.price.toLocaleString()}</span>
            {discount > 0 && (
              <span className="text-gray-400 text-xs line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
