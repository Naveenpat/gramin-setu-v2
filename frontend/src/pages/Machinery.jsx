import React from 'react'

const machines = [
  {
    id: 1,
    name: 'Tractor – 55 HP',
    price: '₹800 / घंटा',
    village: 'सीहोर',
    available: true,
  },
  {
    id: 2,
    name: 'Rotavator – 6 Feet',
    price: '₹1200 / दिन',
    village: 'इंदौर',
    available: false,
  },
  {
    id: 3,
    name: 'Thresher – Multi Crop',
    price: '₹2500 / दिन',
    village: 'खरगोन',
    available: true,
  },
]

function Machinery() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>किराये पर मशीन</h2>
          <p>ट्रैक्टर, थ्रेशर, रोटावेटर – नज़दीकी गाँव से बुक करें</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline">केवल मेरे पास</button>
        </div>
      </header>

      <div className="grid grid-3">
        {machines.map((m) => (
          <div key={m.id} className="card card-machine">
            <h3>{m.name}</h3>
            <p className="price">{m.price}</p>
            <p className="muted">गाँव: {m.village}</p>
            <span
              className={`badge ${
                m.available ? 'badge-success' : 'badge-danger'
              }`}
            >
              {m.available ? 'आज उपलब्ध' : 'बुक्ड'}
            </span>
            <button className="btn btn-small btn-primary" disabled={!m.available}>
              {m.available ? 'बुक करें' : 'अभी उपलब्ध नहीं'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Machinery
