import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { FiCheckCircle, FiRefreshCw, FiShield, FiTruck, FiChevronRight, FiStar, FiPackage } from 'react-icons/fi'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const mockReviews = [
  { name: 'Amit K.', rating: 5, date: 'Jun 10, 2025', text: 'Absolutely love this product! Build quality is top-notch and delivery was super fast. Highly recommend to everyone.', verified: true },
  { name: 'Sneha R.', rating: 4, date: 'May 28, 2025', text: 'Great value for money. Works exactly as described. Packaging was also very good. Will buy again.', verified: true },
  { name: 'Rohit M.', rating: 5, date: 'May 15, 2025', text: 'Exceeded my expectations! The quality is premium and it looks even better in person. Very happy with this purchase.', verified: true },
  { name: 'Priya S.', rating: 4, date: 'Apr 30, 2025', text: 'Good product overall. Delivery was on time. Minor issue with packaging but the product itself is perfect.', verified: false },
]

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === Number(id))
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)
  const [activeTab, setActiveTab] = useState('description')
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!product) return (
    <div className="text-center py-20 text-muted">
      Product not found. <Link to="/products" className="text-accent underline">Go back</Link>
    </div>
  )

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const stars = (rating) => Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return <FaStar key={i} className="text-yellow-400" size={15} />
    if (i < rating) return <FaStarHalfAlt key={i} className="text-yellow-400" size={15} />
    return <FaRegStar key={i} className="text-gray-300" size={15} />
  })

  const ratingBars = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: mockReviews.filter(rv => Math.round(rv.rating) === r).length,
    pct: Math.round((mockReviews.filter(rv => Math.round(rv.rating) === r).length / mockReviews.length) * 100)
  }))

  return (
    <div className="bg-neutral min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted mb-6 flex-wrap">
          <Link to="/" className="hover:text-teal transition">Home</Link>
          <FiChevronRight size={13} />
          <Link to="/products" className="hover:text-teal transition">Products</Link>
          <FiChevronRight size={13} />
          <Link to={`/products?category=${product.category}`} className="hover:text-teal transition">{product.category}</Link>
          <FiChevronRight size={13} />
          <span className="text-dark font-medium line-clamp-1">{product.name}</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-10 flex flex-col md:flex-row gap-10 mb-6">

          {/* Image */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square max-h-[440px]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-green-500 text-white font-bold text-sm px-3 py-1 rounded-xl shadow">
                  {discount}% OFF
                </span>
              )}
              {product.badge && (
                <span className="absolute top-4 right-4 bg-teal text-white font-bold text-xs px-3 py-1 rounded-xl shadow">
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnails placeholder */}
            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border cursor-pointer hover:border-teal transition">
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-5">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-widest">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-dark mt-1 leading-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">{stars(product.rating)}</div>
              <span className="font-bold text-dark text-sm">{product.rating}</span>
              <span className="text-muted text-sm">({product.reviews} reviews)</span>
              <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-teal">₹{product.price.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="text-muted text-lg line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-1 rounded-xl">
                    You save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Features */}
            {product.features && (
              <div className="grid grid-cols-2 gap-2.5">
                {product.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-dark bg-neutral rounded-xl px-3 py-2">
                    <FiCheckCircle className="text-green-500 shrink-0" size={13} /> {f}
                  </div>
                ))}
              </div>
            )}

            {/* Trust */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <FiTruck size={14} className="text-blue-500" />, text: 'Free Delivery above ₹999' },
                { icon: <FiRefreshCw size={14} className="text-purple-500" />, text: '30-Day Easy Returns' },
                { icon: <FiShield size={14} className="text-green-500" />, text: '1 Year Warranty' },
                { icon: <FiPackage size={14} className="text-amber-500" />, text: '100% Genuine Product' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-xs text-dark bg-neutral rounded-xl px-3 py-2.5 border border-border">
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden mb-10">
          <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
            {['description', 'features', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap transition ${activeTab === tab ? 'text-teal border-b-2 border-teal bg-teal/5' : 'text-muted hover:text-dark'}`}
              >
                {tab === 'reviews' ? `Reviews (${mockReviews.length})` : tab}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <p className="text-dark text-sm leading-relaxed mb-6">{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Category', value: product.category },
                    { label: 'Rating', value: `${product.rating} / 5` },
                    { label: 'Reviews', value: `${product.reviews}+` },
                  ].map(d => (
                    <div key={d.label} className="bg-neutral rounded-2xl p-4 border border-border">
                      <p className="text-xs text-muted uppercase tracking-wide mb-1">{d.label}</p>
                      <p className="font-bold text-dark">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {product.features?.map((f, i) => (
                  <div key={f} className="flex items-center gap-3 bg-neutral rounded-2xl px-4 py-3 border border-border">
                    <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <FiCheckCircle className="text-green-500" size={14} />
                    </div>
                    <span className="text-dark text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Rating summary */}
                <div className="lg:w-56 shrink-0">
                  <div className="text-center mb-4">
                    <div className="text-6xl font-extrabold text-dark">{product.rating}</div>
                    <div className="flex justify-center gap-1 my-2">{stars(product.rating)}</div>
                    <p className="text-muted text-sm">{product.reviews} reviews</p>
                  </div>
                  <div className="space-y-2">
                    {ratingBars.map(r => (
                      <div key={r.star} className="flex items-center gap-2 text-xs">
                        <span className="text-muted w-3">{r.star}</span>
                        <FiStar size={10} className="text-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="text-muted w-6 text-right">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review list */}
                <div className="flex-1 space-y-4">
                  {mockReviews.map((r, i) => (
                    <div key={i} className="bg-neutral rounded-2xl p-5 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-teal text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-dark text-sm">{r.name}</p>
                            <p className="text-muted text-xs">{r.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">{stars(r.rating)}</div>
                      </div>
                      <p className="text-dark text-sm leading-relaxed">{r.text}</p>
                      {r.verified && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                          <FiCheckCircle size={11} /> Verified Purchase
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-dark">Related Products</h2>
              <Link to={`/products?category=${product.category}`} className="text-accent text-sm font-semibold hover:underline flex items-center gap-1">
                View All <FiChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
