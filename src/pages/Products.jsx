import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const categories = ['All', 'Electronics', 'Fashion', 'Sports', 'Home']

export default function Products() {
  const [searchParams] = useSearchParams()
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('default')
  const searchQuery = searchParams.get('search') || ''

  let filtered = products
  if (selectedCat !== 'All') filtered = filtered.filter(p => p.category === selectedCat)
  if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (sort === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  return (
    <div className="bg-neutral min-h-screen">
      <div className="bg-gradient-to-r from-green-from to-green-to py-10 px-4 text-white text-center">
        <h1 className="text-3xl font-extrabold">All Products</h1>
        <p className="text-white/80 mt-1">{filtered.length} products found</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  selectedCat === cat
                    ? 'bg-teal text-white'
                    : 'bg-white text-dark border border-gray-200 hover:border-teal hover:text-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark outline-none focus:border-teal"
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No products found 😕</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
