import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-teal text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-full object-cover border-2 border-accent shadow" />
            <span className="text-xl font-bold">Sparrow<span className="text-accent">Cart</span></span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            Your one-stop shop for everything you love. Quality products, great prices, delivered fast.
          </p>
          <div className="flex gap-3">
            {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {[['Home', '/'], ['Products', '/products'], ['About Us', '/about'], ['Contact Us', '/contact']].map(([label, path]) => (
              <li key={label}>
                <Link to={path} className="hover:text-accent transition flex items-center gap-1.5">
                  <span className="text-accent text-xs">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4 text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <FiMail size={15} className="text-accent mt-0.5 shrink-0" />
              <span>support@sparrowcart.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone size={15} className="text-accent shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-3">
              <FiMapPin size={15} className="text-accent mt-0.5 shrink-0" />
              <span>Mumbai, Maharashtra, India</span>
            </li>
          </ul>
          <div className="mt-5 bg-white/10 rounded-xl px-4 py-3 text-xs text-white/60">
            <p className="font-semibold text-white mb-1">Business Hours</p>
            <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2025 SparrowCart. All rights reserved.</p>
          <p className="text-white/30">Crafted with <span className="text-red-400">♥</span> by <a href="https://thedigicoders.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition font-medium">DigiCoders</a></p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
