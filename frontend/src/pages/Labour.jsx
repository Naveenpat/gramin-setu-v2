import React from 'react'

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

function Labour() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>मज़दूर सेवा</h2>
          <p>काम के लिए मज़दूर ढूँढें या अपना काम ढूँढें</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary">नया काम पोस्ट करें</button>
        </div>
      </header>

      <div className="grid grid-3">
        {jobs.map((j) => (
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
    </div>
  )
}

export default Labour
