import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import {
  FiShoppingCart, FiMenu, FiSearch, FiHeart, FiX, FiUser,
  FiLogOut, FiChevronDown, FiPackage, FiMapPin, FiSettings
} from 'react-icons/fi'
import { MdFitnessCenter } from 'react-icons/md'
import { FiMonitor, FiHome, FiShoppingBag } from 'react-icons/fi'

const OFFERS = [
  'Free shipping on orders above ₹999',
  'Use code SPARROW20 for 20% off your first order',
  'Flash Sale: Electronics up to 40% off — Today only!',
  'Buy 2 Get 1 Free on Fashion — Limited time!',
  'Same-day delivery available in Mumbai, Delhi & Bangalore',
]

const categories = [
  { name: 'Electronics', icon: <FiMonitor size={18} />, color: 'text-blue-500', desc: 'Phones, Laptops, Gadgets' },
  { name: 'Fashion', icon: <FiShoppingBag size={18} />, color: 'text-pink-500', desc: 'Clothing, Shoes, Bags' },
  { name: 'Sports', icon: <MdFitnessCenter size={18} />, color: 'text-green-500', desc: 'Fitness, Outdoor, Gear' },
  { name: 'Home', icon: <FiHome size={18} />, color: 'text-orange-500', desc: 'Decor, Kitchen, Furniture' },
]

