import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import {
  FiUser, FiShoppingBag, FiHeart, FiMapPin, FiSettings,
  FiEdit2, FiChevronRight, FiPackage, FiCheckCircle, FiTruck, FiClock, FiLogOut,
  FiX, FiArrowLeft
} from 'react-icons/fi'

const statusStyles = {
  Confirmed:       'text-blue-600 bg-blue-50',
  Processing:      'text-orange-600 bg-orange-50',
  Shipped:         'text-purple-600 bg-purple-50',
  'Out for Delivery': 'text-yellow-600 bg-yellow-50',
  Delivered:       'text-green-600 bg-green-50',
  Cancelled:       'text-red-600 bg-red-50',
}

const statusIcon = {
  Confirmed:          <FiCheckCircle size={13} />,
  Processing:         <FiClock size={13} />,
  Shipped:            <FiTruck size={13} />,
  'Out for Delivery': <FiTruck size={13} />,
  Delivered:          <FiCheckCircle size={13} />,
  Cancelled:          <FiX size={13} />,
}

const tabs = [
  { id: 'profile', label: 'My Profile', icon: <FiUser size={16} /> },
  { id: 'orders', label: 'My Orders', icon: <FiShoppingBag size={16} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FiHeart size={16} /> },
  { id: 'addresses', label: 'Addresses', icon: <FiMapPin size={16} /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings size={16} /> },
]

