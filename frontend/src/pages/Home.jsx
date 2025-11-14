import React from 'react'
import { Link } from 'react-router-dom'

const services = [
  {
    title: 'बाज़ार',
    icon: '🛍️',
    to: '/marketplace',
  },
  {
    title: 'मशीनरी',
    icon: '🚜',
    to: '/machinery',
  },
  {
    title: 'मज़दूर',
    icon: '👷‍♂️',
    to: '/labour',
  },
  {
    title: 'योजनाएँ',
    icon: '📄',
    to: '/schemes',
  },
  {
    title: 'डेयरी टिप्स',
    icon: '🥛',
    to: '/knowledge',
  },
  {
    title: 'माँगें',
    icon: '➕',
    to: '/marketplace',
  },
  {
    title: 'समुदाय',
    icon: '➕',
    to: '/community',
  },
]


const featuredProducts = [
  {
    id: 1,
    name: 'हरी चारा – ताज़ा',
    price: '₹2,500',
    unit: 'प्रति ट्रॉली',
    village: 'देवास',
    badge: 'ताज़ा',
  },
  {
    id: 2,
    name: 'ताज़ा टमाटर – 10 किलो',
    price: '₹450',
    unit: '',
    village: 'इंदौर',
    badge: 'लोकप्रिय',
  },
  {
    id: 3,
    name: 'देसी गेहूँ – आटा',
    price: '₹800',
    unit: 'प्रति 10 किलो',
    village: 'उज्जैन',
    badge: 'देसी',
  },
  {
    id: 4,
    name: 'खेत की ताज़ी फ़सल',
    price: '₹1,200',
    unit: 'से शुरू',
    village: 'सीहोर',
    badge: 'सीधा खेत से',
  },
]

const machineryPreview = [
  {
    id: 1,
    name: 'Tractor – 55 HP',
    price: '₹800 / घंटा',
    village: 'देवास',
  },
  {
    id: 2,
    name: 'Rotavator – 6 Feet',
    price: '₹1,200 / दिन',
    village: 'इंदौर',
  },
  {
    id: 3,
    name: 'Thresher – Multi Crop',
    price: '₹2,500 / दिन',
    village: 'खरगोन',
  },
]

const labourPreview = [
  {
    id: 1,
    title: 'निराई – 2 दिन',
    wage: '₹350 / दिन',
    village: 'देवास',
  },
  {
    id: 2,
    title: 'कटाई – 3 दिन',
    wage: '₹400 / दिन',
    village: 'उज्जैन',
  },
  {
    id: 3,
    title: 'डेयरी में काम – फुल टाइम',
    wage: '₹9,000 / महीना',
    village: 'इंदौर',
  },
]

