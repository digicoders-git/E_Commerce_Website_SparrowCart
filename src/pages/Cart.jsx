import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart()

  if (cart.length === 0) return (
    <div className="bg-neutral min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <div className="text-6xl">🛒</div>
      <p className="text-xl font-semibold">Your cart is empty</p>
      <Link to="/products" className="bg-coral text-white px-6 py-3 rounded-xl font-bold hover:bg-coral-dark transition">
        Start Shopping
      </Link>
    </div>
  )

  return (
    <div className="bg-neutral min-h-screen">
      <div className="bg-gradient-to-r from-green-from to-green-to py-10 px-4 text-white text-center">
        <h1 className="text-3xl font-extrabold">Your Cart</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="font-semibold text-dark">{item.name}</h3>
                <p className="text-teal font-bold text-lg">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-dark transition">−</button>
                <span className="w-6 text-center font-semibold">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-dark transition">+</button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-dark">₹{(item.price * item.qty).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-coral text-xs hover:underline mt-1">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Shipping</span><span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="border-t my-4" />
            <div className="flex justify-between font-bold text-dark text-lg mb-6">
              <span>Total</span><span className="text-teal">₹{total.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="block bg-coral hover:bg-coral-dark text-white text-center font-bold py-3 rounded-xl transition"
            >
              Proceed to Checkout
            </Link>
            <Link to="/products" className="block text-center text-accent text-sm mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
