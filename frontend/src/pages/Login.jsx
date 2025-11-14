import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password.trim()) {
      setError('कृपया मोबाइल/ईमेल और पासवर्ड भरें')
      return
    }

    // Demo purpose: direct login without backend
    login({
      name: 'Demo Kisan',
      identifier,
    })
    navigate('/')
  }

  const handleCreateAccount = () => {
    alert('यह demo UI है – यहाँ आप बाद में signup page या flow जोड़ सकते हैं।')
  }

  const handleForgotPassword = () => {
    alert('यह demo UI है – यहाँ आप बाद में forgot password flow जोड़ सकते हैं।')
  }

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">
          मोबाइल नंबर या ईमेल से लॉगिन करें। आगे चलकर आप इसे backend से connect कर सकते हैं।
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span className="field-label">मोबाइल या ईमेल</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input full"
              placeholder="उदा: 98xxxxxxxx या naam@example.com"
            />
          </label>

          <label className="field">
            <span className="field-label">पासवर्ड</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input full"
              placeholder="आपका पासवर्ड"
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary full">
            Login
          </button>
        </form>

        <div className="auth-links">
          <button type="button" onClick={handleForgotPassword} className="link-button">
            पासवर्ड भूल गए?
          </button>
          <button type="button" onClick={handleCreateAccount} className="link-button">
            नया अकाउंट बनाएँ
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
