import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import {
  FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight,
  FiStar, FiChevronLeft, FiChevronRight, FiMonitor, FiHome, FiShoppingBag, FiZap
} from 'react-icons/fi'
import { MdFitnessCenter } from 'react-icons/md'
import { getProducts, getCategories, getSliders, getOfferImages, getOfferTexts, getAllApprovedReviews } from '../api/api'
import { mapProduct, mapCategory, mapSlider, mapOfferImage, mapOfferText } from '../utils/dataMapper'

const slides = [
  {
    id: 1,
    tag: 'Flash Sale — Ends Tonight',
    title: 'Premium Electronics',
    subtitle: 'Up to 40% Off',
    desc: 'Shop the latest gadgets, laptops, and smartphones at unbeatable prices.',
    cta: 'Shop Electronics',
    ctaLink: '/products?category=Electronics',
    bg: 'from-[#0F3D3E] to-[#1a5557]',
    accent: '#1FB6C9',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    badge: { text: '40% OFF', sub: 'Today Only' },
  },
  {
    id: 2,
    tag: 'New Arrivals 2025',
    title: 'Fashion Forward',
    subtitle: 'Style That Speaks',
    desc: 'Discover the latest trends in clothing, footwear, and accessories.',
    cta: 'Explore Fashion',
    ctaLink: '/products?category=Fashion',
    bg: 'from-[#4A1942] to-[#7B2D8B]',
    accent: '#F9A8D4',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    badge: { text: 'BUY 2 GET 1', sub: 'Free' },
  },
  {
    id: 3,
    tag: 'Fitness Season',
    title: 'Sports & Fitness',
    subtitle: 'Gear Up for Greatness',
    desc: 'Everything you need to crush your fitness goals — from gym to outdoors.',
    cta: 'Shop Sports',
    ctaLink: '/products?category=Sports',
    bg: 'from-[#064E3B] to-[#065F46]',
    accent: '#6EE7B7',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    badge: { text: 'TOP PICKS', sub: 'This Week' },
  },
  {
    id: 4,
    tag: 'Home Makeover',
    title: 'Home & Living',
    subtitle: 'Transform Your Space',
    desc: 'Beautiful decor, smart appliances, and everything to make home feel perfect.',
    cta: 'Shop Home',
    ctaLink: '/products?category=Home',
    bg: 'from-[#7C2D12] to-[#9A3412]',
    accent: '#FED7AA',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    badge: { text: 'FREE SHIP', sub: 'Above ₹999' },
  },
]

