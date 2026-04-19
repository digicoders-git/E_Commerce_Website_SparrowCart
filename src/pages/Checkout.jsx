import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { FiCheckCircle, FiChevronRight, FiLock, FiTruck, FiCreditCard, FiMapPin, FiEdit2 } from 'react-icons/fi'
import { BsCheckCircleFill } from 'react-icons/bs'

const steps = ['Address', 'Payment', 'Confirm']

export default function Checkout() {
  const { cart, subtotal, discount, total, coupon, placeOrder } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [payment, setPayment] = useState('cod')
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '', city: '', pincode: '', state: '',
  })
  const [formErrors, setFormErrors] = useState({})

  const shipping = subtotal >= 999 ? 0 : 99
  const grandTotal = total + shipping

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setFormErrors(fe => ({ ...fe, [e.target.name]: '' }))
  }

  const validateStep0 = () => {
    const errors = {}
    if (!form.firstName.trim()) errors.firstName = 'Required'
    if (!form.lastName.trim()) errors.lastName = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid phone required'
    if (!form.address.trim()) errors.address = 'Required'
    if (!form.city.trim()) errors.city = 'Required'
    if (!form.pincode.trim() || form.pincode.length < 6) errors.pincode = 'Valid pincode required'
    if (!form.state.trim()) errors.state = 'Required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePlaceOrder = () => {
    const order = placeOrder({
      userId: user.id,
      shippingAddress: { ...form },
      paymentMethod: payment,
    })
    setPlacedOrder(order)
  }

  if (placedOrder) return (
    <div className="bg-neutral min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 py-16">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
        <BsCheckCircleFill size={52} className="text-green-500" />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-dark mb-2">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you, <span className="font-semibold text-dark">{user.name}</span>! Your order is confirmed.</p>
      </div>
      <div className="bg-white rounded-2xl border border-border px-8 py-6 text-sm text-dark space-y-3 w-full max-w-sm shadow-sm">
        <div className="flex justify-between">
          <span className="text-muted">Order ID</span>
          <span className="font-bold text-teal">{placedOrder.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Amount Paid</span>
          <span className="font-bold">₹{placedOrder.total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Payment</span>
          <span className="font-semibold capitalize">{payment === 'cod' ? 'Cash on Delivery' : payment.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Estimated Delivery</span>
          <span className="font-semibold text-green-600">3–5 Business Days</span>
        </div>
        <div className="border-t border-border pt-3 text-left">
          <p className="text-muted text-xs">Delivering to:</p>
          <p className="font-medium mt-0.5">{form.firstName} {form.lastName}</p>
          <p className="text-muted text-xs">{form.address}, {form.city}, {form.state} – {form.pincode}</p>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <button onClick={() => navigate('/account', { state: { tab: 'orders' } })} className="bg-teal hover:bg-teal-light text-white font-bold px-8 py-3 rounded-xl transition">
          Track Order
        </button>
        <button onClick={() => navigate('/')} className="border border-border text-dark font-bold px-8 py-3 rounded-xl hover:border-teal hover:text-teal transition">
          Continue Shopping
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-neutral min-h-screen">
      <div className="bg-gradient-to-r from-teal to-teal-light py-10 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold">Checkout</h1>
          <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
            <Link to="/" className="hover:text-white">Home</Link>
            <FiChevronRight size={14} />
            <Link to="/cart" className="hover:text-white">Cart</Link>
            <FiChevronRight size={14} />
            <span className="text-white">Checkout</span>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition ${i <= step ? 'text-teal' : 'text-muted'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-teal text-white' : 'bg-gray-100 text-muted'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 transition ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">

          {/* Step 0: Address */}
          {step === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold text-dark mb-1 flex items-center gap-2">
                <FiMapPin className="text-accent" /> Delivery Address
              </h2>
              <p className="text-muted text-sm mb-5">Where should we deliver your order?</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', name: 'firstName', type: 'text', col: 1 },
                  { label: 'Last Name', name: 'lastName', type: 'text', col: 1 },
                  { label: 'Email Address', name: 'email', type: 'email', col: 1 },
                  { label: 'Phone Number', name: 'phone', type: 'tel', col: 1 },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-muted mb-1.5 block uppercase tracking-wide">{f.label}</label>
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.label}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition ${formErrors[f.name] ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-accent'}`} />
                    {formErrors[f.name] && <p className="text-red-500 text-xs mt-1">{formErrors[f.name]}</p>}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted mb-1.5 block uppercase tracking-wide">Full Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={3}
                    placeholder="House/Flat No., Street, Landmark, Area"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition resize-none ${formErrors.address ? 'border-red-400' : 'border-border focus:border-accent'}`} />
                  {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                </div>
                {[
                  { label: 'City', name: 'city' },
                  { label: 'Pincode', name: 'pincode' },
                  { label: 'State', name: 'state' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-muted mb-1.5 block uppercase tracking-wide">{f.label}</label>
                    <input type="text" name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.label}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/10 transition ${formErrors[f.name] ? 'border-red-400' : 'border-border focus:border-accent'}`} />
                    {formErrors[f.name] && <p className="text-red-500 text-xs mt-1">{formErrors[f.name]}</p>}
                  </div>
                ))}
              </div>
              <button onClick={() => { if (validateStep0()) setStep(1) }}
                className="mt-6 w-full bg-teal hover:bg-teal-light text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
                Continue to Payment <FiChevronRight />
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold text-dark mb-1 flex items-center gap-2">
                <FiCreditCard className="text-accent" /> Payment Method
              </h2>
              <p className="text-muted text-sm mb-5">Choose how you'd like to pay</p>
              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives at your door', icon: '💵' },
                  { id: 'upi', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm, BHIM UPI', icon: '📱' },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay, Amex', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', desc: 'All major Indian banks supported', icon: '🏦' },
                  { id: 'wallet', label: 'Wallets', desc: 'Paytm, Amazon Pay, Mobikwik', icon: '👛' },
                ].map(m => (
                  <label key={m.id} onClick={() => setPayment(m.id)}
                    className={`flex items-center gap-4 border-2 rounded-xl px-4 py-4 cursor-pointer transition ${payment === m.id ? 'border-teal bg-teal/5' : 'border-border hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-teal" />
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-dark text-sm">{m.label}</div>
                      <div className="text-xs text-muted">{m.desc}</div>
                    </div>
                    {payment === m.id && <FiCheckCircle className="text-teal shrink-0" size={18} />}
                  </label>
                ))}
              </div>

              {payment === 'card' && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-xl border border-border">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Card Details</p>
                  <input placeholder="Card Number (16 digits)" maxLength={19} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                    <input placeholder="CVV" maxLength={3} className="border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <input placeholder="Cardholder Name" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                </div>
              )}

              {payment === 'upi' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-border">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">UPI ID</p>
                  <input placeholder="yourname@upi" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 border border-border text-dark font-bold py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-1">
                  <FiEdit2 size={14} /> Edit Address
                </button>
                <button onClick={() => setStep(2)} className="flex-1 bg-teal hover:bg-teal-light text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">
                  Review Order <FiChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold text-dark mb-5">Review & Place Order</h2>

              {/* Address summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-dark text-sm flex items-center gap-2"><FiMapPin className="text-accent" size={14} /> Delivering to</p>
                  <button onClick={() => setStep(0)} className="text-xs text-accent hover:underline font-medium flex items-center gap-1"><FiEdit2 size={11} /> Change</button>
                </div>
                <p className="text-dark text-sm font-medium">{form.firstName} {form.lastName} · {form.phone}</p>
                <p className="text-muted text-xs mt-0.5">{form.address}, {form.city}, {form.state} – {form.pincode}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-dark text-sm flex items-center gap-2"><FiCreditCard className="text-accent" size={14} /> Payment</p>
                  <button onClick={() => setStep(1)} className="text-xs text-accent hover:underline font-medium flex items-center gap-1"><FiEdit2 size={11} /> Change</button>
                </div>
                <p className="text-dark text-sm font-medium">
                  {payment === 'cod' ? '💵 Cash on Delivery' : payment === 'upi' ? '📱 UPI Payment' : payment === 'card' ? '💳 Credit / Debit Card' : payment === 'netbanking' ? '🏦 Net Banking' : '👛 Wallet'}
                </p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-border">
                <p className="font-semibold text-dark text-sm mb-3">Order Items ({cart.length})</p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-dark text-xs font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted text-xs">Qty: {item.qty}</p>
                      </div>
                      <span className="text-teal font-bold text-sm shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <FiLock className="text-green-500 shrink-0" size={14} />
                Safe and secure payments. Your data is 100% encrypted.
              </div>

              <button onClick={handlePlaceOrder}
                className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-4 rounded-xl transition shadow-lg shadow-coral/20 text-base flex items-center justify-center gap-2">
                <FiCheckCircle size={18} /> Place Order · ₹{grandTotal.toLocaleString()}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sticky top-32">
            <h2 className="text-lg font-bold text-dark mb-4">Price Details</h2>
            <div className="space-y-3 max-h-52 overflow-y-auto mb-4 pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-dark text-xs font-medium line-clamp-1">{item.name}</p>
                    <p className="text-muted text-xs">× {item.qty}</p>
                  </div>
                  <span className="text-dark text-xs font-semibold shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-dark">
                <span>Price ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({coupon?.code})</span>
                  <span>−₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-dark">
                <span>Delivery Charges</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold text-dark text-lg">
              <span>Total Amount</span>
              <span className="text-teal">₹{grandTotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-xs font-semibold mt-2 text-center">
                You save ₹{discount.toLocaleString()} on this order!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
