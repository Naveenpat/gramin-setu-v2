import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!identifier.trim()) {
      setError('कृपया मोबाइल नंबर या ईमेल भरें')
      return
    }

    // ⚠️ Demo: यहाँ future में API call आएगी
    setMessage(
      'अगर यह मोबाइल/ईमेल हमारे रिकॉर्ड में होगा तो हम पासवर्ड रीसेट लिंक/OTP भेजेंगे। (अभी यह सिर्फ demo संदेश है)',
    )
  }

  return (
    <div className="page page-auth">
      <div className="auth-card">
        <h2>पासवर्ड भूल गए?</h2>
        <p className="auth-subtitle">
          अपना मोबाइल नंबर या ईमेल डालें। आगे चलकर यहाँ से आपको OTP / reset link
          भेजा जा सकेगा।
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

          {error && <div className="auth-error">{error}</div>}
          {message && (
            <div
              style={{
                marginTop: '0.25rem',
                fontSize: '0.8rem',
                color: '#2e7d32',
              }}
            >
              {message}
            </div>
          )}

          <button type="submit" className="btn btn-primary full">
            रीसेट लिंक/OTP भेजें (Demo)
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="link-button"
          >
            वापस लॉगिन पर जाएँ
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
