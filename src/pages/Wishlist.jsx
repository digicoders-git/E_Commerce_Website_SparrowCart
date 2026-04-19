import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart()

  if (wishlist.length === 0) return (
    <div className="bg-neutral min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4">
      <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center">
        <FiHeart size={40} className="text-pink-300" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-dark mb-2">Your wishlist is empty</h2>
        <p className="text-muted text-sm">Save items you love to your wishlist.</p>
      </div>
      <Link to="/products" className="bg-teal text-white px-8 py-3.5 rounded-xl font-bold hover:bg-teal-light transition">
        Explore Products
      </Link>
    </div>
  )

  return (
    <div className="bg-neutral min-h-screen">
      <div className="bg-gradient-to-r from-teal to-teal-light py-10 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold">My Wishlist</h1>
          <p className="text-white/70 text-sm mt-1">{wishlist.length} saved items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(product => {
            const discount = product.originalPrice > product.price
              ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition group">
                <div className="relative">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-coral text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition"
                  >
                    <FiTrash2 className="text-coral" size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-xs text-accent font-semibold uppercase">{product.category}</span>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-dark text-sm mt-1 mb-2 line-clamp-2 hover:text-teal transition">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-teal font-bold">₹{product.price.toLocaleString()}</span>
                      {discount > 0 && <span className="text-muted text-xs line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full bg-coral hover:bg-coral-dark text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
