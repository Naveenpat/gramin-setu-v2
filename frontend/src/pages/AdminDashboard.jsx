import React from 'react'

function AdminDashboard() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Admin Dashboard (Demo)</h2>
          <p>उदाहरण के लिए साधारण एडमिन व्यू – आप बाद में इसे बढ़ा सकते हैं</p>
        </div>
      </header>

      <div className="grid grid-4">
        <div className="stat-card">
          <span className="stat-label">कुल किसान</span>
          <span className="stat-value">1520</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Products</span>
          <span className="stat-value">845</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Machinery Rentals Today</span>
          <span className="stat-value">32</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Approvals</span>
          <span className="stat-value">8</span>
        </div>
      </div>

      <div className="card card-table">
        <h3>Recent Farmers</h3>
        <table>
          <thead>
            <tr>
              <th>नाम</th>
              <th>गाँव</th>
              <th>भूमिका</th>
              <th>स्थिति</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>रामू लाल</td>
              <td>देवास</td>
              <td>किसान</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>सीता बाई</td>
              <td>सीहोर</td>
              <td>किसान</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>मोहन सिंह</td>
              <td>उज्जैन</td>
              <td>Vendor</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
