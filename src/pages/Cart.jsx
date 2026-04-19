import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import {
  FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiTag,
  FiArrowRight, FiChevronRight, FiTruck, FiShield, FiRefreshCw, FiCheckCircle
} from 'react-icons/fi'

export default function Cart() {
  const { cart, removeFromCart, updateQty, subtotal, discount, total, coupon, couponError, applyCoupon, removeCoupon } = useCart()
  const { user, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')

  const shipping = subtotal >= 999 ? 0 : 99
  const grandTotal = total + shipping
  const freeShippingLeft = Math.max(0, 999 - subtotal)
  const shippingProgress = Math.min(100, (subtotal / 999) * 100)

  if (cart.length === 0) return (
    <div className="bg-neutral min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border border-border">
        <FiShoppingCart size={44} className="text-gray-300" />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-dark mb-2">Your cart is empty</h2>
        <p className="text-muted">Looks like you haven't added anything yet.</p>
      </div>
      <Link to="/products" className="bg-coral text-white px-8 py-3.5 rounded-xl font-bold hover:bg-coral-dark transition shadow-lg shadow-coral/20 flex items-center gap-2">
        Start Shopping <FiArrowRight />
      </Link>
    </div>
  )

  return (
    <div className="bg-neutral min-h-screen">
      <div className="bg-gradient-to-r from-teal to-teal-light py-10 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold">Shopping Cart</h1>
          <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <FiChevronRight size={13} />
            <span className="text-white">Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">

        {/* Left */}
        <div className="flex-1 space-y-4">

          {/* Free shipping progress */}
          <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-dark">
                <FiTruck size={16} className="text-blue-500" />
                {freeShippingLeft === 0
                  ? <span className="text-green-600">You've unlocked FREE delivery!</span>
                  : <span>Add <span className="text-teal font-bold">₹{freeShippingLeft.toLocaleString()}</span> more for FREE delivery</span>
                }
              </div>
              <span className="text-xs text-muted">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal to-accent rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-dark">Cart Items ({cart.length})</h2>
              <span className="text-muted text-sm">{cart.reduce((s, i) => s + i.qty, 0)} units total</span>
            </div>
            <div className="divide-y divide-border">
              {cart.map(item => {
                const itemDiscount = item.originalPrice > item.price
                  ? Math.round((1 - item.price / item.originalPrice) * 100) : 0
                return (
                  <div key={item.id} className="p-5 flex gap-4 items-start hover:bg-gray-50/50 transition">
                    <Link to={`/products/${item.id}`} className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-border" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs text-accent font-semibold uppercase">{item.category}</span>
                          <Link to={`/products/${item.id}`}>
                            <h3 className="font-semibold text-dark text-sm mt-0.5 hover:text-teal transition line-clamp-2">{item.name}</h3>
                          </Link>
                          {itemDiscount > 0 && (
                            <span className="text-xs text-green-600 font-semibold">{itemDiscount}% off applied</span>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-coral transition p-1 shrink-0">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition">
                            <FiMinus size={12} />
                          </button>
                          <span className="w-10 text-center font-bold text-dark text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition">
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-dark text-base">₹{(item.price * item.qty).toLocaleString()}</p>
                          {itemDiscount > 0 && (
                            <p className="text-xs text-muted line-through">₹{(item.originalPrice * item.qty).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
              <FiTag className="text-accent" size={16} /> Apply Coupon Code
            </h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" size={16} />
                  <span className="font-bold text-green-700 font-mono">{coupon.code}</span>
                  <span className="text-green-600 text-sm">— {coupon.discount}% off applied!</span>
                </div>
                <button onClick={removeCoupon} className="text-coral text-sm hover:underline font-semibold">Remove</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); applyCoupon(couponInput) }} className="flex gap-3">
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent font-mono uppercase"
                />
                <button type="submit" className="bg-teal hover:bg-teal-light text-white font-bold px-5 py-2.5 rounded-xl transition text-sm whitespace-nowrap">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-coral text-xs mt-2">{couponError}</p>}
            <div className="flex gap-2 mt-3 flex-wrap">
              {['SPARROW20', 'SAVE10', 'FLAT50'].map(c => (
                <button key={c} onClick={() => setCouponInput(c)}
                  className="text-xs border border-dashed border-accent text-accent px-3 py-1 rounded-lg hover:bg-accent hover:text-white transition font-mono font-semibold">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sticky top-32">
            <h2 className="text-xl font-bold text-dark mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-dark">
                <span className="text-muted">Price ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon ({coupon?.code})</span>
                  <span>− ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-dark">
                <span className="text-muted">Delivery</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-semibold'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
            </div>

            <div className="border-t border-border my-4" />

            <div className="flex justify-between font-extrabold text-dark text-xl mb-2">
              <span>Total</span>
              <span className="text-teal">₹{grandTotal.toLocaleString()}</span>
            </div>

            {(discount > 0 || shipping === 0) && (
              <p className="text-green-600 text-xs font-semibold mb-4 bg-green-50 rounded-xl px-3 py-2">
                You're saving ₹{(discount + (subtotal >= 999 ? 99 : 0)).toLocaleString()} on this order!
              </p>
            )}

            <button
              onClick={() => user ? navigate('/checkout') : openAuthModal('/checkout')}
              className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-coral/20 flex items-center justify-center gap-2 text-base"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="block text-center text-accent text-sm mt-3 hover:underline font-medium">
              ← Continue Shopping
            </Link>

            <div className="mt-5 pt-5 border-t border-border space-y-2.5">
              {[
                { icon: <FiShield size={13} className="text-green-500" />, text: 'Secure SSL Encrypted Payment' },
                { icon: <FiCheckCircle size={13} className="text-green-500" />, text: '100% Genuine Products' },
                { icon: <FiRefreshCw size={13} className="text-green-500" />, text: 'Easy 30-day Returns' },
              ].map(t => (
                <div key={t.text} className="flex items-center gap-2 text-xs text-muted">
                  {t.icon} {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
