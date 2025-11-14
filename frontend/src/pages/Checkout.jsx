import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const demoItems = [
  {
    id: 1,
    name: 'गेहूँ – शरबतिया (50kg बोरी)',
    price: 1200,
    qty: 1,
  },
  {
    id: 2,
    name: 'सोयाबीन – JS 95-60 (50kg)',
    price: 2600,
    qty: 2,
  },
]

const shippingCharge = 80

function Checkout() {
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState('cod')

  const subtotal = demoItems.reduce(
    (sum, it) => sum + it.price * it.qty,
    0
  )
  const total = subtotal + shippingCharge

  const handlePlaceOrder = () => {
    alert(
      `Demo: आपका ऑर्डर सफलतापूर्वक प्लेस हो गया!\nपेमेंट मोड: ${
        selectedPayment === 'cod'
          ? 'कैश ऑन डिलीवरी'
          : selectedPayment.toUpperCase()
      }`
    )
    navigate('/')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Checkout</h2>
          <p>पता देखें, पेमेंट मोड चुनें और ऑर्डर कन्फर्म करें</p>
        </div>
      </header>

      {/* small step indicator */}
      <div className="checkout-steps">
        <div className="checkout-step checkout-step-active">
          <span>1</span>
          <p>कार्ट</p>
        </div>
        <div className="checkout-step checkout-step-active">
          <span>2</span>
          <p>पता</p>
        </div>
        <div className="checkout-step checkout-step-active">
          <span>3</span>
          <p>पेमेंट</p>
        </div>
      </div>

      <div className="checkout-layout">
        {/* LEFT: address + payment methods */}
        <div className="checkout-main">
          {/* Address block */}
          <div className="card checkout-card">
            <div className="checkout-card-header">
              <h3>डिलीवरी पता</h3>
              <button
                type="button"
                className="link-button"
                onClick={() =>
                  alert('Demo: यहाँ पर आप पता बदलने का flow जोड़ सकते हैं।')
                }
              >
                बदलें
              </button>
            </div>
            <div className="checkout-address">
              <strong>रामलाल पाटीदार</strong>
              <span>मोबाइल: 98xxxxxx45</span>
              <span>ग्राम: देवास, तहसील: सोनकच्छ</span>
              <span>ज़िला: देवास, मध्य प्रदेश - 455001</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="card checkout-card">
            <h3>पेमेंट तरीका चुनें</h3>

            <div className="payment-methods">
              <label className="payment-method-card">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={selectedPayment === 'upi'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div>
                  <strong>UPI (PhonePe, GPay, Paytm)</strong>
                  <p>तेज़ और सुरक्षित ऑनलाइन पेमेंट</p>
                </div>
              </label>

              <label className="payment-method-card">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPayment === 'card'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div>
                  <strong>डेबिट / क्रेडिट कार्ड</strong>
                  <p>Visa, MasterCard, Rupay</p>
                </div>
              </label>

              <label className="payment-method-card">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === 'cod'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div>
                  <strong>कैश ऑन डिलीवरी (COD)</strong>
                  <p>डिलीवरी पर नकद भुगतान</p>
                </div>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary full"
              onClick={handlePlaceOrder}
            >
              अभी ऑर्डर कन्फर्म करें (Demo)
            </button>

            <p className="checkout-note">
              यह पूरा flow demo है। आगे चलकर आप यहाँ पेमेंट गेटवे (Razorpay /
              PhonePe इत्यादि) connect कर सकते हैं।
            </p>
          </div>
        </div>

        {/* RIGHT: order summary */}
        <aside className="checkout-summary">
          <div className="card cart-summary-card">
            <h3>ऑर्डर सारांश</h3>
            <div className="checkout-items-list">
              {demoItems.map((it) => (
                <div key={it.id} className="checkout-item-row">
                  <div>
                    <div className="checkout-item-name">{it.name}</div>
                    <div className="muted">
                      Qty: {it.qty} × ₹{it.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    ₹{(it.price * it.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-row">
              <span>उप-योग</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row">
              <span>डिलीवरी चार्ज</span>
              <span>₹{shippingCharge.toLocaleString('en-IN')}</span>
            </div>
            <hr />
            <div className="cart-summary-row cart-summary-total">
              <span>कुल भुगतान</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
