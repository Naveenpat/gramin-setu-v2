import React, { useMemo, useState } from 'react'

const topics = [
  {
    id: 1,
    title: 'सोयाबीन की अच्छी पैदावार के लिए 5 ज़रूरी बातें',
    type: 'लेख',
    category: 'फसल',
    duration: '5 min पढ़ें',
    image:
      'https://images.pexels.com/photos/7731594/pexels-photo-7731594.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'दूध का ठंडा चेन कैसे मैनेज करें',
    type: 'वीडियो',
    category: 'डेयरी',
    duration: '8 min वीडियो',
    image:
      'https://images.pexels.com/photos/4911697/pexels-photo-4911697.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'जैविक खाद घर पर कैसे बनाएं',
    type: 'लेख',
    category: 'जैविक',
    duration: '6 min पढ़ें',
    image:
      'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

const topicFilters = [
  { key: 'ALL', label: 'सभी' },
  { key: 'फसल', label: 'फसल' },
  { key: 'डेयरी', label: 'डेयरी' },
  { key: 'जैविक', label: 'जैविक' },
]

function KnowledgeHub() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterClick = (key) => {
    setActiveFilter(key)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchFilter =
        activeFilter === 'ALL' ? true : t.category === activeFilter

      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchFilter

      const haystack = `${t.title} ${t.category} ${t.type}`.toLowerCase()
      const matchSearch = haystack.includes(term)

      return matchFilter && matchSearch
    })
  }, [activeFilter, searchTerm])

  const handleOpenTopic = (topic) => {
    // demo behaviour: baad me yahan detail page / video link aa sakta hai
    alert(
      `विषय: ${topic.title}\nकिस्म: ${topic.type}\n\n(यह demo UI है – आगे चलकर ispe detail page / video open kar sakte ho.)`,
    )
  }

  return (
    <div className="page">
      {/* header + search */}
      <header className="page-header">
        <div>
          <h2>ज्ञान केंद्र</h2>
          <p>खेती, डेयरी और जैविक कृषि पर सरल ज्ञान</p>
        </div>
        <div className="page-header-actions">
          <input
            type="text"
            placeholder="विषय या श्रेणी से खोजें…"
            className="input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      {/* filters */}
      <div className="chip-row">
        {topicFilters.map((f) => (
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
        {filteredTopics.length} विषय मिले
      </p>

      {/* grid */}
      {filteredTopics.length === 0 ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: '#fff8e1',
            fontSize: '0.9rem',
          }}
        >
          इस खोज / फ़िल्टर के लिए कोई विषय नहीं मिला। कृपया दूसरा नाम या फ़िल्टर
          चुनें।
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredTopics.map((t) => (
            <button
              key={t.id}
              className="card card-topic card-topic-with-image"
              type="button"
              onClick={() => handleOpenTopic(t)}
            >
              <div className="card-topic-image-wrapper">
                <img
                  src={t.image}
                  alt={t.title}
                  className="card-topic-image"
                  loading="lazy"
                />
                <div className="card-topic-type-pill">{t.type}</div>
              </div>

              <div className="card-topic-body">
                <span className="badge badge-muted">{t.category}</span>
                <h3>{t.title}</h3>
                <span className="muted">{t.duration}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default KnowledgeHub