function Home() {
  return (
    <div className="page page-home">
      {/* 🔹 Top banner */}
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

            <div className="home-metrics">
              <div className="home-metrics-item">
                <strong>1500+</strong>
                <span>किसान जुड़े</span>
              </div>
              <div className="home-metrics-item">
                <strong>800+</strong>
                <span>प्रोडक्ट लिस्टेड</span>
              </div>
              <div className="home-metrics-item">
                <strong>130+</strong>
                <span>मशीनरी किराये पर</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 🔹 Quick services (chips style) */}
      <section className="services-grid">
        {services.map((s, index) => (
          <Link
            key={s.title}
            to={s.to}
            className={`service-card-2 ${index % 2 === 0 ? 'bg-green-soft' : 'bg-cream-soft'
              }`}
          >
            <div className="service-icon">{s.icon}</div>
            <div className="service-text">
              <h3>{s.title}</h3>
              {/* subtitle optional */}
            </div>
          </Link>
        ))}
      </section>


      {/* 🔹 How it works strip */}
      <section className="home-strip">
        <div className="home-strip-step">
          <span className="home-strip-emoji">🔍</span>
          <div>
            <h4>1. खोजें</h4>
            <p>अपनी ज़रूरत के हिसाब से फसल, मशीन, मज़दूर या योजना ढूँढें।</p>
          </div>
        </div>
        <div className="home-strip-step">
          <span className="home-strip-emoji">🤝</span>
          <div>
            <h4>2. सीधे जुड़ें</h4>
            <p>सीधे किसान, मशीन मालिक या मज़दूर से बात करें – बिना बिचौलिये।</p>
          </div>
        </div>
        <div className="home-strip-step">
          <span className="home-strip-emoji">✅</span>
          <div>
            <h4>3. सौदा पक्का</h4>
            <p>दर तय करें, बुकिंग करें और काम आराम से पूरा करें।</p>
          </div>
        </div>
      </section>

      {/* 🔹 Featured products */}
      <section className="home-section">
        <header className="page-header">
          <div>
            <h2>ताज़ी फसलें और उत्पाद</h2>
            <p>सीधे खेत से – बिना किसी बिचौलिये के</p>
          </div>
          <div>
            <Link to="/marketplace" className="nav-link">
              सब देखें →
            </Link>
          </div>
        </header>

        <div className="grid grid-4">
          {featuredProducts.map((p) => (
            <div key={p.id} className="card card-product">
              <div className="card-product-header">
                <span className="product-type">{p.badge}</span>
              </div>
              <div className="card-product-body">
                <h3>{p.name}</h3>
                <p className="price">
                  {p.price}
                  {p.unit && (
                    <span style={{ fontSize: '0.8rem', marginLeft: 4 }}>{p.unit}</span>
                  )}
                </p>
                <p className="muted">गाँव: {p.village}</p>
              </div>
              <button className="btn btn-small btn-primary">
                किसान से संपर्क करें
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Machinery highlight */}
      <section className="home-section">
        <header className="page-header">
          <div>
            <h2>मशीनरी किराये पर</h2>
            <p>अपने खेत के लिए सही मशीन – सही समय पर</p>
          </div>
          <div>
            <Link to="/machinery" className="nav-link">
              सारी मशीनें देखें →
            </Link>
          </div>
        </header>

        <div className="grid grid-3">
          {machineryPreview.map((m) => (
            <div key={m.id} className="card card-machine">
              <h3>{m.name}</h3>
              <p className="price">{m.price}</p>
              <p className="muted">गाँव: {m.village}</p>
              <button className="btn btn-small btn-outline">डिटेल देखें</button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Labour highlight */}
      <section className="home-section">
        <header className="page-header">
          <div>
            <h2>मज़दूर सेवा</h2>
            <p>काम दिलाने और काम पाने – दोनों के लिए एक ही जगह</p>
          </div>
          <div>
            <Link to="/labour" className="nav-link">
              सभी काम देखें →
            </Link>
          </div>
        </header>

        <div className="grid grid-3">
          {labourPreview.map((j) => (
            <div key={j.id} className="card card-job">
              <h3>{j.title}</h3>
              <p className="price">{j.wage}</p>
              <p className="muted">गाँव: {j.village}</p>
              <button className="btn btn-small btn-outline">संपर्क करें</button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Schemes + Knowledge teaser */}
      <section className="home-info-panels">
        <div className="card home-info-card">
          <h3>सरकारी योजनाएँ</h3>
          <p>
            किसान के लिए लाभदायक योजनाएँ – सरल भाषा में समझें, किसको क्या फायदा
            मिलेगा।
          </p>
          <ul>
            <li>PM-KISAN, फसल बीमा आदि</li>
            <li>राज्य और केंद्र दोनों योजनाएँ</li>
            <li>कौन पात्र है, कैसे आवेदन करें</li>
          </ul>
          <Link to="/schemes" className="btn btn-small btn-primary">
            योजनाएँ देखें
          </Link>
        </div>

        <div className="card home-info-card">
          <h3>ज्ञान केंद्र</h3>
          <p>
            फसल, डेयरी और जैविक खेती पर छोटे-छोटे लेख और वीडियो, जो सीधे खेत में काम आएँ।
          </p>
          <ul>
            <li>अच्छी पैदावार के टिप्स</li>
            <li>दूध और डेयरी प्रोडक्ट्स मैनेजमेंट</li>
            <li>जैविक खाद और कीट प्रबंधन</li>
          </ul>
          <Link to="/knowledge" className="btn btn-small btn-outline">
            ज्ञान देखें
          </Link>
        </div>
      </section>

      {/* 🔹 Bottom trust banner */}
      <section className="home-bottom-cta">
        <div className="home-bottom-left">
          <h2>GraminSetu – गाँव और बाज़ार के बीच सच्चा सेतु</h2>
          <p>
            हमारा लक्ष्य है कि किसान को सही दाम, सही जानकारी और सही समय पर मज़दूर /
            मशीनरी मिल सके। आप भी जुड़ें और अपने गाँव का डिजिटल बाज़ार बनाएँ।
          </p>
        </div>
        <div className="home-bottom-right">
          <div>
            <strong>1500+</strong>
            <span>किसान जुड़े</span>
          </div>
          <div>
            <strong>800+</strong>
            <span>प्रोडक्ट लिस्टेड</span>
          </div>
          <div>
            <strong>130+</strong>
            <span>मशीनरी किराये पर</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
