import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiX, FiMail, FiLock, FiPhone, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const passwordStrength = (p) => {
  if (!p) return null
  if (p.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' }
  if (p.length < 8 || !/[0-9]/.test(p)) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' }
  if (!/[A-Z]/.test(p) || !/[^a-zA-Z0-9]/.test(p)) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' }
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
}

export default function AuthModal() {
  const { closeAuthModal, login, register, loginWithPhone, redirectAfterLogin } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError('') }
  const strength = passwordStrength(form.password)

  const afterSuccess = () => {
    closeAuthModal()
    if (redirectAfterLogin) navigate(redirectAfterLogin)
  }

  const handleOtpChange = (val, i) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }
  const handleOtpKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus()
  }

  const doLogin = () => {
    if (!form.email || !form.password) return setError('Please fill all fields')
    setLoading(true)
    setTimeout(() => {
      const res = login({ email: form.email, password: form.password, rememberMe })
      if (res.error) { setError(res.error); setLoading(false) }
      else { setLoading(false); afterSuccess() }
    }, 700)
  }

  const doRegister = () => {
    if (!form.name || !form.email || !form.phone || !form.password) return setError('Please fill all fields')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address')
    if (form.phone.replace(/\D/g, '').length < 10) return setError('Enter a valid 10-digit phone number')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setTimeout(() => {
      const res = register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      if (res.error) { setError(res.error); setLoading(false) }
      else { setLoading(false); afterSuccess() }
    }, 700)
  }

  const sendOtp = () => {
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10) return setError('Enter a valid 10-digit mobile number')
    setLoading(true)
    setTimeout(() => { setOtpSent(true); setLoading(false); setError('') }, 800)
  }

  const verifyOtp = () => {
    if (otp.join('').length < 6) return setError('Enter the 6-digit OTP')
    setLoading(true)
    setTimeout(() => {
      loginWithPhone({ phone: form.phone })
      setLoading(false)
      afterSuccess()
    }, 700)
  }

  const switchMode = (m) => { setMode(m); setError(''); setOtpSent(false); setOtp(['', '', '', '', '', '']); setForm({ name: '', email: '', phone: '', password: '' }) }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex min-h-[520px]">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-teal to-teal-light text-white p-10 w-80 shrink-0">
          <div>
            <img src="/logo.png" alt="logo" className="w-12 h-12 rounded-full border-2 border-accent mb-6 object-cover" />
            <h2 className="text-3xl font-extrabold leading-tight mb-3">
              {mode === 'login' ? 'Welcome Back!' : mode === 'register' ? 'Join SparrowCart' : 'Quick Login'}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {mode === 'login' ? 'Login to access your orders, wishlist and exclusive deals.' : mode === 'register' ? 'Create your account and start shopping with exclusive member benefits.' : 'Login instantly with your mobile number using OTP.'}
            </p>
          </div>
          <div className="space-y-3">
            {['Access your orders anytime', 'Save items to wishlist', 'Exclusive member deals', 'Faster checkout'].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-white/70">
                <FiCheckCircle size={14} className="text-accent shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-8 flex flex-col justify-center relative overflow-y-auto">
          <button onClick={closeAuthModal} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition z-10">
            <FiX size={16} />
          </button>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {[['login', 'Login'], ['register', 'Sign Up'], ['otp', 'OTP']].map(([m, label]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === m ? 'bg-white text-teal shadow-sm' : 'text-muted hover:text-dark'}`}>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type="email" placeholder="Email address" value={form.email} onChange={set('email')}
                  onKeyDown={e => e.key === 'Enter' && doLogin()}
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition" />
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={set('password')}
                  onKeyDown={e => e.key === 'Enter' && doLogin()}
                  className="w-full border border-border rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition" />
                <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                  <input type="checkbox" className="accent-teal" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Remember me
                </label>
                <button className="text-xs text-accent hover:underline font-medium">Forgot Password?</button>
              </div>
              <button onClick={doLogin} disabled={loading}
                className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-coral/20">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiArrowRight size={16} /> Login to SparrowCart</>}
              </button>
              <p className="text-center text-sm text-muted">
                New here?{' '}
                <button onClick={() => switchMode('register')} className="text-accent font-semibold hover:underline">Create Account</button>
              </p>
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <button onClick={() => switchMode('otp')} className="w-full border border-border text-dark font-semibold py-2.5 rounded-xl hover:border-teal hover:text-teal transition text-sm flex items-center justify-center gap-2">
                <FiPhone size={15} /> Login with OTP
              </button>
            </div>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <div className="space-y-3">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type="text" placeholder="Full Name" value={form.name} onChange={set('name')}
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition" />
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type="email" placeholder="Email address" value={form.email} onChange={set('email')}
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition" />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input type="tel" placeholder="Mobile Number (10 digits)" value={form.phone} onChange={set('phone')} maxLength={10}
                  className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition" />
              </div>
              <div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input type={showPass ? 'text' : 'password'} placeholder="Create Password" value={form.password} onChange={set('password')}
                    className="w-full border border-border rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition" />
                  <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                    <p className={`text-xs mt-1 font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label} password</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted">By creating an account, you agree to SparrowCart's <span className="text-accent cursor-pointer hover:underline">Terms of Use</span> and <span className="text-accent cursor-pointer hover:underline">Privacy Policy</span>.</p>
              <button onClick={doRegister} disabled={loading}
                className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-coral/20">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiArrowRight size={16} /> Create Account</>}
              </button>
              <p className="text-center text-sm text-muted">
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-accent font-semibold hover:underline">Login</button>
              </p>
            </div>
          )}

          {/* OTP */}
          {mode === 'otp' && (
            <div className="space-y-5">
              {!otpSent ? (
                <>
                  <div>
                    <p className="text-dark font-semibold mb-1">Enter your mobile number</p>
                    <p className="text-muted text-xs mb-4">We'll send a 6-digit OTP to verify your number</p>
                    <div className="flex border border-border rounded-xl overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition">
                      <span className="px-3 py-3 bg-gray-50 text-dark text-sm font-semibold border-r border-border">+91</span>
                      <input type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={set('phone')} maxLength={10}
                        className="flex-1 px-4 py-3 text-sm outline-none text-dark" />
                    </div>
                  </div>
                  <button onClick={sendOtp} disabled={loading}
                    className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-coral/20">
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiPhone className="text-green-600" size={24} />
                    </div>
                    <p className="text-dark font-semibold">OTP Sent!</p>
                    <p className="text-muted text-sm mt-1">Enter the 6-digit code sent to <span className="text-teal font-semibold">+91 {form.phone}</span></p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {otp.map((d, i) => (
                      <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        className="w-11 h-12 text-center text-lg font-bold border-2 border-border rounded-xl outline-none focus:border-accent transition text-dark" />
                    ))}
                  </div>
                  <button onClick={verifyOtp} disabled={loading}
                    className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-coral/20">
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Login'}
                  </button>
                  <p className="text-center text-xs text-muted">
                    Didn't receive?{' '}
                    <button onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']) }} className="text-accent font-semibold hover:underline">Resend OTP</button>
                  </p>
                </>
              )}
              <p className="text-center text-sm text-muted">
                <button onClick={() => switchMode('login')} className="text-accent font-semibold hover:underline">← Back to Login</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
