import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { getProducts, getCategories } from '../api/api'
import { mapProduct, mapCategory } from '../utils/dataMapper'

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2000, max: 4000 },
  { label: 'Above ₹4,000', min: 4000, max: Infinity },
]

export default function Products() {
  const [searchParams] = useSearchParams()
  const { addToCart } = useCart()
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState(searchParams.get('sort') || 'default')
  const [priceRange, setPriceRange] = useState(null)
  const [minRating, setMinRating] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchQuery = searchParams.get('search') || ''
  const badgeFilter = searchParams.get('badge') || ''
  const newArrivalFilter = searchParams.get('newArrival') === 'true'

  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProductsData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        setAllProducts(productsData.products.map(mapProduct))
        setCategories(['All', ...categoriesData.categories.map(c => c.title)])
        setLoading(false)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError('Failed to load products from server.')
        setLoading(false)
      }
    }
    loadProductsData()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    const s = searchParams.get('sort')
    setSelectedCat(cat || 'All')
    setSort(s || 'default')
  }, [searchParams])

  let filtered = allProducts
  if (selectedCat !== 'All') filtered = filtered.filter(p => p.category === selectedCat)
  if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (badgeFilter) filtered = filtered.filter(p => p.badge === badgeFilter)
  if (newArrivalFilter) filtered = filtered.filter(p => p.isNewArrival)
  if (priceRange) filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
  if (minRating > 0) filtered = filtered.filter(p => p.rating >= minRating)
  if (sort === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  if (sort === 'discount') filtered = [...filtered].sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price))

  const clearFilters = () => {
    setSelectedCat('All')
    setPriceRange(null)
    setMinRating(0)
    setSort('default')
  }

  const hasFilters = selectedCat !== 'All' || priceRange || minRating > 0

  const Sidebar = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-dark">Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-coral hover:underline flex items-center gap-1">
            <FiX size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="font-semibold text-dark text-sm mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={selectedCat === cat}
                onChange={() => setSelectedCat(cat)}
                className="accent-teal"
              />
              <span className={`text-sm transition ${selectedCat === cat ? 'text-teal font-semibold' : 'text-dark group-hover:text-teal'}`}>
                {cat}
              </span>
              <span className="ml-auto text-xs text-muted">
                {cat === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-dark text-sm mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={priceRange?.label === range.label}
                onChange={() => setPriceRange(priceRange?.label === range.label ? null : range)}
                className="accent-teal"
              />
              <span className={`text-sm transition ${priceRange?.label === range.label ? 'text-teal font-semibold' : 'text-dark group-hover:text-teal'}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-dark text-sm mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(minRating === r ? 0 : r)}
                className="accent-teal"
              />
              <span className="text-sm text-yellow-400">{'★'.repeat(r)}<span className="text-gray-300">{'★'.repeat(5 - r)}</span></span>
              <span className="text-xs text-muted">& above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-neutral min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal to-teal-light py-10 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : newArrivalFilter
              ? 'New Arrivals'
              : badgeFilter
              ? `${badgeFilter} Products`
              : sort === 'discount'
              ? 'Best Deals'
              : selectedCat === 'All'
              ? 'All Products'
              : selectedCat}
          </h1>
          <p className="text-white/70 mt-1 text-sm">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">

        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-32">
            <Sidebar />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 mb-6 items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-dark border border-border px-3 py-1.5 rounded-lg hover:border-teal transition"
              >
                <FiFilter size={14} /> Filters {hasFilters && <span className="bg-coral text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">!</span>}
              </button>
              <span className="text-sm text-muted hidden sm:block">{filtered.length} results</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-border rounded-lg px-3 py-1.5 text-sm text-dark outline-none focus:border-teal"
              >
                <option value="default">Sort: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Discount</option>
              </select>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 transition ${viewMode === 'grid' ? 'bg-teal text-white' : 'hover:bg-gray-50 text-dark'}`}>
                  <FiGrid size={16} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 transition ${viewMode === 'list' ? 'bg-teal text-white' : 'hover:bg-gray-50 text-dark'}`}>
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCat !== 'All' && (
                <span className="bg-teal/10 text-teal text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  {selectedCat} <button onClick={() => setSelectedCat('All')}><FiX size={11} /></button>
                </span>
              )}
              {priceRange && (
                <span className="bg-teal/10 text-teal text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  {priceRange.label} <button onClick={() => setPriceRange(null)}><FiX size={11} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-teal/10 text-teal text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  {minRating}★ & above <button onClick={() => setMinRating(0)}><FiX size={11} /></button>
                </span>
              )}
            </div>
          )}

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-border">
              <div className="text-6xl mb-4">😕</div>
              <p className="text-dark font-semibold text-lg mb-2">No products found</p>
              <p className="text-muted text-sm mb-4">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="bg-teal text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-teal-light transition">
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-border p-4 flex gap-5 hover:shadow-md transition">
                  <img src={p.image} alt={p.name} className="w-32 h-32 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-accent font-semibold uppercase">{p.category}</span>
                    <h3 className="font-semibold text-dark mt-1 mb-1">{p.name}</h3>
                    <p className="text-muted text-sm line-clamp-2 mb-2">{p.description}</p>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mb-3">
                      {'★'.repeat(Math.floor(p.rating))}<span className="text-gray-300">{'★'.repeat(5 - Math.floor(p.rating))}</span>
                      <span className="text-muted ml-1">({p.reviews})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-teal font-bold text-xl">₹{p.price.toLocaleString()}</span>
                      {p.originalPrice > p.price && <span className="text-muted text-sm line-through">₹{p.originalPrice.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 justify-center shrink-0">
                    <button onClick={() => addToCart(p)} className="bg-coral text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-coral-dark transition">
                      Add to Cart
                    </button>
                    <Link to={`/products/${p.id}`} className="border border-teal text-teal text-sm font-semibold px-5 py-2 rounded-xl hover:bg-teal hover:text-white transition text-center">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark text-lg">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}
