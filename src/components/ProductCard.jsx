import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
  ))

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-coral text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-accent font-medium mb-1">{product.category}</span>
        <h3 className="text-dark font-semibold text-base mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 text-sm mb-2">
          {stars}
          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-teal font-bold text-lg">₹{product.price.toLocaleString()}</span>
          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="text-xs border border-teal text-teal px-3 py-1.5 rounded-lg hover:bg-teal hover:text-white transition"
            >
              View
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="text-xs bg-coral hover:bg-coral-dark text-white px-3 py-1.5 rounded-lg transition font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
