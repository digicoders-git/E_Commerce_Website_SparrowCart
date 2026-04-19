import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const product = products.find(p => p.id === Number(id))
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)

  if (!product) return (
    <div className="text-center py-20 text-gray-400">
      Product not found. <Link to="/products" className="text-accent underline">Go back</Link>
    </div>
  )

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>★</span>
  ))

  return (
    <div className="bg-neutral min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-teal">Home</Link> /
          <Link to="/products" className="hover:text-teal mx-1">Products</Link> /
          <span className="text-dark ml-1">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Image */}
          <div className="flex-1">
            <img src={product.image} alt={product.name} className="w-full max-h-96 object-cover rounded-2xl" />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-accent text-sm font-semibold uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-extrabold text-dark">{product.name}</h1>
            <div className="flex items-center gap-2">{stars}<span className="text-gray-400 text-sm">({product.reviews} reviews)</span></div>
            <div className="text-4xl font-bold text-teal">₹{product.price.toLocaleString()}</div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium quality {product.name.toLowerCase()} crafted for everyday use. Designed with comfort and durability in mind.
            </p>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={() => addToCart(product)}
                className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3 rounded-xl transition flex-1 min-w-[140px]"
              >
                🛒 Add to Cart
              </button>
              <Link
                to="/cart"
                onClick={() => addToCart(product)}
                className="bg-teal hover:bg-teal-light text-white font-bold px-8 py-3 rounded-xl transition text-center flex-1 min-w-[140px]"
              >
                Buy Now
              </Link>
            </div>
            <div className="flex gap-6 mt-4 text-sm text-gray-500">
              <span>✅ Free Delivery</span>
              <span>🔄 Easy Returns</span>
              <span>🛡️ 1 Year Warranty</span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
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
