import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import {
  FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight,
  FiStar, FiChevronLeft, FiChevronRight, FiMonitor, FiHome, FiShoppingBag, FiZap, FiMail
} from 'react-icons/fi'
import { MdFitnessCenter } from 'react-icons/md'

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

const testimonials = [
  { name: 'Priya Sharma', review: 'Amazing quality! Got my headphones in 2 days. Absolutely love SparrowCart!', rating: 5, avatar: 'PS', city: 'Mumbai' },
  { name: 'Rahul Verma', review: 'Best prices in the market. The mechanical keyboard is exactly as described. Will shop again!', rating: 5, avatar: 'RV', city: 'Delhi' },
  { name: 'Anita Singh', review: 'Super fast delivery and great packaging. The leather backpack is stunning!', rating: 4, avatar: 'AS', city: 'Bangalore' },
]

const offerBanners = [
  { code: 'SPARROW20', off: '20% OFF', desc: 'On your first order', color: 'from-teal to-teal-light' },
  { code: 'SAVE10', off: '10% OFF', desc: 'On orders above ₹1999', color: 'from-purple-600 to-purple-800' },
  { code: 'FLAT50', off: '₹50 OFF', desc: 'On orders above ₹499', color: 'from-coral to-coral-dark' },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const navigate = useNavigate()

  const featured = products.filter(p => p.badge).slice(0, 8)
  const newArrivals = products.slice(-4)

  const goTo = useCallback((idx) => {
    if (animating) return
    setAnimating(true)
    setSlide(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const prev = () => goTo((slide - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((slide + 1) % slides.length), [slide, goTo])

  // Auto-play
  useEffect(() => {
    const t = setInterval(next, 4500)
    return () => clearInterval(t)
  }, [next])

  const s = slides[slide]

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
              className="w-full max-w-lg h-80 md:h-[420px] rounded-3xl object-cover shadow-2xl border border-white/10"
            />
          </div>
        </div>

        {/* Slider Controls */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10">
          <FiChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10">
          <FiChevronRight size={20} />
        </button>

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
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {offerBanners.map(o => (
            <div key={o.code} className={`bg-gradient-to-r ${o.color} rounded-2xl px-5 py-3.5 flex items-center gap-4 text-white shadow-sm`}>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-lg leading-tight">{o.off}</div>
                <div className="text-white/80 text-xs">{o.desc}</div>
              </div>
              <div className="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 font-mono font-bold text-xs shrink-0">
                {o.code}
              </div>
            </div>
          ))}
        </div>
      </section>

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
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className={`bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group border-2 border-transparent ${cat.border}`}
            >
              <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <div className="font-bold text-dark group-hover:text-teal transition text-sm">{cat.name}</div>
              <div className="text-xs text-muted mt-1">{products.filter(p => p.category === cat.name).length} Products</div>
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
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-teal to-teal-light rounded-3xl px-8 py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-32 w-48 h-48 bg-coral/20 rounded-full blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <div className="text-accent font-bold text-sm uppercase tracking-widest mb-3">Limited Time Offer</div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Get 20% Off<br />Your First Order!</h2>
              <p className="text-white/75 mb-6">
                Use code{' '}
                <span className="bg-white/20 px-3 py-1 rounded-lg font-mono font-bold text-white border border-white/30">SPARROW20</span>
                {' '}at checkout
              </p>
              <Link to="/products" className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3.5 rounded-xl transition inline-flex items-center gap-2 shadow-lg shadow-coral/30">
                Claim Offer <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {[['Free', 'Shipping'], ['30-Day', 'Returns'], ['24/7', 'Support'], ['100%', 'Secure']].map(([v, l]) => (
                <div key={l} className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 text-center border border-white/20">
                  <div className="text-xl font-extrabold text-accent">{v}</div>
                  <div className="text-xs text-white/70 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
            {testimonials.map(t => (
              <div key={t.name} className="bg-neutral rounded-2xl p-6 border border-border hover:shadow-md transition">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FiStar key={i} size={14} className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-dark text-sm leading-relaxed mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-dark text-sm">{t.name}</div>
                    <div className="text-xs text-muted">{t.city} · Verified Buyer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-accent-light rounded-3xl px-8 py-12 text-center border border-accent/20">
          <FiMail size={32} className="text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-dark mb-2">Stay in the Loop</h2>
          <p className="text-muted mb-6 max-w-md mx-auto">Subscribe for exclusive deals, new arrivals, and flash sale alerts.</p>
          <form className="flex max-w-md mx-auto gap-3" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl border border-border outline-none focus:border-accent text-sm"
            />
            <button type="submit" className="bg-teal hover:bg-teal-light text-white font-bold px-6 py-3 rounded-xl transition whitespace-nowrap">
              Subscribe
            </button>
          </form>
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
