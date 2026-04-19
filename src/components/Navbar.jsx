import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${search.trim()}`)
  }

  return (
    <nav className="bg-teal text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="logo" className="w-9 h-9 rounded-full object-cover border-2 border-accent" />
          <span className="text-xl font-bold tracking-wide">Sparrow<span className="text-accent">Cart</span></span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-l-lg text-dark outline-none text-sm bg-white"
          />
          <button type="submit" className="bg-coral hover:bg-coral-dark px-4 py-2 rounded-r-lg text-sm font-semibold transition">
            Search
          </button>
        </form>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition">Home</Link>
          <Link to="/products" className="hover:text-accent transition">Products</Link>
          <Link to="/cart" className="relative hover:text-accent transition flex items-center gap-1">
            🛒 Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-coral text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-teal-light px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <form onSubmit={handleSearch} className="flex mt-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 rounded-l-lg text-dark outline-none bg-white" />
            <button type="submit" className="bg-coral px-3 py-2 rounded-r-lg">🔍</button>
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-accent">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-accent">Products</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-accent">🛒 Cart {count > 0 && `(${count})`}</Link>
        </div>
      )}
    </nav>
  )
}
