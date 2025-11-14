import React, { useMemo, useState } from 'react'

const jobs = [
  {
    id: 1,
    title: 'निराई – 2 दिन',
    wage: '₹350 / दिन',
    village: 'देवास',
    status: 'Open',
  },
  {
    id: 2,
    title: 'कटाई – 3 दिन',
    wage: '₹400 / दिन',
    village: 'उज्जैन',
    status: 'Open',
  },
  {
    id: 3,
    title: 'बोरवेल के पास सफ़ाई',
    wage: '₹300 / दिन',
    village: 'इंदौर',
    status: 'Closed',
  },
]

const jobFilters = [
  { key: 'ALL', label: 'सभी काम' },
  { key: 'OPEN', label: 'केवल खुले काम' },
  { key: 'CLOSED', label: 'पूरा हो चुका' },
]

function Labour() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterClick = (key) => {
    setActiveFilter(key)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // filter by status
      let matchStatus = true
      if (activeFilter === 'OPEN') matchStatus = j.status === 'Open'
      if (activeFilter === 'CLOSED') matchStatus = j.status !== 'Open'

      // search
      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchStatus

      const haystack = `${j.title} ${j.village} ${j.status}`.toLowerCase()
      const matchSearch = haystack.includes(term)

      return matchStatus && matchSearch
    })
  }, [activeFilter, searchTerm])

  return (
    <div className="page">
      {/* header + search + post button */}
      <header className="page-header">
        <div>
          <h2>मज़दूर सेवा</h2>
          <p>काम के लिए मज़दूर ढूँढें या अपना काम ढूँढें</p>
        </div>
        <div className="page-header-actions">
          <input
            type="text"
            placeholder="काम या गाँव का नाम खोजें…"
            className="input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary">नया काम पोस्ट करें</button>
        </div>
      </header>

      {/* tabs / filters */}
      <div className="chip-row">
        {jobFilters.map((f) => (
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
        {filteredJobs.length} काम मिले
      </p>

      {/* jobs grid */}
      {filteredJobs.length === 0 ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: '#fff8e1',
            fontSize: '0.9rem',
          }}
        >
          इस खोज / फ़िल्टर के लिए कोई काम नहीं मिला। कृपया दूसरा नाम या फ़िल्टर
          चुनें।
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredJobs.map((j) => (
            <div key={j.id} className="card card-job">
              <h3>{j.title}</h3>
              <p className="price">{j.wage}</p>
              <p className="muted">गाँव: {j.village}</p>
              <span
                className={`badge ${
                  j.status === 'Open' ? 'badge-success' : 'badge-muted'
                }`}
              >
                {j.status === 'Open' ? 'खुला है' : 'पूरा हो चुका'}
              </span>
              <button
                className="btn btn-small btn-outline"
                disabled={j.status !== 'Open'}
              >
                संपर्क करें
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Labour
