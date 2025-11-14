import React, { useMemo, useState } from 'react'

const threads = [
  {
    id: 1,
    title: 'सोयाबीन में इस बार कौन सा बीज अच्छा चल रहा है?',
    type: 'प्रश्न',
    category: 'फसल',
    village: 'देवास',
    replies: 8,
    lastActivity: '2 घंटे पहले',
    pinned: true,
  },
  {
    id: 2,
    title: 'ट्रैक्टर किराये का रेट आपके गाँव में कितना है?',
    type: 'प्रश्न',
    category: 'मशीनरी',
    village: 'इंदौर',
    replies: 5,
    lastActivity: 'कल',
    pinned: false,
  },
  {
    id: 3,
    title: 'जैविक खाद से गेहूँ की पैदावार में 15% बढ़ोतरी हुई',
    type: 'अनुभव',
    category: 'जैविक',
    village: 'उज्जैन',
    replies: 3,
    lastActivity: '3 दिन पहले',
    pinned: false,
  },
  {
    id: 4,
    title: 'मज़दूर मिल नहीं रहे, आप लोग कैसे मैनेज कर रहे हैं?',
    type: 'चर्चा',
    category: 'मज़दूर',
    village: 'रतलाम',
    replies: 11,
    lastActivity: '1 घंटा पहले',
    pinned: false,
  },
]

const filters = [
  { key: 'ALL', label: 'सभी पोस्ट' },
  { key: 'प्रश्न', label: 'केवल प्रश्न' },
  { key: 'अनुभव', label: 'अनुभव / टिप्स' },
  { key: 'मेरा_इलाका', label: 'मेरे आसपास' },
]

function Community() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // future: yahan se user ke village ka pincode / location aa sakta hai
  const myVillage = 'इंदौर'

  const handleFilterClick = (key) => {
    setActiveFilter(key)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      let matchFilter = true

      if (activeFilter === 'प्रश्न') {
        matchFilter = t.type === 'प्रश्न'
      } else if (activeFilter === 'अनुभव') {
        matchFilter = t.type === 'अनुभव'
      } else if (activeFilter === 'मेरा_इलाका') {
        matchFilter = t.village === myVillage
      }

      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchFilter

      const haystack = `${t.title} ${t.category} ${t.village} ${t.type}`.toLowerCase()
      const matchSearch = haystack.includes(term)

      return matchFilter && matchSearch
    })
  }, [activeFilter, searchTerm, myVillage])

  return (
    <div className="page">
      {/* header */}
      <header className="page-header">
        <div>
          <h2>समुदाय चर्चा</h2>
          <p>अन्य किसानों से सवाल पूछें, अनुभव साझा करें और मदद लें</p>
        </div>
        <div className="page-header-actions">
          <input
            type="text"
            placeholder="सवाल या विषय खोजें…"
            className="input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary">नई पोस्ट लिखें</button>
        </div>
      </header>

      {/* filters */}
      <div className="chip-row">
        {filters.map((f) => (
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
        {filteredThreads.length} पोस्ट मिलीं
      </p>

      {/* list */}
      {filteredThreads.length === 0 ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: '#fff8e1',
            fontSize: '0.9rem',
          }}
        >
          अभी इस फ़िल्टर / खोज के लिए कोई पोस्ट नहीं है। आप चाहें तो{' '}
          <strong>नई पोस्ट लिखें</strong> बटन से पहला सवाल पूछ सकते हैं।
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredThreads.map((t) => (
            <div key={t.id} className="card community-card">
              {t.pinned && <span className="community-pill community-pill-pin">📌 पिन की गई</span>}

              <h3 className="community-title">{t.title}</h3>

              <div className="community-post-meta">
                <span className="community-tag">{t.category}</span>
                <span>गाँव: {t.village}</span>
                <span>{t.replies} जवाब</span>
                <span>{t.lastActivity}</span>
              </div>

              <div className="community-footer">
                <span className="community-type-pill">{t.type}</span>
                <button className="btn btn-small btn-outline">
                  चर्चा देखें
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Community
