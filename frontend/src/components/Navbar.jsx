import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logo from '../logo.png'

function Navbar() {
  const { user, logout } = useAuth()
  const [language, setLanguage] = useState('hi')
  const [pinCode, setPinCode] = useState('Set Pincode')
  const [locLoading, setLocLoading] = useState(false)
  const navigate = useNavigate()

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता।')
      return
    }

    setLocLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()

          const code =
            data.postcode ||
            data.principalSubdivisionCode ||
            data.locality ||
            'Unknown'

          setPinCode(code)
        } catch (err) {
          console.error(err)
          alert('पिनकोड लाने में दिक्कत आ रही है, बाद में फिर कोशिश करें।')
        } finally {
          setLocLoading(false)
        }
      },
      (error) => {
        console.error(error)
        alert('लोकेशन की अनुमति नहीं मिली या कोई समस्या हुई।')
        setLocLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    )
  }

  return (
    <header className="navbar">
      {/* LEFT: Logo + Brand + Pincode */}
      <div className="navbar-left">
        <div className="logo-wrapper">
          <img src={logo} alt="GraminSetu logo" className="logo-image" />
        </div>
        <div className="logo-text">
          <span className="logo-title">GraminSetu</span>
          <span className="logo-subtitle">गाँव से बाज़ार तक सेतु</span>
        </div>

        <button
          type="button"
          className="navbar-location"
          onClick={handleDetectLocation}
        >
          <span className="location-icon">📍</span>
          <span className="location-text">
            {locLoading ? 'लोकेशन ले रहे हैं…' : pinCode}
          </span>
        </button>
      </div>

      {/* CENTER: Nav links */}
      <nav className="navbar-links">
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>
        <NavLink to="/marketplace" className="nav-link">
          Bazaar
        </NavLink>
        <NavLink to="/machinery" className="nav-link">
          Machines
        </NavLink>
        <NavLink to="/labour" className="nav-link">
          Labour
        </NavLink>
        <NavLink to="/schemes" className="nav-link">
          Schemes
        </NavLink>
        <NavLink to="/knowledge" className="nav-link">
          Knowledge
        </NavLink>
        <NavLink to="/community" className="nav-link">
          Community
        </NavLink>
      </nav>

      {/* RIGHT: Cart + Language + Login/Logout */}
      <div className="navbar-right">
        {/* 🛒 CART BUTTON (before login) */}
        <button
          type="button"
          className="cart-button"
          onClick={() => navigate('/cart')}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-text">Cart</span>
          {/* future: yahan quantity badge aa sakta hai */}
        </button>

        <div className="lang-select">
          <select value={language} onChange={handleLanguageChange}>
            <option value="hi">हिन्दी</option>
            <option value="en">English</option>
          </select>
        </div>

        {!user ? (
          <button
            className="btn btn-small btn-outline login-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        ) : (
          <button
            className="btn btn-small btn-outline login-button"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
