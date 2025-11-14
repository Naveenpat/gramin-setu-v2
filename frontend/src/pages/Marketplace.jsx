import React, { useMemo, useState } from 'react'

const dummyProducts = [
  {
    id: 1,
    name: 'गेहूँ – शरबतिया',
    price: '₹2200 / क्विंटल',
    village: 'देवास',
    type: 'अनाज',
    image:
      'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'सोयाबीन – JS 95-60',
    price: '₹5200 / क्विंटल',
    village: 'उज्जैन',
    type: 'अनाज',
    image:
      'https://images.pexels.com/photos/9135/food-peas-beans-soya.jpg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'प्याज़ (लाल)',
    price: '₹18 / किलो',
    village: 'इंदौर',
    type: 'सब्ज़ी',
    image:
      'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    name: 'आलू',
    price: '₹12 / किलो',
    village: 'रतलाम',
    type: 'सब्ज़ी',
    image:
      'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

const categories = [
  { key: 'ALL', label: 'सभी' },
  { key: 'अनाज', label: 'अनाज' },
  { key: 'सब्ज़ी', label: 'सब्ज़ी' },
  { key: 'फल', label: 'फल' },
  { key: 'बीज', label: 'बीज' },
  { key: 'खाद', label: 'खाद' },
]

function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const handleCategoryClick = (key) => {
    setActiveCategory(key)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // filter logic
  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((p) => {
      const matchCategory =
        activeCategory === 'ALL' ? true : p.type === activeCategory

      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchCategory

      const haystack = `${p.name} ${p.village} ${p.type}`.toLowerCase()
      const matchSearch = haystack.includes(term)

      return matchCategory && matchSearch
    })
  }, [activeCategory, searchTerm])

  return (
    <div className="page">
      {/* Header + search */}
      <header className="page-header">
        <div>
          <h2>कृषि बाज़ार</h2>
          <p>सीधे किसान से खरीदे – ताज़ा और सच्ची जानकारी के साथ</p>
        </div>
        <div className="page-header-actions">
          <input
            type="text"
            placeholder="बीज, खाद या फसल का नाम खोजें…"
            className="input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline">फ़िल्टर</button>
        </div>
      </header>

      {/* Tabs / chips */}
      <div className="chip-row">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={
              'chip ' + (activeCategory === cat.key ? 'chip-active' : '')
            }
            onClick={() => handleCategoryClick(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p style={{ fontSize: '0.8rem', color: '#6d6d6d', marginTop: '0.25rem' }}>
        {filteredProducts.length} प्रोडक्ट मिले
      </p>

      {/* Cards grid */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: '#fff8e1',
            fontSize: '0.9rem',
          }}
        >
          इस खोज / श्रेणी के लिए कोई प्रोडक्ट नहीं मिला। कृपया दूसरा नाम या श्रेणी
          चुनें।
        </div>
      ) : (
        <div className="grid grid-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="card card-product card-product-with-image"
            >
              <div className="card-product-image-wrapper">
                <img
                  src={p.image}
                  alt={p.name}
                  className="card-product-image"
                  loading="lazy"
                />
                <div className="card-product-price-chip">{p.price}</div>
              </div>

              <div className="card-product-header">
                <span className="product-type">{p.type}</span>
              </div>

              <div className="card-product-body">
                <h3>{p.name}</h3>
                <p className="muted">गाँव: {p.village}</p>
              </div>

              <button className="btn btn-small btn-primary">
                किसान से बात करें
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Marketplace
