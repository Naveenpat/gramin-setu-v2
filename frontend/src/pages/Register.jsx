import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !identifier.trim() || !password.trim()) {
      setError('कृपया सभी ज़रूरी जानकारी भरें')
      return
    }

    if (password.length < 4) {
      setError('पासवर्ड कम से कम 4 अक्षर का होना चाहिए')
      return
    }

    if (password !== confirmPassword) {
      setError('पासवर्ड और कन्फर्म पासवर्ड मैच नहीं कर रहे')
      return
    }

    // ⚠️ Demo: अभी हम backend नहीं लगा रहे। सीधे लॉगिन करा रहे हैं।
    login({
      name,
      identifier,
    })

    navigate('/')
  }

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <h2>नया अकाउंट बनाएँ</h2>
        <p className="auth-subtitle">
          कुछ बेसिक जानकारी भर कर GraminSetu से जुड़ें। (अभी demo है – आगे चलकर
          backend और OTP जोड़ा जा सकता है।)
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span className="field-label">पूरा नाम</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input full"
              placeholder="उदा: रामलाल पाटीदार"
            />
          </label>

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
              placeholder="कम से कम 4 अक्षर"
            />
          </label>

          <label className="field">
            <span className="field-label">कन्फर्म पासवर्ड</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input full"
              placeholder="पासवर्ड दोबारा लिखें"
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary full">
            अकाउंट बनाएँ
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="link-button"
          >
            पहले से अकाउंट है? लॉगिन करें
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
