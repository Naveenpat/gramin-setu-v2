import React, { useMemo, useState } from 'react'

const schemes = [
  {
    id: 1,
    name: 'प्रधान मंत्री किसान सम्मान निधि (PM-KISAN)',
    type: 'केंद्रीय योजना',
    category: 'आय सहायता',
    summary: 'प्रति वर्ष ₹6000 की आर्थिक सहायता सीधे किसान के खाते में।',
    image:
      'https://images.pexels.com/photos/5185306/pexels-photo-5185306.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'मुख्यमंत्री किसान कल्याण योजना',
    type: 'राज्य योजना',
    category: 'आय सहायता',
    summary: 'अतिरिक्त सहायता राज्य सरकार द्वारा पीएम किसान के साथ।',
    image:
      'https://images.pexels.com/photos/6729165/pexels-photo-6729165.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'फसल बीमा योजना',
    type: 'केंद्रीय योजना',
    category: 'बीमा',
    summary: 'प्राकृतिक आपदा से फसल नुकसान पर बीमा सहायता।',
    image:
      'https://images.pexels.com/photos/175389/pexels-photo-175389.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

const schemeFilters = [
  { key: 'ALL', label: 'सभी योजनाएँ' },
  { key: 'केंद्रीय योजना', label: 'केंद्रीय योजनाएँ' },
  { key: 'राज्य योजना', label: 'राज्य योजनाएँ' },
]

function Schemes() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterClick = (key) => {
    setActiveFilter(key)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchFilter =
        activeFilter === 'ALL' ? true : s.type === activeFilter

      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchFilter

      const haystack = `${s.name} ${s.type} ${s.category}`.toLowerCase()
      const matchSearch = haystack.includes(term)

      return matchFilter && matchSearch
    })
  }, [activeFilter, searchTerm])

  const handleMoreClick = (scheme) => {
    // abhi ke liye sirf demo alert, baad me yahan detail page / modal open kar sakte ho
    alert(`योजना: ${scheme.name}\n\n(यह demo UI है – आगे चलकर yahan detail page / link aa sakta hai.)`)
  }

  return (
    <div className="page">
      {/* header + search */}
      <header className="page-header">
        <div>
          <h2>सरकारी योजनाएँ</h2>
          <p>किसान के लिए उपलब्ध योजनाएँ – सरल भाषा में समझें</p>
        </div>
        <div className="page-header-actions">
          <input
            type="text"
            placeholder="योजना या फसल टाइप से खोजें…"
            className="input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      {/* filters as chips */}
      <div className="chip-row">
        {schemeFilters.map((f) => (
          <button
            key={f.key}
            className={
              'chip ' + (activeFilter === f.key ? 'chip-active' : '')
            }
            onClick={() => handleFilterClick(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '0.8rem', color: '#6d6d6d', marginTop: '0.25rem' }}>
        {filteredSchemes.length} योजनाएँ मिलीं
      </p>

      {/* grid */}
      {filteredSchemes.length === 0 ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: '#fff8e1',
            fontSize: '0.9rem',
          }}
        >
          इस खोज / फ़िल्टर के लिए कोई योजना नहीं मिली। कृपया दूसरा नाम या फ़िल्टर
          चुनें।
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredSchemes.map((s) => (
            <div
              key={s.id}
              className="card card-scheme card-scheme-with-image"
            >
              <div className="card-scheme-image-wrapper">
                <img
                  src={s.image}
                  alt={s.name}
                  className="card-scheme-image"
                  loading="lazy"
                />
                <div className="scheme-type-chip">{s.type}</div>
              </div>

              <div className="card-scheme-body">
                <h3>{s.name}</h3>
                <span className="scheme-category">{s.category}</span>
                <p>{s.summary}</p>
              </div>

              <button
                className="btn btn-small btn-outline"
                onClick={() => handleMoreClick(s)}
              >
                अधिक जानें
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Schemes