export default function Account() {
  const { wishlist, addToCart, getUserOrders, addToCart: reorderItem } = useCart()
  const { user, logout, openAuthModal, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: 'Male',
    dob: '1995-08-15',
  })
  const [saved, setSaved] = useState(false)

  const location = useLocation()
  const orders = user ? getUserOrders(user.id) : []

  useEffect(() => { if (!user) openAuthModal('/account') }, [user])
  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab)
  }, [location.state])
  if (!user) return null

  const handleSave = () => {
    updateUser({ name: `${profile.firstName} ${profile.lastName}`, email: profile.email, phone: profile.phone })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReorder = (order) => {
    order.items.forEach(item => reorderItem(item))
  }

  return (
    <div className="bg-neutral min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal to-teal-light py-10 px-4 text-white">
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-extrabold border-2 border-accent">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-white/70 text-sm mt-0.5">{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedOrder(null) }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition border-l-2 ${activeTab === tab.id ? 'border-teal text-teal bg-teal/5' : 'border-transparent text-dark hover:bg-gray-50'}`}
              >
                {tab.icon} {tab.label}
                {tab.id === 'orders' && orders.length > 0 && (
                  <span className="ml-auto bg-teal text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{orders.length}</span>
                )}
                {tab.id !== 'orders' && <FiChevronRight size={14} className="ml-auto text-muted" />}
              </button>
            ))}
            <div className="border-t border-border" />
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-coral hover:bg-red-50 transition border-l-2 border-transparent"
            >
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">Personal Information</h2>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition ${editing ? 'bg-teal text-white hover:bg-teal-light' : 'border border-border text-dark hover:border-teal hover:text-teal'}`}
                >
                  {editing ? <><FiCheckCircle size={14} /> Save Changes</> : <><FiEdit2 size={14} /> Edit Profile</>}
                </button>
              </div>

              {saved && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <FiCheckCircle size={14} /> Profile updated successfully!
                </div>
              )}

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8 p-4 bg-neutral rounded-2xl border border-border">
                <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-dark">{profile.firstName} {profile.lastName}</p>
                  <p className="text-muted text-sm">{profile.email}</p>
                  {editing && (
                    <button className="mt-2 text-xs text-accent hover:underline font-medium">Change Photo</button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'First Name', key: 'firstName', type: 'text' },
                  { label: 'Last Name', key: 'lastName', type: 'text' },
                  { label: 'Email Address', key: 'email', type: 'email' },
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                  { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                  { label: 'Date of Birth', key: 'dob', type: 'date' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">{f.label}</label>
                    {!editing ? (
                      <p className="text-dark text-sm font-medium px-4 py-2.5 bg-neutral rounded-xl border border-border">
                        {f.key === 'dob' ? new Date(profile[f.key]).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : profile[f.key]}
                      </p>
                    ) : f.type === 'select' ? (
                      <select
                        value={profile[f.key]}
                        onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent text-dark"
                      >
                        {f.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        value={profile[f.key]}
                        onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent text-dark"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && !selectedOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-bold text-dark">My Orders</h2>
                <p className="text-muted text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>
              {orders.length === 0 ? (
                <div className="py-16 text-center">
                  <FiPackage size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-dark font-semibold mb-1">No orders yet</p>
                  <p className="text-muted text-sm mb-4">Start shopping to see your orders here</p>
                  <Link to="/products" className="bg-teal text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-light transition inline-block">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map(order => (
                    <div key={order.id} className="p-5 hover:bg-gray-50/50 transition">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center text-teal">
                            <FiPackage size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-dark text-sm">{order.id}</p>
                            <p className="text-muted text-xs">
                              {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-dark">₹{order.total.toLocaleString()}</p>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${statusStyles[order.status] || 'text-gray-600 bg-gray-50'}`}>
                            {statusIcon[order.status]} {order.status}
                          </span>
                        </div>
                      </div>
                      {/* Item thumbnails */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <img key={idx} src={item.image} alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-border" />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-border flex items-center justify-center text-xs text-muted font-semibold">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs text-teal border border-teal px-4 py-1.5 rounded-lg hover:bg-teal hover:text-white transition font-semibold">
                          View Details
                        </button>
                        {order.status === 'Delivered' && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="text-xs text-dark border border-border px-4 py-1.5 rounded-lg hover:border-teal hover:text-teal transition font-semibold">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order Detail View */}
          {activeTab === 'orders' && selectedOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                  <FiArrowLeft size={15} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-dark">Order {selectedOrder.id}</h2>
                  <p className="text-muted text-xs">
                    Placed on {new Date(selectedOrder.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[selectedOrder.status] || 'text-gray-600 bg-gray-50'}`}>
                  {statusIcon[selectedOrder.status]} {selectedOrder.status}
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Tracking Timeline */}
                <div>
                  <p className="text-sm font-bold text-dark mb-4">Order Tracking</p>
                  <div className="relative">
                    {selectedOrder.timeline.map((step, i) => (
                      <div key={i} className="flex gap-4 pb-5 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            step.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-muted'
                          }`}>
                            {step.done ? <FiCheckCircle size={15} /> : <FiClock size={15} />}
                          </div>
                          {i < selectedOrder.timeline.length - 1 && (
                            <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-green-400' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        <div className="pt-1 pb-2">
                          <p className={`text-sm font-semibold ${step.done ? 'text-dark' : 'text-muted'}`}>{step.status}</p>
                          {step.time && (
                            <p className="text-xs text-muted mt-0.5">
                              {new Date(step.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm font-bold text-dark mb-3">Items Ordered</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl border border-border">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-dark text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-muted text-xs mt-0.5">Qty: {item.qty} × ₹{item.price.toLocaleString()}</p>
                        </div>
                        <span className="text-teal font-bold text-sm shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-xl border border-border p-4 text-sm space-y-2">
                  <p className="font-bold text-dark mb-3">Price Breakdown</p>
                  <div className="flex justify-between text-dark">
                    <span>Subtotal</span><span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount {selectedOrder.coupon ? `(${selectedOrder.coupon.code})` : ''}</span>
                      <span>−₹{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-dark">
                    <span>Shipping</span>
                    <span className={selectedOrder.shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-dark border-t border-border pt-2 mt-1">
                    <span>Total Paid</span><span className="text-teal">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-gray-50 rounded-xl border border-border p-4">
                  <p className="text-sm font-bold text-dark mb-2 flex items-center gap-2"><FiMapPin className="text-accent" size={14} /> Delivery Address</p>
                  <p className="text-dark text-sm font-medium">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                  <p className="text-muted text-xs mt-0.5">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} – {selectedOrder.shippingAddress.pincode}</p>
                  <p className="text-muted text-xs mt-0.5">{selectedOrder.shippingAddress.phone}</p>
                </div>

                {selectedOrder.status === 'Delivered' && (
                  <button onClick={() => { handleReorder(selectedOrder); setSelectedOrder(null); setActiveTab('orders') }}
                    className="w-full border border-teal text-teal font-bold py-3 rounded-xl hover:bg-teal hover:text-white transition text-sm">
                    Reorder All Items
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-dark">My Wishlist</h2>
                  <p className="text-muted text-sm mt-0.5">{wishlist.length} saved items</p>
                </div>
                <Link to="/wishlist" className="text-accent text-sm font-semibold hover:underline">View All</Link>
              </div>
              {wishlist.length === 0 ? (
                <div className="py-16 text-center">
                  <FiHeart size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-dark font-semibold mb-1">No saved items</p>
                  <p className="text-muted text-sm mb-4">Browse products and add to wishlist</p>
                  <Link to="/products" className="bg-teal text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-light transition">
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {wishlist.map(p => (
                    <div key={p.id} className="p-4 flex gap-4 items-center hover:bg-gray-50/50 transition">
                      <Link to={`/products/${p.id}`}>
                        <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl border border-border shrink-0" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-accent font-semibold uppercase">{p.category}</span>
                        <Link to={`/products/${p.id}`}>
                          <p className="font-semibold text-dark text-sm hover:text-teal transition line-clamp-1">{p.name}</p>
                        </Link>
                        <p className="text-teal font-bold mt-0.5">₹{p.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-coral hover:bg-coral-dark text-white text-xs font-semibold px-4 py-2 rounded-xl transition shrink-0"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">Saved Addresses</h2>
                <button className="flex items-center gap-2 text-sm font-semibold bg-teal text-white px-4 py-2 rounded-xl hover:bg-teal-light transition">
                  + Add New
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { type: 'Home', address: '12, Sunshine Apartments, Andheri West', city: 'Mumbai', pincode: '400058', default: true },
                  { type: 'Office', address: '5th Floor, Tech Park, Powai', city: 'Mumbai', pincode: '400076', default: false },
                ].map(addr => (
                  <div key={addr.type} className={`rounded-2xl border-2 p-4 relative ${addr.default ? 'border-teal bg-teal/5' : 'border-border'}`}>
                    {addr.default && (
                      <span className="absolute top-3 right-3 bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">Default</span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <FiMapPin className="text-accent" size={16} />
                      <span className="font-bold text-dark text-sm">{addr.type}</span>
                    </div>
                    <p className="text-dark text-sm">{addr.address}</p>
                    <p className="text-muted text-sm">{addr.city} - {addr.pincode}</p>
                    <div className="flex gap-3 mt-3">
                      <button className="text-xs text-teal font-semibold hover:underline">Edit</button>
                      <button className="text-xs text-coral font-semibold hover:underline">Delete</button>
                      {!addr.default && <button className="text-xs text-muted font-semibold hover:underline">Set Default</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-bold text-dark mb-5">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">Current Password</label>
                    <input type="password" placeholder="Enter current password" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <button className="bg-teal hover:bg-teal-light text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-dark mb-4">Notifications</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Order Updates', desc: 'Get notified about your order status' },
                    { label: 'Promotional Emails', desc: 'Deals, discounts and new arrivals' },
                    { label: 'SMS Alerts', desc: 'Receive SMS for important updates' },
                  ].map((n, i) => (
                    <div key={n.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-dark text-sm font-medium">{n.label}</p>
                        <p className="text-muted text-xs">{n.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-checked:bg-teal rounded-full transition peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-muted text-sm mb-4">Once you delete your account, there is no going back.</p>
                <button className="border border-red-300 text-red-500 hover:bg-red-50 font-semibold px-5 py-2 rounded-xl text-sm transition">
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
