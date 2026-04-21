import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiMenu, FiSearch, FiX, FiUser,
  FiLogOut, FiChevronDown, FiPackage, FiMapPin, FiSettings
} from 'react-icons/fi'
import { MdFitnessCenter } from 'react-icons/md'
import { FiMonitor, FiHome, FiShoppingBag } from 'react-icons/fi'
import { getOfferTexts } from '../api/api'
import { mapOfferText } from '../utils/dataMapper'

const OFFERS = [
  'Free shipping on orders above ₹999',
  'Use code SPARROW20 for 20% off your first order',
  'Flash Sale: Electronics up to 40% off — Today only!',
  'Buy 2 Get 1 Free on Fashion — Limited time!',
  'Same-day delivery available in Mumbai, Delhi & Bangalore',
]

// Fallback categories for icons and colors
const CATEGORY_STYLE_MAP = {
  'Electronics': { icon: <FiMonitor size={18} />, color: 'text-blue-500', desc: 'Phones, Laptops, Gadgets' },
  'Fashion': { icon: <FiShoppingBag size={18} />, color: 'text-pink-500', desc: 'Clothing, Shoes, Bags' },
  'Sports': { icon: <MdFitnessCenter size={18} />, color: 'text-green-500', desc: 'Fitness, Outdoor, Gear' },
  'Home': { icon: <FiHome size={18} />, color: 'text-orange-500', desc: 'Decor, Kitchen, Furniture' },
}

const DEFAULT_STYLE = { icon: <FiPackage size={18} />, color: 'text-teal', desc: 'Browse our collection' }


