import { useState, useEffect } from 'react'

const TARGET = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

function getTimeLeft() {
  const diff = TARGET - Date.now()
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  }
}

export default function App() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="page">
      <div className="blur-circle top-left" />
      <div className="blur-circle bottom-right" />

      <div className="content">
        <div className="logo-wrap">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>

        <h1 className="heading">Coming Soon</h1>
        <p className="sub">Something big is on its way. Stay tuned!</p>

        <div className="timer">
          {[['Days', time.days], ['Hours', time.hours], ['Mins', time.mins], ['Secs', time.secs]].map(([label, val]) => (
            <div className="tile" key={label}>
              <span className="num">{String(val).padStart(2, '0')}</span>
              <span className="label">{label}</span>
            </div>
          ))}
        </div>

        <div className="notify">
          <input type="email" placeholder="Enter your email" className="input" />
          <button className="btn">Notify Me</button>
        </div>
      </div>
    </div>
  )
}
