import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiTag, FiArrowRight, FiChevronRight } from 'react-icons/fi'

export default function Cart() {
  const { cart, removeFromCart, updateQty, subtotal, discount, total, coupon, couponError, applyCoupon, removeCoupon } = useCart()
  const { user, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')

  const handleCoupon = (e) => {
    e.preventDefault()
    applyCoupon(couponInput)
  }

  if (cart.length === 0) return (
    <div className="bg-neutral min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
        <FiShoppingCart size={40} className="text-gray-300" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-dark mb-2">Your cart is empty</h2>
        <p className="text-muted text-sm">Looks like you haven't added anything yet.</p>
      </div>
      <Link to="/products" className="bg-coral text-white px-8 py-3.5 rounded-xl font-bold hover:bg-coral-dark transition shadow-lg shadow-coral/20">
        Start Shopping
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
            <FiChevronRight size={14} />
            <span className="text-white">Cart ({cart.length} items)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">

        {/* Items */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-dark">Cart Items ({cart.length})</h2>
              <span className="text-muted text-sm">{cart.reduce((s, i) => s + i.qty, 0)} units</span>
            </div>
            <div className="divide-y divide-border">
              {cart.map(item => {
                const itemDiscount = item.originalPrice > item.price
                  ? Math.round((1 - item.price / item.originalPrice) * 100)
                  : 0
                return (
                  <div key={item.id} className="p-5 flex gap-4 items-start hover:bg-gray-50/50 transition">
                    <Link to={`/products/${item.id}`}>
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-border shrink-0" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs text-accent font-semibold uppercase">{item.category}</span>
                          <Link to={`/products/${item.id}`}>
                            <h3 className="font-semibold text-dark text-sm mt-0.5 hover:text-teal transition">{item.name}</h3>
                          </Link>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-coral transition p-1 shrink-0">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        <div className="flex items-center border border-border rounded-xl overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-dark">
                            <FiMinus size={12} />
                          </button>
                          <span className="w-10 text-center font-bold text-dark text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-dark">
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-dark">₹{(item.price * item.qty).toLocaleString()}</p>
                          {itemDiscount > 0 && <p className="text-xs text-muted line-through">₹{(item.originalPrice * item.qty).toLocaleString()}</p>}
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
            <h3 className="font-bold text-dark mb-3 flex items-center gap-2"><FiTag className="text-accent" /> Apply Coupon</h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div>
                  <span className="font-bold text-green-700 font-mono">{coupon.code}</span>
                  <span className="text-green-600 text-sm ml-2">— {coupon.discount}% off applied!</span>
                </div>
                <button onClick={removeCoupon} className="text-coral text-sm hover:underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleCoupon} className="flex gap-3">
                <input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code (e.g. SPARROW20)"
                  className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
                <button type="submit" className="bg-teal hover:bg-teal-light text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-coral text-xs mt-2">{couponError}</p>}
            <p className="text-muted text-xs mt-2">Try: SPARROW20, SAVE10, FLAT50</p>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sticky top-32">
            <h2 className="text-xl font-bold text-dark mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-dark">
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({coupon?.discount}%)</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-dark">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">{subtotal >= 999 ? 'FREE' : '₹99'}</span>
              </div>
              {subtotal < 999 && (
                <p className="text-xs text-muted bg-accent-light rounded-lg px-3 py-2">
                  Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                </p>
              )}
            </div>

            <div className="border-t border-border my-4" />

            <div className="flex justify-between font-bold text-dark text-lg mb-6">
              <span>Total</span>
              <span className="text-teal">₹{(total + (subtotal < 999 ? 99 : 0)).toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                if (user) navigate('/checkout')
                else openAuthModal('/checkout')
              }}
              className="flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white text-center font-bold py-3.5 rounded-xl transition shadow-lg shadow-coral/20 w-full"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="block text-center text-accent text-sm mt-3 hover:underline">
              ← Continue Shopping
            </Link>

            {/* Trust */}
            <div className="mt-5 pt-5 border-t border-border space-y-2">
              {['Secure SSL Encrypted Payment', '100% Genuine Products', 'Easy 30-day Returns'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-muted">
                  <span className="text-green-500">✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
