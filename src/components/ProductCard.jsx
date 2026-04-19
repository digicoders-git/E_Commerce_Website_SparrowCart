import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart()
  const wishlisted = isWishlisted(product.id)
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
        <div className="absolute top-3 left-3 flex flex-col gap-1">
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

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          {wishlisted
            ? <FaHeart className="text-coral" size={14} />
            : <FiHeart className="text-gray-400" size={14} />
          }
        </button>

        {/* Quick actions overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-white text-dark text-xs font-semibold py-2 rounded-lg hover:bg-accent hover:text-white transition flex items-center justify-center gap-1"
          >
            <FiShoppingCart size={13} /> Add to Cart
          </button>
          <Link
            to={`/products/${product.id}`}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-accent hover:text-white transition"
          >
            <FiEye size={14} />
          </Link>
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