export default function Navbar() {
  const { user, logout, openAuthModal } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [offerIdx, setOfferIdx] = useState(0)
  const [dynamicOffers, setDynamicOffers] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const catRef = useRef(null)
  const userRef = useRef(null)
  const searchRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Offer ticker rotation
  useEffect(() => {
    const total = dynamicOffers.length > 0 ? dynamicOffers.length : 1;
    const t = setInterval(() => setOfferIdx(i => (i + 1) % total), 4000)
    return () => clearInterval(t)
  }, [dynamicOffers])

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
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Search Suggestions Logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = search.trim();
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const { getSearchSuggestions } = await import('../api/api');
        const data = await getSearchSuggestions(query);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('Search suggestions failed:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);


  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [location.pathname])

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { getCategories } = await import('../api/api')
        const { mapCategory } = await import('../utils/dataMapper')
        const data = await getCategories()
        if (data.categories) {
          setCategories(data.categories.map(mapCategory))
        }
      } catch (err) {
        console.error('Navbar category fetch failed:', err)
      }
    }
    fetchCats()
  }, [])

  // Fetch Offer Texts
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOfferTexts()
        if (data.offerTexts) {
          const active = data.offerTexts
            .map(mapOfferText)
            .filter(o => o.isActive)
          setDynamicOffers(active)
        }
      } catch (err) {
        console.error('Navbar offer fetch failed:', err)
      }
    }
    fetchOffers()
  }, [])

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
      <div className="bg-teal-hover text-white text-[10px] sm:text-xs py-2 px-4 text-center overflow-hidden relative">
        <div
          key={offerIdx}
          className="animate-fade-in font-medium tracking-wider uppercase h-4 flex items-center justify-center"
          style={{ animation: 'fadeSlideIn 0.5s ease' }}
        >
          {dynamicOffers.length > 0 ? dynamicOffers[offerIdx]?.text : 'Welcome to SparrowCart — Premium Shopping Experience'}
        </div>
        {dynamicOffers.length > 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex gap-1">
            {dynamicOffers.map((_, i) => (
              <button
                key={i}
                onClick={() => setOfferIdx(i)}
                className={`w-1 h-1 rounded-full transition-all ${i === offerIdx ? 'bg-accent w-2.5' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>

      <nav className={`bg-teal text-white sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-2xl' : 'shadow-lg'}`}>
        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="logo" className="w-14 h-14 rounded-full object-cover shadow-lg" />
            <span className="text-xl font-bold hidden sm:block">Sparrow<span className="text-accent">Cart</span></span>
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
                {categories.map(cat => {
                  const style = CATEGORY_STYLE_MAP[cat.name] || DEFAULT_STYLE
                  return (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.name}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group"
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center ${style.color} group-hover:scale-110 transition-transform`}>
                        {cat.image ? <img src={cat.image} className="w-6 h-6 object-cover rounded-lg" alt="" /> : style.icon}
                      </div>
                      <div>
                        <div className="text-dark font-semibold text-sm">{cat.name}</div>
                        <div className="text-muted text-xs">{style.desc}</div>
                      </div>
                    </Link>
                  )
                })}
                <div className="border-t border-border mt-2 pt-2 px-4 pb-1">
                  <Link to="/products" onClick={() => setCatOpen(false)} className="text-accent text-xs font-semibold hover:underline">
                    View all products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Search - moved to right */}
          <div className="hidden md:flex flex-1 max-w-xl ml-auto relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex w-full bg-white rounded-xl overflow-hidden shadow-sm border border-white/20">
                <input
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 px-4 py-2.5 text-dark outline-none text-sm"
                />
                <button type="submit" className="bg-accent hover:bg-teal-light px-5 py-2 text-white transition flex items-center gap-1 shrink-0">
                  <FiSearch size={16} />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (search.trim().length >= 2) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-[60] animate-fade-in">
                {loadingSuggestions ? (
                  <div className="p-4 text-center text-muted text-sm flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">Product Results</div>
                    {suggestions.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => {
                          navigate(`/products/${item._id}`);
                          setShowSuggestions(false);
                          setSearch('');
                        }}

                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition" />
                          ) : (
                            <FiPackage className="text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-dark font-semibold text-sm truncate">{item.name}</div>
                          <div className="text-muted text-xs truncate">{item.category?.title || 'Product'}</div>
                        </div>
                        <div className="text-accent opacity-0 group-hover:opacity-100 transition translate-x-2 group-hover:translate-x-0">
                          <FiChevronDown size={14} className="-rotate-90" />
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-border mt-2 p-2">
                      <button
                        onClick={handleSearch}
                        className="w-full py-2 text-center text-xs font-bold text-accent hover:bg-accent/5 rounded-lg transition"
                      >
                        See all results for "{search}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiSearch size={20} className="text-muted" />
                    </div>
                    <div className="text-dark font-medium text-sm">No products found</div>
                    <div className="text-muted text-xs mt-1">Try searching for something else</div>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Right Icons */}
          <div className="flex items-center gap-1">

            {/* Mobile Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 hover:bg-teal-light rounded-xl transition">
              {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>

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
            <Link to="/products?sort=discount" className="px-4 py-2.5 text-sm font-medium whitespace-nowrap text-coral hover:text-coral-dark transition">
              Deals
            </Link>
            <Link to="/products?newArrival=true" className="px-4 py-2.5 text-sm font-medium whitespace-nowrap text-accent hover:text-white transition">
              New Arrivals
            </Link>
            <Link to="/about" className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition hover:text-accent ${location.pathname === '/about' ? 'text-accent border-b-2 border-accent' : 'text-white/80'}`}>
              About Us
            </Link>
            <Link to="/contact" className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition hover:text-accent ${location.pathname === '/contact' ? 'text-accent border-b-2 border-accent' : 'text-white/80'}`}>
              Contact Us
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 relative">
            <form onSubmit={handleSearch} className="flex bg-white rounded-xl overflow-hidden shadow border border-border">
              <input
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 text-dark outline-none text-sm"
                autoFocus
              />
              <button type="submit" className="bg-accent px-4 py-2 text-white"><FiSearch /></button>
            </form>

            {/* Suggestions Dropdown for Mobile */}
            {showSuggestions && (search.trim().length >= 2) && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-[60] animate-fade-in max-h-[60vh] overflow-y-auto">
                {loadingSuggestions ? (
                  <div className="p-4 text-center text-muted text-xs flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-1">
                    {suggestions.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => {
                          navigate(`/products/${item._id}`);
                          setShowSuggestions(false);
                          setSearchOpen(false);
                          setSearch('');
                        }}

                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FiPackage size={14} className="text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-dark font-semibold text-xs truncate">{item.name}</div>
                          <div className="text-muted text-[10px] truncate">{item.category?.title || 'Product'}</div>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full py-2 text-center text-[10px] font-bold text-accent border-t border-border mt-1"
                    >
                      See all results
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <div className="text-muted text-xs">No products found</div>
                  </div>
                )}
              </div>
            )}
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
            <Link to="/about" className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm">About Us</Link>
            <Link to="/contact" className="py-2.5 px-3 rounded-xl hover:bg-teal text-sm">Contact Us</Link>
            <div className="border-t border-white/10 my-1" />
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
