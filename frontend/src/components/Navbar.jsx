import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  const [language, setLanguage] = useState('hi')
  const navigate = useNavigate()

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
    // यहीं पर आगे चलकर i18n या भाषा switch logic जोड़ा जा सकता है
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-circle">🌾</div>
        <div className="logo-text">
          <span className="logo-title">GraminSetu</span>
          <span className="logo-subtitle">गाँव से बाज़ार तक सेतु</span>
        </div>
      </div>

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
      </nav>

      <div className="navbar-right">
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
