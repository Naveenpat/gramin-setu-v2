import React from 'react'

const schemes = [
  {
    id: 1,
    name: 'प्रधान मंत्री किसान सम्मान निधि (PM-KISAN)',
    type: 'केंद्रीय योजना',
    summary: 'प्रति वर्ष ₹6000 की आर्थिक सहायता सीधे किसान के खाते में।',
  },
  {
    id: 2,
    name: 'मुख्यमंत्री किसान कल्याण योजना',
    type: 'राज्य योजना',
    summary: 'अतिरिक्त सहायता राज्य सरकार द्वारा पीएम किसान के साथ।',
  },
  {
    id: 3,
    name: 'फसल बीमा योजना',
    type: 'केंद्रीय योजना',
    summary: 'प्राकृतिक आपदा से फसल नुकसान पर बीमा सहायता।',
  },
]

function Schemes() {
  return (
    <div className="page">
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
          />
        </div>
      </header>

      <div className="grid grid-2">
        {schemes.map((s) => (
          <div key={s.id} className="card card-scheme">
            <div className="scheme-tag">{s.type}</div>
            <h3>{s.name}</h3>
            <p>{s.summary}</p>
            <button className="btn btn-small btn-outline">अधिक जानें</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Schemes
