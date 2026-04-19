import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { FiShoppingCart, FiCheckCircle, FiRefreshCw, FiShield, FiTruck, FiHeart, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi'
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isWishlisted } = useCart()
  const product = products.find(p => p.id === Number(id))
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div className="text-center py-20 text-muted">
      Product not found. <Link to="/products" className="text-accent underline">Go back</Link>
    </div>
  )

  const wishlisted = isWishlisted(product.id)
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return <FaStar key={i} className="text-yellow-400" size={16} />
    if (i < rating) return <FaStarHalfAlt key={i} className="text-yellow-400" size={16} />
    return <FaRegStar key={i} className="text-gray-300" size={16} />
  })

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-neutral min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted mb-6 flex-wrap">
          <Link to="/" className="hover:text-teal transition">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="hover:text-teal transition">Products</Link>
          <FiChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} className="hover:text-teal transition">{product.category}</Link>
          <FiChevronRight size={14} />
          <span className="text-dark font-medium">{product.name}</span>
        </div>

        {/* Main */}
        <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-10 flex flex-col md:flex-row gap-10 mb-8">

          {/* Image */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden bg-gray-50">
              <img src={product.image} alt={product.name} className="w-full max-h-[420px] object-cover" />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-coral text-white font-bold text-sm px-3 py-1 rounded-xl">
                  -{discount}% OFF
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 right-4 bg-teal text-white font-bold text-sm px-3 py-1 rounded-xl">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-widest">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-dark mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
              <span className="text-dark font-semibold text-sm">{product.rating}</span>
              <span className="text-muted text-sm">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-teal">₹{product.price.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="text-muted text-lg line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-lg">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                </>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Features */}
            {product.features && (
              <div className="grid grid-cols-2 gap-2">
                {product.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-dark">
                    <FiCheckCircle className="text-green-500 shrink-0" size={14} />
                    {f}
                  </div>
                ))}
              </div>
            )}

            <div className="h-px bg-border" />

            {/* Qty */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-dark">Quantity:</span>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-dark">
                  <FiMinus size={14} />
                </button>
                <span className="w-12 text-center font-bold text-dark">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition text-dark">
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                className={`flex-1 min-w-[140px] font-bold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-coral hover:bg-coral-dark text-white'}`}
              >
                {added ? <><FiCheckCircle /> Added!</> : <><FiShoppingCart /> Add to Cart</>}
              </button>
              <Link
                to="/cart"
                onClick={handleAddToCart}
                className="flex-1 min-w-[140px] bg-teal hover:bg-teal-light text-white font-bold px-6 py-3.5 rounded-xl transition text-center"
              >
                Buy Now
              </Link>
              <button
                onClick={() => toggleWishlist(product)}
                className="w-12 h-12 border border-border rounded-xl flex items-center justify-center hover:border-coral transition"
              >
                {wishlisted ? <FaHeart className="text-coral" size={18} /> : <FiHeart className="text-muted" size={18} />}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { icon: <FiTruck className="text-blue-500" />, text: 'Free Delivery' },
                { icon: <FiRefreshCw className="text-purple-500" />, text: 'Easy Returns' },
                { icon: <FiShield className="text-green-500" />, text: '1 Year Warranty' },
                { icon: <FiCheckCircle className="text-teal" />, text: '100% Genuine' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 bg-neutral rounded-xl px-3 py-2 text-sm text-dark">
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden mb-14">
          <div className="flex border-b border-border">
            {['description', 'features', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition ${activeTab === tab ? 'text-teal border-b-2 border-teal' : 'text-muted hover:text-dark'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <p className="text-dark text-sm leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'features' && (
              <ul className="space-y-3">
                {product.features?.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-dark">
                    <FiCheckCircle className="text-green-500 shrink-0" size={16} /> {f}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-extrabold text-dark">{product.rating}</div>
                  <div>
                    <div className="flex gap-1">{renderStars(product.rating)}</div>
                    <div className="text-muted text-sm mt-1">Based on {product.reviews} reviews</div>
                  </div>
                </div>
                <p className="text-muted text-sm">Detailed reviews coming soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
