import React, { useMemo, useState } from 'react'

const machines = [
  {
    id: 1,
    name: 'Tractor – 55 HP',
    type: 'ट्रैक्टर',
    price: '₹800 / घंटा',
    village: 'सीहोर',
    available: true,
    image:
      'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Rotavator – 6 Feet',
    type: 'रोटावेटर',
    price: '₹1200 / दिन',
    village: 'इंदौर',
    available: false,
    image:
      'https://images.pexels.com/photos/2804327/pexels-photo-2804327.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Thresher – Multi Crop',
    type: 'थ्रेशर',
    price: '₹2500 / दिन',
    village: 'खरगोन',
    available: true,
    image:
      'https://images.pexels.com/photos/2864328/pexels-photo-2864328.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

const machineCategories = [
  { key: 'ALL', label: 'सभी' },
  { key: 'ट्रैक्टर', label: 'ट्रैक्टर' },
  { key: 'रोटावेटर', label: 'रोटावेटर' },
  { key: 'थ्रेशर', label: 'थ्रेशर' },
]

function Machinery() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const handleCategoryClick = (key) => {
    setActiveCategory(key)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleToggleAvailable = () => {
    setOnlyAvailable((prev) => !prev)
  }

  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      const matchCategory =
        activeCategory === 'ALL' ? true : m.type === activeCategory

      const term = searchTerm.trim().toLowerCase()
      const haystack = `${m.name} ${m.village} ${m.type}`.toLowerCase()
      const matchSearch = term ? haystack.includes(term) : true

      const matchAvailability = onlyAvailable ? m.available : true

      return matchCategory && matchSearch && matchAvailability
    })
  }, [activeCategory, searchTerm, onlyAvailable])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>किराये पर मशीन</h2>
          <p>ट्रैक्टर, थ्रेशर, रोटावेटर – नज़दीकी गाँव से बुक करें</p>
        </div>
        <div className="page-header-actions">
          <input
            type="text"
            placeholder="ट्रैक्टर, थ्रेशर या गाँव का नाम खोजें…"
            className="input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="button"
            className={
              'btn btn-outline ' + (onlyAvailable ? 'btn-outline-active' : '')
            }
            onClick={handleToggleAvailable}
          >
            {onlyAvailable ? 'सभी दिखाएँ' : 'केवल आज उपलब्ध'}
          </button>
        </div>
      </header>

      {/* tabs for machine types */}
      <div className="chip-row">
        {machineCategories.map((cat) => (
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

      <p style={{ fontSize: '0.8rem', color: '#6d6d6d', marginTop: '0.25rem' }}>
        {filteredMachines.length} मशीनें मिलीं
      </p>

      {filteredMachines.length === 0 ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: '#fff8e1',
            fontSize: '0.9rem',
          }}
        >
          इस खोज / श्रेणी के लिए कोई मशीन नहीं मिली। कृपया दूसरा नाम या श्रेणी
          चुनें।
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredMachines.map((m) => (
            <div
              key={m.id}
              className="card card-machine card-machine-with-image"
            >
              <div className="card-machine-image-wrapper">
                <img
                  src={m.image}
                  alt={m.name}
                  className="card-machine-image"
                  loading="lazy"
                />
                <div className="card-machine-badge">
                  {m.available ? 'आज उपलब्ध' : 'बुक्ड'}
                </div>
              </div>

              <h3>{m.name}</h3>
              <p className="price">{m.price}</p>
              <p className="muted">गाँव: {m.village}</p>

              <button
                className="btn btn-small btn-primary"
                disabled={!m.available}
              >
                {m.available ? 'बुक करें' : 'अभी उपलब्ध नहीं'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Machinery
