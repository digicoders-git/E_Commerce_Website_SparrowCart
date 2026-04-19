import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const categories = [
  { name: 'Electronics', icon: '💻' },
  { name: 'Fashion', icon: '👗' },
  { name: 'Sports', icon: '🏋️' },
  { name: 'Home', icon: '🏠' },
]

export default function Home() {
  const featured = products.filter(p => p.badge).slice(0, 4)

  return (
    <div className="bg-neutral min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-from to-green-to py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-white">
            <p className="text-accent font-semibold mb-2 tracking-widest uppercase text-sm">New Arrivals 2025</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              Shop Smart,<br />Live Better
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Discover thousands of products at unbeatable prices. Quality guaranteed.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/products" className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3 rounded-xl transition text-base">
                Shop Now
              </Link>
              <Link to="/products" className="border-2 border-white text-white hover:bg-white hover:text-teal font-bold px-8 py-3 rounded-xl transition text-base">
                Explore
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80"
                alt="hero"
                className="w-72 md:w-96 rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal text-white py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.8★', 'Rating'], ['Free', 'Shipping']].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-extrabold text-accent">{val}</div>
              <div className="text-sm text-gray-300">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-dark mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="bg-white rounded-2xl p-6 text-center shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="font-semibold text-dark group-hover:text-teal transition">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">Featured Products</h2>
          <Link to="/products" className="text-accent hover:text-teal font-semibold text-sm transition">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-gradient-to-r from-teal to-teal-light mx-4 mb-14 rounded-3xl px-8 py-12 text-white text-center max-w-7xl md:mx-auto">
        <h2 className="text-3xl font-extrabold mb-3">Get 20% Off Your First Order!</h2>
        <p className="text-white/80 mb-6">Use code <span className="bg-white/20 px-2 py-1 rounded font-mono font-bold">SPARROW20</span> at checkout</p>
        <Link to="/products" className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3 rounded-xl transition inline-block">
          Claim Offer
        </Link>
      </section>
    </div>
  )
}
