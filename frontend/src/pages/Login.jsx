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

    // ⚠️ Demo purpose: direct login without backend
    login({
      name: 'Demo Kisan',
      identifier,
    })
    navigate('/')
  }

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <h2>लॉगिन</h2>
        <p className="auth-subtitle">
          GraminSetu पर अपने अकाउंट से लॉगिन करें। (यह अभी demo UI है, आगे चलकर
          backend से जुड़ सकता है।)
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span className="field-label">मोबाइल नंबर या ईमेल</span>
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
            लॉगिन करें
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="link-button"
          >
            पासवर्ड भूल गए?
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
          >
            नया अकाउंट बनाएँ
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
