import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { cart, total } = useCart()
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlaced(true)
  }

  if (placed) return (
    <div className="bg-neutral min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-6xl">🎉</div>
      <h2 className="text-3xl font-extrabold text-teal">Order Placed!</h2>
      <p className="text-gray-500">Thank you for shopping with SparrowCart. Your order is confirmed.</p>
      <button onClick={() => navigate('/')} className="bg-coral text-white px-8 py-3 rounded-xl font-bold hover:bg-coral-dark transition mt-2">
        Back to Home
      </button>
    </div>
  )

  return (
    <div className="bg-neutral min-h-screen">
      <div className="bg-gradient-to-r from-green-from to-green-to py-10 px-4 text-white text-center">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-dark">Shipping Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['First Name', 'text'], ['Last Name', 'text'], ['Email', 'email'], ['Phone', 'tel']].map(([label, type]) => (
              <div key={label}>
                <label className="text-sm text-gray-500 mb-1 block">{label}</label>
                <input required type={type} placeholder={label} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Address</label>
            <textarea required rows={3} placeholder="Full Address" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['City', 'text'], ['Pincode', 'text']].map(([label, type]) => (
              <div key={label}>
                <label className="text-sm text-gray-500 mb-1 block">{label}</label>
                <input required type={type} placeholder={label} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal" />
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-dark mt-2">Payment Method</h2>
          <div className="flex flex-col gap-2">
            {['Cash on Delivery', 'UPI', 'Credit / Debit Card'].map(method => (
              <label key={method} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:border-teal transition">
                <input type="radio" name="payment" defaultChecked={method === 'Cash on Delivery'} className="accent-teal" />
                <span className="text-sm text-dark">{method}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="bg-coral hover:bg-coral-dark text-white font-bold py-3 rounded-xl transition mt-2">
            Place Order · ₹{total.toLocaleString()}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold text-dark mb-4">Order Items</h2>
            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-dark line-clamp-1">{item.name}</p>
                    <p className="text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <span className="font-semibold text-teal text-sm">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-dark text-lg">
              <span>Total</span><span className="text-teal">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
