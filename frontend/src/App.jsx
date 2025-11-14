import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Machinery from './pages/Machinery.jsx'
import Labour from './pages/Labour.jsx'
import Schemes from './pages/Schemes.jsx'
import KnowledgeHub from './pages/KnowledgeHub.jsx'
import Login from './pages/Login.jsx'
import Community from './pages/Community.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Register from './pages/Register.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Cart.jsx'

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/machinery" element={<Machinery />} />
          <Route path="/labour" element={<Labour />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/community" element={<Community />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} GraminSetu – गाँव से बाज़ार तक सेतु</p>
      </footer>
    </div>
  )
}

export default App
