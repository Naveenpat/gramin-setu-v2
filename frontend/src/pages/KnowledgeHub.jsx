import React from 'react'

const topics = [
  {
    id: 1,
    title: 'सोयाबीन की अच्छी पैदावार के लिए 5 ज़रूरी बातें',
    type: 'लेख',
    category: 'फसल',
  },
  {
    id: 2,
    title: 'दूध का ठंडा चेन कैसे मैनेज करें',
    type: 'वीडियो',
    category: 'डेयरी',
  },
  {
    id: 3,
    title: 'जैविक खाद घर पर कैसे बनाएं',
    type: 'लेख',
    category: 'जैविक',
  },
]

function KnowledgeHub() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>ज्ञान केंद्र</h2>
          <p>खेती, डेयरी और जैविक कृषि पर सरल ज्ञान</p>
        </div>
      </header>

      <div className="chip-row">
        <button className="chip chip-active">सभी</button>
        <button className="chip">फसल</button>
        <button className="chip">डेयरी</button>
        <button className="chip">जैविक</button>
      </div>

      <div className="grid grid-3">
        {topics.map((t) => (
          <div key={t.id} className="card card-topic">
            <span className="badge badge-muted">{t.category}</span>
            <h3>{t.title}</h3>
            <span className="muted">{t.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KnowledgeHub
