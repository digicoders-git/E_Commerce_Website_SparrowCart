import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const COUPONS = { SPARROW20: 20, SAVE10: 10, FLAT50: 50 }

const ORDERS_KEY = 'sparrowcart_orders'
const getOrders = () => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
const saveOrders = (orders) => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id)
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => { setCart([]); setCoupon(null) }

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, product]
    )
  }

  const isWishlisted = (id) => wishlist.some(i => i.id === id)

  const applyCoupon = (code) => {
    const disc = COUPONS[code.toUpperCase()]
    if (disc) { setCoupon({ code: code.toUpperCase(), discount: disc }); setCouponError(''); return true }
    setCouponError('Invalid coupon code'); return false
  }

  const removeCoupon = () => { setCoupon(null); setCouponError('') }

  // Place order — saves to localStorage
  const placeOrder = ({ userId, shippingAddress, paymentMethod }) => {
    const subtotalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const discountAmt = coupon ? Math.round(subtotalAmt * coupon.discount / 100) : 0
    const shippingAmt = subtotalAmt >= 999 ? 0 : 99
    const totalAmt = subtotalAmt - discountAmt + shippingAmt

    const order = {
      id: `#SC${Date.now().toString().slice(-6)}`,
      userId,
      items: cart.map(i => ({ id: i.id, name: i.name, image: i.image, price: i.price, qty: i.qty, category: i.category })),
      shippingAddress,
      paymentMethod,
      coupon: coupon || null,
      subtotal: subtotalAmt,
      discount: discountAmt,
      shipping: shippingAmt,
      total: totalAmt,
      status: 'Confirmed',
      placedAt: new Date().toISOString(),
      timeline: [
        { status: 'Order Placed', time: new Date().toISOString(), done: true },
        { status: 'Processing', time: null, done: false },
        { status: 'Shipped', time: null, done: false },
        { status: 'Out for Delivery', time: null, done: false },
        { status: 'Delivered', time: null, done: false },
      ]
    }

    const all = getOrders()
    saveOrders([order, ...all])
    clearCart()
    return order
  }

  const getUserOrders = (userId) => getOrders().filter(o => o.userId === userId)

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = coupon ? Math.round(subtotal * coupon.discount / 100) : 0
  const total = subtotal - discount
  const count = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      wishlist, toggleWishlist, isWishlisted,
      coupon, couponError, applyCoupon, removeCoupon,
      placeOrder, getUserOrders,
      subtotal, discount, total, count
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
