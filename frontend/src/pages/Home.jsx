import React from 'react'
import { Link } from 'react-router-dom'

const services = [
  {
    title: 'बाज़ार',
    subtitle: 'फसल और सामान खरीदें-बेचें',
    to: '/marketplace',
  },
  {
    title: 'मशीनरी',
    subtitle: 'ट्रैक्टर, थ्रेशर, पम्प किराये पर',
    to: '/machinery',
  },
  {
    title: 'मज़दूर',
    subtitle: 'काम के लिए मज़दूर ढूँढें',
    to: '/labour',
  },
  {
    title: 'योजनाएँ',
    subtitle: 'सरकारी योजना की जानकारी',
    to: '/schemes',
  },
  {
    title: 'डेयरी टिप्स',
    subtitle: 'दूध और डेयरी प्रोडक्ट्स',
    to: '/knowledge',
  },
  {
    title: 'माँगें',
    subtitle: 'अपनी ज़रूरत की माँग पोस्ट करें',
    to: '/marketplace',
  },
]

function Home() {
  return (
    <div className="page page-home">
      <section className="hero-banner">
        <div className="hero-banner-overlay">
          <div className="hero-banner-content">
            <p className="hero-kicker">नमस्ते! 🙏</p>
            <h1>आज क्या ढूँढना है?</h1>
            <p className="hero-subtitle">
              बीज, ट्रैक्टर, मज़दूर, खाद, मशीनरी – सब कुछ एक ही जगह GraminSetu पर।
            </p>
            <div className="hero-search-wrapper">
              <input
                className="hero-search-input"
                placeholder="बीज, ट्रैक्टर, मज़दूर..."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="services-grid">
        {services.map((s) => (
          <Link key={s.title} to={s.to} className="service-card">
            <h3>{s.title}</h3>
            <p>{s.subtitle}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}

export default Home
