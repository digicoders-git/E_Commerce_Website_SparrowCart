import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers, FiPackage, FiStar, FiTruck, FiShield, FiHeart } from 'react-icons/fi'

const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', avatar: 'AM', bg: 'bg-teal' },
  { name: 'Priya Sharma', role: 'Head of Operations', avatar: 'PS', bg: 'bg-purple-600' },
  { name: 'Rahul Verma', role: 'Lead Developer', avatar: 'RV', bg: 'bg-coral' },
  { name: 'Sneha Patel', role: 'Customer Experience', avatar: 'SP', bg: 'bg-amber-500' },
]

const stats = [
  { icon: <FiUsers size={22} />, value: '50,000+', label: 'Happy Customers', color: 'text-blue-500 bg-blue-50' },
  { icon: <FiPackage size={22} />, value: '10,000+', label: 'Products Listed', color: 'text-green-500 bg-green-50' },
  { icon: <FiStar size={22} />, value: '4.8 / 5', label: 'Average Rating', color: 'text-yellow-500 bg-yellow-50' },
  { icon: <FiTruck size={22} />, value: '1,00,000+', label: 'Orders Delivered', color: 'text-purple-500 bg-purple-50' },
]

const values = [
  { icon: <FiShield size={20} />, title: 'Trust & Transparency', desc: 'We believe in honest pricing, genuine products, and no hidden charges — ever.', color: 'text-blue-500 bg-blue-50' },
  { icon: <FiHeart size={20} />, title: 'Customer First', desc: 'Every decision we make starts with one question: is this good for our customer?', color: 'text-coral bg-red-50' },
  { icon: <FiTruck size={20} />, title: 'Fast & Reliable', desc: 'From warehouse to your doorstep — we obsess over speed and safe delivery.', color: 'text-green-500 bg-green-50' },
  { icon: <FiStar size={20} />, title: 'Quality Assured', desc: 'Every product is vetted for quality before it goes live on our platform.', color: 'text-amber-500 bg-amber-50' },
]

export default function AboutUs() {
  return (
    <div className="bg-neutral min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-teal to-teal-light py-16 px-4 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About SparrowCart</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
          We started with a simple idea — make great products accessible to everyone, everywhere in India.
        </p>
      </div>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-border p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center shadow-sm">
          <div className="flex-1">
            <p className="text-accent font-bold text-sm uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-3xl font-extrabold text-dark mb-5 leading-tight">Built for India,<br />by Indians</h2>
            <p className="text-muted leading-relaxed mb-4">
              SparrowCart was founded in 2022 by a small team of passionate builders who were frustrated with the complexity of online shopping. We wanted something simpler, faster, and more trustworthy.
            </p>
            <p className="text-muted leading-relaxed mb-6">
              Today, we serve over 50,000 customers across India with a curated catalog of electronics, fashion, sports gear, and home essentials — all at prices that make sense.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-light text-white font-bold px-6 py-3 rounded-xl transition">
              Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            {stats.map(s => (
              <div key={s.label} className="bg-neutral rounded-2xl border border-border p-5 text-center">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-3 ${s.color}`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-extrabold text-dark">{s.value}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-dark">What We Stand For</h2>
          <p className="text-muted text-sm mt-2">The principles that guide everything we do</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map(v => (
            <div key={v.title} className="bg-white rounded-2xl border border-border p-6 flex gap-4 shadow-sm hover:shadow-md transition">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${v.color}`}>
                {v.icon}
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white border-y border-border py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-dark">Meet the Team</h2>
            <p className="text-muted text-sm mt-2">The people behind SparrowCart</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map(m => (
              <div key={m.name} className="text-center">
                <div className={`w-20 h-20 ${m.bg} text-white rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-3 shadow-md`}>
                  {m.avatar}
                </div>
                <p className="font-bold text-dark text-sm">{m.name}</p>
                <p className="text-muted text-xs mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-extrabold text-dark mb-3">Have Questions?</h2>
        <p className="text-muted mb-6">We'd love to hear from you. Reach out to our team anytime.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-coral/20">
          Contact Us <FiArrowRight size={16} />
        </Link>
      </section>

    </div>
  )
}
