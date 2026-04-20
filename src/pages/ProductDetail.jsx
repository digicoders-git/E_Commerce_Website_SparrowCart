import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { FiCheckCircle, FiRefreshCw, FiShield, FiTruck, FiChevronRight, FiStar, FiPackage } from 'react-icons/fi'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { getProductById, getProducts, getApprovedReviewsByProduct, postReview } from '../api/api'
import { mapProduct } from '../utils/dataMapper'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'


export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')
  const [selectedImage, setSelectedImage] = useState('')
  
  // Review form state
  const [formName, setFormName] = useState(user?.name || '')
  const [formRating, setFormRating] = useState(5)
  const [formComment, setFormComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadProductAndReviews = async () => {
      try {
        setLoading(true)
        const [prodData, reviewsData] = await Promise.all([
          getProductById(id),
          getApprovedReviewsByProduct(id)
        ])

        if (prodData.product) {
          const mapped = mapProduct(prodData.product)
          setProduct(mapped)
          setSelectedImage(mapped.image)
          setReviews(reviewsData.reviews || [])

          // Fetch related products
          const allProducts = await getProducts()
          if (allProducts.products) {
            const mappedRelated = allProducts.products
              .map(mapProduct)
              .filter(p => p.category === mapped.category && p.id !== mapped.id)
              .slice(0, 4)
            setRelated(mappedRelated)
          }
        }
        setLoading(false)
      } catch (err) {
        console.error('Error loading product data:', err)
        setLoading(false)
      }
    }
    loadProductAndReviews()
    window.scrollTo(0, 0)
    if (user) setFormName(user.name || '')
  }, [id, user])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!formName.trim() || !formComment.trim()) return toast.error('Please fill all fields')
    
    try {
      setSubmitting(true)
      const res = await postReview({
        productId: id,
        userId: user?.id,
        userName: formName,
        rating: formRating,
        comment: formComment
      })
      if (res.review) {
        toast.success('Review submitted! It will appear after approval')
        setFormComment('')
        setFormRating(5)
      }
    } catch (err) {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

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
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square max-h-[440px] group">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
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
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 shadow-sm ${selectedImage === img ? 'border-teal ring-2 ring-teal/20 scale-95' : 'border-transparent hover:border-teal/50'}`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
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
              <span className="font-bold text-dark text-sm">{product.rating || '4.5'}</span>
              <span className="text-muted text-sm">({reviews.length || product.reviews} reviews)</span>
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
                 {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
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
                    <div className="text-6xl font-extrabold text-dark">{product.rating || 4.5}</div>
                    <div className="flex justify-center gap-1 my-2">{stars(product.rating || 4.5)}</div>
                    <p className="text-muted text-sm">{reviews.length} approved reviews</p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(r => {
                      const count = reviews.filter(rv => Math.round(rv.rating) === r).length;
                      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={r} className="flex items-center gap-2 text-xs">
                          <span className="text-muted w-3">{r}</span>
                          <FiStar size={10} className="text-yellow-400" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-muted w-6 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Review list */}
                <div className="flex-1 space-y-6">
                  {/* Write a Review Form */}
                  <div className="bg-neutral rounded-3xl p-6 border border-border">
                    <h3 className="font-bold text-dark mb-4 text-base">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-muted uppercase mb-1.5 ml-1">Your Name</label>
                          <input 
                            value={formName} 
                            onChange={e => setFormName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-teal outline-none text-sm transition shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-muted uppercase mb-1.5 ml-1">Rating</label>
                          <div className="flex items-center gap-2 h-[42px] px-4 bg-white rounded-xl border border-border shadow-sm">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFormRating(star)}
                                className="transition-transform hover:scale-110"
                              >
                                <FaStar size={18} className={star <= formRating ? 'text-yellow-400' : 'text-gray-200'} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1.5 ml-1">Your Feedback</label>
                        <textarea 
                          value={formComment}
                          onChange={e => setFormComment(e.target.value)}
                          placeholder="Tell us what you like or dislike about this product..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-teal outline-none text-sm transition shadow-sm resize-none"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={submitting}
                        className="bg-dark hover:bg-teal text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-dark/10 disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>

                  {/* Approved Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 opacity-50 italic">
                      No approved reviews yet. Be the first to review!
                    </div>
                  ) : (
                    reviews.map((r) => (
                      <div key={r._id} className="bg-white rounded-2xl p-6 border border-border shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral text-teal rounded-xl flex items-center justify-center font-bold text-base shrink-0 border border-border shadow-sm">
                              {r.userName[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-dark text-sm">{r.userName}</p>
                              <p className="text-muted text-[10px] uppercase font-bold tracking-wider">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">{stars(r.rating)}</div>
                        </div>
                        <p className="text-dark text-sm leading-relaxed bg-neutral/50 p-4 rounded-xl italic font-medium">"{r.comment}"</p>
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-green-600 uppercase tracking-widest px-3 py-1 bg-green-50 w-fit rounded-full">
                          <FiCheckCircle size={12} /> Verified Opinion
                        </div>
                      </div>
                    ))
                  )}
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
