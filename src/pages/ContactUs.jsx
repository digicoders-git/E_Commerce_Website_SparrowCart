import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi'
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'

const info = [
  {
    icon: <FiMail size={20} />,
    title: 'Email Us',
    lines: ['support@sparrowcart.com', 'business@sparrowcart.com'],
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: <FiPhone size={20} />,
    title: 'Call Us',
    lines: ['+91 98765 43210', '+91 91234 56789'],
    color: 'text-green-500 bg-green-50',
  },
  {
    icon: <FiMapPin size={20} />,
    title: 'Visit Us',
    lines: ['5th Floor, Tech Park, Powai', 'Mumbai, Maharashtra – 400076'],
    color: 'text-coral bg-red-50',
  },
  {
    icon: <FiClock size={20} />,
    title: 'Business Hours',
    lines: ['Mon – Sat: 9:00 AM – 6:00 PM', 'Sunday: Closed'],
    color: 'text-purple-500 bg-purple-50',
  },
]

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1000)
  }

  return (
    <div className="bg-neutral min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-teal to-teal-light py-16 px-4 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Got a question, feedback, or just want to say hi? We're always happy to hear from you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {info.map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-dark text-sm mb-2">{item.title}</h3>
              {item.lines.map((l, i) => (
                <p key={i} className="text-muted text-xs leading-relaxed">{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-extrabold text-dark mb-2">Message Sent!</h3>
                  <p className="text-muted text-sm">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-6 text-accent font-semibold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-dark mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">Full Name</label>
                        <input
                          type="text" value={form.name} onChange={set('name')} placeholder="Your name"
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition ${errors.name ? 'border-red-400' : 'border-border focus:border-accent'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">Email Address</label>
                        <input
                          type="email" value={form.email} onChange={set('email')} placeholder="your@email.com"
                          className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition ${errors.email ? 'border-red-400' : 'border-border focus:border-accent'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">Subject</label>
                      <input
                        type="text" value={form.subject} onChange={set('subject')} placeholder="How can we help?"
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition ${errors.subject ? 'border-red-400' : 'border-border focus:border-accent'}`}
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">Message</label>
                      <textarea
                        value={form.message} onChange={set('message')} rows={5} placeholder="Write your message here..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition resize-none ${errors.message ? 'border-red-400' : 'border-border focus:border-accent'}`}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>
                    <button
                      type="submit" disabled={loading}
                      className="w-full bg-teal hover:bg-teal-light text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><FiSend size={15} /> Send Message</>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="lg:w-72 shrink-0 space-y-5">

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-4">Common Questions</h3>
              <div className="space-y-4">
                {[
                  { q: 'How do I track my order?', a: 'Go to My Account → My Orders to see real-time tracking.' },
                  { q: 'What is the return policy?', a: 'We offer a 30-day hassle-free return on all products.' },
                  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days.' },
                ].map(item => (
                  <div key={item.q} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <p className="text-dark text-sm font-semibold mb-1">{item.q}</p>
                    <p className="text-muted text-xs leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: <FiInstagram size={18} />, label: 'Instagram', color: 'hover:bg-pink-500' },
                  { icon: <FiFacebook size={18} />, label: 'Facebook', color: 'hover:bg-blue-600' },
                  { icon: <FiTwitter size={18} />, label: 'Twitter', color: 'hover:bg-sky-500' },
                ].map(s => (
                  <a key={s.label} href="#"
                    className={`w-10 h-10 bg-gray-100 ${s.color} hover:text-white rounded-xl flex items-center justify-center transition`}
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