const categories = [
  { name: 'Electronics', icon: <FiMonitor size={26} />, color: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-300' },
  { name: 'Fashion', icon: <FiShoppingBag size={26} />, color: 'bg-pink-50 text-pink-600', border: 'hover:border-pink-300' },
  { name: 'Sports', icon: <MdFitnessCenter size={26} />, color: 'bg-green-50 text-green-600', border: 'hover:border-green-300' },
  { name: 'Home', icon: <FiHome size={26} />, color: 'bg-orange-50 text-orange-600', border: 'hover:border-orange-300' },
]

const features = [
  { icon: <FiTruck size={22} />, title: 'Free Delivery', desc: 'On orders above ₹999', color: 'text-blue-500 bg-blue-50' },
  { icon: <FiShield size={22} />, title: 'Secure Payment', desc: '100% safe & encrypted', color: 'text-green-500 bg-green-50' },
  { icon: <FiRefreshCw size={22} />, title: 'Easy Returns', desc: '30-day return policy', color: 'text-purple-500 bg-purple-50' },
  { icon: <FiHeadphones size={22} />, title: '24/7 Support', desc: 'Always here to help', color: 'text-coral bg-red-50' },
]

/* Testimonials handled dynamically now */

const offerBanners = [
  { code: 'SPARROW20', off: '20% OFF', desc: 'On your first order', color: 'from-teal to-teal-light' },
  { code: 'SAVE10', off: '10% OFF', desc: 'On orders above ₹1999', color: 'from-purple-600 to-purple-800' },
  { code: 'FLAT50', off: '₹50 OFF', desc: 'On orders above ₹499', color: 'from-coral to-coral-dark' },
]

const Home = () => {
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [slides, setSlides] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [offerImages, setOfferImages] = useState([])
  const [offerTexts, setOfferTexts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const defaultSlides = [
    {
      id: 'default-1',
      tag: 'Coming Soon',
      title: 'Amazing Deals Await',
      subtitle: 'Stay Tuned',
      desc: 'We are preparing something special for you. Check back soon for the latest electronics and fashion.',
      cta: 'Explore Products',
      ctaLink: '/products',
      bg: 'from-[#0F3D3E] to-[#1a5557]',
      accent: '#1FB6C9',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
      badge: { text: 'COMING SOON', sub: 'New Store' },
    }
  ]

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true)

        // Use individual try-catch to ensure one failure doesn't block the rest
        const safeFetch = async (fn, defaultVal = {}) => {
          try { return await fn(); } catch (e) { console.error(e); return defaultVal; }
        };

        const [
          slidersData,
          categoriesData,
          productsData,
          offerImagesData,
          offerTextsData,
          reviewsData
        ] = await Promise.all([
          safeFetch(getSliders, { sliders: [] }),
          safeFetch(getCategories, { categories: [] }),
          safeFetch(getProducts, { products: [] }),
          safeFetch(getOfferImages, { offerImages: [] }),
          safeFetch(getOfferTexts, { offerTexts: [] }),
          safeFetch(getAllApprovedReviews, { reviews: [] })
        ])

        // 1. Process Sliders
        if (slidersData.sliders && slidersData.sliders.length > 0) {
          setSlides(slidersData.sliders.map(mapSlider))
        } else {
          setSlides(defaultSlides)
        }

        // 2. Process Categories
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          setCategories(categoriesData.categories.map(mapCategory))
        }

        // 3. Process Products
        if (productsData.products && productsData.products.length > 0) {
          const mappedProducts = productsData.products.map(mapProduct)
          setFeaturedProducts(mappedProducts.filter(p => p.badge).slice(0, 8))

          const arrivalProducts = mappedProducts.filter(p => p.isNewArrival)
          if (arrivalProducts.length > 0) {
            setNewArrivals(arrivalProducts.slice(0, 10))
          } else {
            setNewArrivals(mappedProducts.slice(0, 10))
          }
        }

        // 4. Process Offers
        setOfferImages(offerImagesData.offerImages?.map(mapOfferImage) || [])
        setOfferTexts(offerTextsData.offerTexts?.map(mapOfferText) || [])
        setReviews(reviewsData.reviews || [])

        setLoading(false)
      } catch (err) {
        console.error('Critical failure loading home data:', err)
        // Only set error if everything failed catastrophically
        if (featuredProducts.length === 0 && categories.length === 0) {
          setError('Failed to connect to backend server.')
        }
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const goTo = useCallback((idx) => {
    if (animating) return
    setAnimating(true)
    setSlide(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const prev = () => goTo((slide - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((slide + 1) % slides.length), [slide, slides.length, goTo])

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      next()
    }, 5000)
    return () => clearInterval(timer)
  }, [next])

  const s = slides[slide] || slides[0] || defaultSlides[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted font-medium animate-pulse">Loading SparrowCart Experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md text-center border border-border">
          <FiZap className="mx-auto text-coral mb-4" size={48} />
          <h2 className="text-2xl font-bold text-dark mb-2">Oops! Something went wrong</h2>
          <p className="text-muted mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-teal text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-light transition shadow-lg shadow-teal/20">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral min-h-screen">

      {/* ── Hero Slider ── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${s.bg} transition-all duration-700`}>
        {/* BG blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: s.accent }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ background: s.accent }} />
        </div>

        {/* Full background image */}
        <div className="absolute inset-0">
          <img src={s.image} alt={s.title} className="w-full h-full object-cover opacity-30" />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.bg} opacity-80`} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10 relative min-h-[520px]">
          {/* Text */}
          <div className="flex-1 text-white" key={`text-${slide}`} style={{ animation: 'slideInLeft 0.6s ease' }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-white/20">
              {s.tag}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2">
              {s.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: s.accent }}>
              {s.subtitle}
            </h2>
            <p className="text-white/70 text-base mb-8 max-w-md leading-relaxed">{s.desc}</p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to={s.ctaLink}
                className="bg-white font-bold px-8 py-3.5 rounded-xl transition hover:scale-105 flex items-center gap-2 shadow-xl"
                style={{ color: '#1A1A1A' }}
              >
                {s.cta} <FiArrowRight />
              </Link>
              <Link to="/products" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl transition backdrop-blur-sm">
                View All Deals
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.8★', 'Rating']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-xl font-extrabold" style={{ color: s.accent }}>{val}</div>
                  <div className="text-xs text-white/50 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — large image */}
          <div className="flex-1 flex justify-center items-center" key={`img-${slide}`} style={{ animation: 'slideInRight 0.6s ease' }}>
            <img
              src={s.image}
              alt={s.title}
              className="w-full max-w-lg h-80 md:h-[450px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Offer Coupon Strip ── */}
      {(offerTexts.length > 0 || offerBanners.length > 0) && (
        <section className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(offerTexts.length > 0 ? offerTexts : offerBanners).slice(0, 3).map((o, idx) => {
                const colors = [
                  'from-teal to-teal-light',
                  'from-purple-600 to-purple-800',
                  'from-coral to-coral-dark'
                ];
                return (
                  <div key={o.id || o.code} className={`bg-gradient-to-r ${o.color || colors[idx % colors.length]} rounded-2xl px-6 py-4 flex items-center gap-4 text-white shadow-lg transition-transform hover:scale-[1.02]`}>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-lg leading-tight truncate">
                        {o.text || o.off}
                      </div>
                      <div className="text-white/80 text-xs mt-0.5">
                        {o.desc || 'Exclusive Promotional Offer'}
                      </div>
                    </div>
                    {o.code && (
                      <div className="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 font-mono font-bold text-xs shrink-0">
                        {o.code}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* ── Features ── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}>
                {f.icon}
              </div>
              <div>
                <div className="font-semibold text-dark text-sm">{f.title}</div>
                <div className="text-xs text-muted">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-dark">Shop by Category</h2>
            <p className="text-muted text-sm mt-1">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="text-accent hover:text-teal font-semibold text-sm flex items-center gap-1 transition">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.name}`}
              className="group flex flex-col items-center p-5 rounded-[2rem] bg-white border border-border hover:border-teal hover:shadow-2xl hover:shadow-teal/10 transition-all duration-500"
            >
              <div className="w-full aspect-square rounded-2xl bg-neutral flex items-center justify-center overflow-hidden mb-4 group-hover:scale-105 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=' + cat.name;
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="font-extrabold text-dark group-hover:text-teal transition-colors text-base text-center line-clamp-1">{cat.name}</div>
              <div className="text-xs text-muted mt-1 font-medium bg-neutral px-3 py-1 rounded-full group-hover:bg-teal group-hover:text-white transition-all">Explore Collections</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-dark flex items-center gap-2">
              <FiZap className="text-coral" size={22} /> Featured Products
            </h2>
            <p className="text-muted text-sm mt-1">Handpicked deals just for you</p>
          </div>
          <Link to="/products" className="text-accent hover:text-teal font-semibold text-sm flex items-center gap-1 transition">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Dynamic Combined Promo Banners ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {offerImages.length > 0 ? (
          <div className="flex flex-col gap-8">
            {/* Main Combined Banner - Split Layout */}
            {offerImages.slice(0, 1).map((img) => {
              const mainText = offerTexts[0]?.text || 'Next-Gen Electronics Sale';
              return (
                <div key={img.id} className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0F3D3E] to-[#1a5557] min-h-[580px] md:h-[500px] flex items-center shadow-2xl border border-white/5">
                  {/* Subtle Background pattern/glow */}
                  <div className="absolute top-0 right-0 w-1/2 h-10 bg-accent/10 blur-[100px] rounded-full transform translate-x-1/2" />

                  <div className="relative w-full h-full flex flex-col md:flex-row items-center px-6 md:px-16 py-10 md:py-12 gap-8 md:gap-12">
                    {/* Left Side: Text Content */}
                    <div className="w-full md:w-1/2 text-left z-10 order-2 md:order-1">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-accent mb-6 border border-white/10 tracking-widest uppercase">
                        <FiZap className="animate-pulse" /> Limited Edition Deal
                      </div>
                      <h1 className="text-sm md:text-4xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-sm">
                        {mainText}
                      </h1>
                      <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-center">
                        <Link
                          to="/products"
                          className="w-full sm:w-auto bg-coral hover:bg-coral-dark text-white font-bold px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-coral/30 flex items-center justify-center gap-2"
                        >
                          Shop Now <FiArrowRight />
                        </Link>
                        <div className="flex gap-4">
                          {[
                            { v: 'Free', l: 'Shipping' },
                            { v: '24/7', l: 'Chat' }
                          ].map((s, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <span className="text-accent font-bold text-lg leading-none">{s.v}</span>
                              <span className="text-white/40 text-[9px] uppercase tracking-tighter">{s.l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Full Image - Enlarged */}
                    <div className="w-full md:w-1/2 h-[280px] md:h-[300px] relative z-0 order-1 md:order-2 flex items-center justify-center">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] opacity-40 animate-pulse" />
                      <img
                        src={img.image}
                        alt="Promo Product"
                        className="relative w-full max-h-full object-contain scale-100 md:scale-125 transform group-hover:scale-[1.1] md:group-hover:scale-[1.35] group-hover:-rotate-3 transition-transform duration-1000 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] md:drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Sub Banners if more exist */}
            {offerImages.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {offerImages.slice(1, 3).map((img, idx) => {
                  const subText = offerTexts[idx + 1]?.text || 'More Tech Deals';
                  return (
                    <div key={img.id} className="group overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col md:flex-row h-auto md:min-h-[280px] border border-border/50 transition-all hover:border-teal/20">
                      {/* Image Side */}
                      <div className="w-full md:w-1/2 h-[220px] md:h-auto bg-neutral/30 flex items-center justify-center p-8 overflow-hidden relative order-1 md:order-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent pointer-events-none" />
                        <img 
                          src={img.image} 
                          alt="Sub Offer" 
                          className="relative w-full h-full object-contain drop-shadow-2xl transition-transform duration-1000 group-hover:scale-110" 
                        />
                      </div>
                      
                      {/* Content Side */}
                      <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative order-2 md:order-1 bg-white">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full blur-3xl opacity-50" />
                        <div className="text-teal font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Limited Offer</div>
                        <h3 className="text-xl md:text-2xl font-extrabold text-dark mb-6 leading-tight">
                          {subText}
                        </h3>
                        <Link 
                          to="/products"
                          className="bg-teal text-white font-extrabold px-8 py-3.5 rounded-xl text-xs w-fit transition-all hover:bg-teal-hover hover:scale-105 shadow-lg shadow-teal/20 flex items-center gap-2"
                        >
                          GRAB DEAL <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Fallback Banner */
          <div className="bg-gradient-to-r from-teal to-teal-light rounded-[2.5rem] px-8 py-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-coral/20 rounded-full blur-[100px]" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl">
                <div className="text-accent font-bold text-sm uppercase tracking-[0.2em] mb-4">Summer 2024 Collection</div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Next-Generation Tech<br />Available Now.</h2>
                <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">Experience the future of electronics with our latest arrivals. Free nationwide shipping on all major gadgets.</p>
                <Link to="/products" className="bg-white text-teal font-extrabold px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl flex items-center gap-2 w-fit">
                  SHOP ALL PRODUCTS <FiArrowRight />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20" />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-dark">New Arrivals</h2>
            <p className="text-muted text-sm mt-1">Fresh products just landed</p>
          </div>
          <Link to="/products" className="text-accent hover:text-teal font-semibold text-sm flex items-center gap-1 transition">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-dark">What Our Customers Say</h2>
            <p className="text-muted text-sm mt-2">Trusted by 50,000+ happy shoppers across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.length > 0 ? reviews.slice(0, 3).map((t, idx) => (
              <div key={t._id} className="bg-neutral rounded-2xl p-6 border border-border hover:shadow-md transition">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FiStar key={i} size={14} className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-dark text-sm leading-relaxed mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {t.userName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-dark text-sm">{t.userName}</div>
                    <div className="text-xs text-muted">Verified Buyer</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-1 md:col-span-3 text-center py-10 opacity-50 italic">
                Our customers are sharing their experiences soon!
              </div>
            )}
          </div>
        </div>
      </section>



      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default Home;
