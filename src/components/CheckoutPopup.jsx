import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const onConfirmOrder = () => {
    setIsOrderPlaced(true);
    setTimeout(() => {
      handleCheckout();
      setIsOrderPlaced(false);
    }, 2400);
  };

  const handleModalHide = () => {
    setIsOrderPlaced(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalHide} centered size="lg">
      <Modal.Header closeButton style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Modal.Title style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
          {isOrderPlaced ? "Order Confirmation" : "Complete Your Checkout"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "1.75rem" }}>
        {isOrderPlaced ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "var(--status-success-bg)",
                color: "var(--status-success)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <i className="bi bi-check-lg"></i>
            </div>
            <h3 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Order Placed Successfully! 🎉</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
              Thank you for your purchase from <strong>CAMPER Store</strong>. Your order is being processed for dispatch.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Order Items Summary */}
            <div>
              <h6 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.06em" }}>
                Order Summary ({cartItems.length} items)
              </h6>
              <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--surface-soft)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)" }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", fontSize: "0.95rem" }}>{item.name}</strong>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Qty: {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h6 style={{ fontWeight: 700, marginBottom: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.06em" }}>
                Select Payment Method
              </h6>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                {[
                  { id: "card", label: "Credit Card", icon: "bi-credit-card-fill" },
                  { id: "upi", label: "UPI / QR", icon: "bi-qr-code-scan" },
                  { id: "cod", label: "Cash on Delivery", icon: "bi-cash-stack" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    style={{
                      border: paymentMethod === method.id ? "2px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                      background: paymentMethod === method.id ? "var(--accent-soft)" : "var(--surface-soft)",
                      color: paymentMethod === method.id ? "var(--accent-primary)" : "var(--text-primary)",
                      padding: "0.85rem 0.5rem",
                      borderRadius: "var(--radius-md)",
                      fontWeight: 600,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.35rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <i className={`bi ${method.icon}`} style={{ fontSize: "1.35rem" }}></i>
                    <span style={{ fontSize: "0.85rem" }}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Total Breakdown */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Total Amount Payable</span>
              <strong style={{ fontSize: "1.75rem", fontFamily: "var(--font-heading)", color: "var(--accent-primary)" }}>₹{totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        )}
      </Modal.Body>

      {!isOrderPlaced && (
        <Modal.Footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "1rem 1.75rem" }}>
          <Button variant="outline-secondary" onClick={handleModalHide} style={{ borderRadius: "var(--radius-pill)" }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirmOrder} style={{ borderRadius: "var(--radius-pill)", padding: "0.6rem 1.75rem", fontWeight: 700 }}>
            Pay & Confirm Order
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CheckoutPopup;