export default function Navbar() {
  const { count, wishlist } = useCart()
  const { user, logout, openAuthModal } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [offerIdx, setOfferIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const catRef = useRef(null)
  const userRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Offer ticker rotation
  useEffect(() => {
    const t = setInterval(() => setOfferIdx(i => (i + 1) % OFFERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${search.trim()}`)
      setSearchOpen(false)
      setSearch('')
    }
  }

  return (
    <>
      {/* Offer Ticker */}
      <div className="bg-teal-hover text-white text-xs py-2 px-4 text-center overflow-hidden relative">
        <div
          key={offerIdx}
          className="animate-fade-in font-medium tracking-wide"
          style={{ animation: 'fadeSlideIn 0.5s ease' }}
        >
          {OFFERS[offerIdx]}
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
          {OFFERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setOfferIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === offerIdx ? 'bg-accent w-3' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      <nav className={`bg-teal text-white sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-2xl' : 'shadow-lg'}`}>
        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="logo" className="w-9 h-9 rounded-full object-cover border-2 border-accent shadow" />
            <span className="text-lg font-extrabold tracking-wide hidden sm:block">
              Sparrow<span className="text-accent">Cart</span>
            </span>
          </Link>

          {/* Category Dropdown */}
          <div className="relative hidden md:block shrink-0" ref={catRef}>
            <button
              onClick={() => setCatOpen(o => !o)}
              className="flex items-center gap-2 bg-teal-light hover:bg-teal-hover px-4 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <FiMenu size={16} /> Categories <FiChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border py-2 z-50">
                {categories.map(cat => (
                  <Link
                    key={cat.name}
                    to={`/products?category=${cat.name}`}
                    onClick={() => setCatOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <div>
                      <div className="text-dark font-semibold text-sm">{cat.name}</div>
                      <div className="text-muted text-xs">{cat.desc}</div>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-border mt-2 pt-2 px-4 pb-1">
                  <Link to="/products" onClick={() => setCatOpen(false)} className="text-accent text-xs font-semibold hover:underline">
                    View all products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full bg-white rounded-xl overflow-hidden shadow-sm border border-white/20">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="flex-1 px-4 py-2.5 text-dark outline-none text-sm"
              />
              <button type="submit" className="bg-accent hover:bg-teal-light px-5 py-2 text-white transition flex items-center gap-1 shrink-0">
                <FiSearch size={16} />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Mobile Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 hover:bg-teal-light rounded-xl transition">
              {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-teal-light rounded-xl transition hidden sm:flex items-center">
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <div className="relative hidden sm:block" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-teal-light rounded-xl transition text-sm"
                >
                  <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden lg:block max-w-[80px] truncate text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <FiChevronDown size={13} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-border py-2 z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-bold text-dark text-sm">{user.name}</p>
                      <p className="text-muted text-xs truncate">{user.email}</p>
                    </div>
                    {[
                      { to: '/account', icon: <FiUser size={14} />, label: 'My Profile' },
                      { to: '/account', state: { tab: 'orders' }, icon: <FiPackage size={14} />, label: 'My Orders' },
                      { to: '/wishlist', icon: <FiHeart size={14} />, label: 'Wishlist' },
                      { to: '/account', state: { tab: 'addresses' }, icon: <FiMapPin size={14} />, label: 'Addresses' },
                      { to: '/account', state: { tab: 'settings' }, icon: <FiSettings size={14} />, label: 'Settings' },
                    ].map(item => (
                      <Link
                        key={item.label}
                        to={item.to}
                        state={item.state}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition"
                      >
                        <span className="text-muted">{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-border mt-1" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-coral hover:bg-red-50 transition"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-teal-light rounded-xl transition text-sm font-semibold"
              >
                <FiUser size={18} /> Login
              </button>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-2 bg-coral hover:bg-coral-dark px-4 py-2.5 rounded-xl transition font-bold text-sm ml-1 shadow-lg shadow-coral/20">
              <FiShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="bg-white text-coral text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 hover:bg-teal-light rounded-xl transition ml-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Category Nav Strip */}
        <div className="hidden md:block bg-teal-light border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <Link to="/" className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition hover:text-accent ${location.pathname === '/' ? 'text-accent border-b-2 border-accent' : 'text-white/80'}`}>
              Home
            </Link>
            <Link to="/products" className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition hover:text-accent ${location.pathname === '/products' && !new URLSearchParams(location.search).get('category') ? 'text-accent border-b-2 border-accent' : 'text-white/80'}`}>
              All Products
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition hover:text-accent flex items-center gap-1.5 ${new URLSearchParams(location.search).get('category') === cat.name ? 'text-accent border-b-2 border-accent' : 'text-white/80'}`}
              >
                <span className={cat.color}>{cat.icon}</span> {cat.name}
              </Link>
            ))}
            <Link to="/products?sort=discount" className="px-4 py-2.5 text-sm font-medium whitespace-nowrap text-coral hover:text-coral-dark transition">
              Deals
            </Link>
            <Link to="/products?badge=New" className="px-4 py-2.5 text-sm font-medium whitespace-nowrap text-accent hover:text-white transition">
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1">
            <form onSubmit={handleSearch} className="flex bg-white rounded-xl overflow-hidden shadow">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 text-dark outline-none text-sm"
                autoFocus
              />
              <button type="submit" className="bg-accent px-4 py-2 text-white"><FiSearch /></button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-teal-light border-t border-white/10 px-4 pb-4 flex flex-col gap-1">
            {user && (
              <div className="flex items-center gap-3 py-3 border-b border-white/10 mb-1">
                <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{user.name}</p>
                  <p className="text-white/60 text-xs">{user.email}</p>
                </div>
              </div>
            )}
            <Link to="/" className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm font-medium">Home</Link>
            <Link to="/products" className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm font-medium">All Products</Link>
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm text-white/80 flex items-center gap-2">
                <span className={cat.color}>{cat.icon}</span> {cat.name}
              </Link>
            ))}
            <div className="border-t border-white/10 my-1" />
            <Link to="/wishlist" className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm flex items-center gap-2">
              <FiHeart size={15} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            {user ? (
              <>
                <Link to="/account" className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm flex items-center gap-2">
                  <FiUser size={15} /> My Account
                </Link>
                <button onClick={logout} className="py-2.5 px-3 rounded-xl hover:bg-red-900/30 text-coral text-sm flex items-center gap-2 text-left">
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <button onClick={() => openAuthModal()} className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm flex items-center gap-2">
                <FiUser size={15} /> Login / Sign Up
              </button>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
