import React from 'react'

const dummyProducts = [
  {
    id: 1,
    name: 'गेहूँ – शरबतिया',
    price: '₹2200 / क्विंटल',
    village: 'देवास',
    type: 'अनाज',
  },
  {
    id: 2,
    name: 'सोयाबीन – JS 95-60',
    price: '₹5200 / क्विंटल',
    village: 'उज्जैन',
    type: 'अनाज',
  },
  {
    id: 3,
    name: 'प्याज़ (लाल)',
    price: '₹18 / किलो',
    village: 'इंदौर',
    type: 'सब्ज़ी',
  },
  {
    id: 4,
    name: 'आलू',
    price: '₹12 / किलो',
    village: 'रतलाम',
    type: 'सब्ज़ी',
  },
]

function Marketplace() {
  return (
    <div className="page">
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
          />
          <button className="btn btn-outline">फ़िल्टर</button>
        </div>
      </header>

      <div className="chip-row">
        <button className="chip chip-active">सभी</button>
        <button className="chip">अनाज</button>
        <button className="chip">सब्ज़ी</button>
        <button className="chip">फल</button>
        <button className="chip">बीज</button>
        <button className="chip">खाद</button>
      </div>

      <div className="grid grid-4">
        {dummyProducts.map((p) => (
          <div key={p.id} className="card card-product">
            <div className="card-product-header">
              <span className="product-type">{p.type}</span>
            </div>
            <div className="card-product-body">
              <h3>{p.name}</h3>
              <p className="price">{p.price}</p>
              <p className="muted">गाँव: {p.village}</p>
            </div>
            <button className="btn btn-small btn-primary">किसान से बात करें</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace
