import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-teal text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="logo" className="w-9 h-9 rounded-full object-cover border-2 border-accent" />
            <span className="text-xl font-bold">Sparrow<span className="text-accent">Cart</span></span>
          </div>
          <p className="text-sm text-gray-300">Your one-stop shop for everything you love. Quality products, great prices.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📧 support@sparrowcart.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-400">
        © 2025 SparrowCart. All rights reserved.
      </div>
    </footer>
  )
}
