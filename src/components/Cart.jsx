import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const loadCartImages = async () => {
      if (!cart || cart.length === 0) {
        setCartItems([]);
        return;
      }

      setLoading(true);
      setFetchError("");

      try {
        const loadedItems = await Promise.all(
          cart.map(async (item) => {
            let imageUrl = "https://via.placeholder.com/260x260?text=No+Image";

            if (item.id) {
              try {
                const response = await axios.get(
                  `http://localhost:8080/api/product/${item.id}/image`,
                  { responseType: "blob" }
                );
                imageUrl = URL.createObjectURL(response.data);
              } catch (error) {
                console.warn("Unable to load image for cart item", item.id, error);
              }
            }

            return { ...item, imageUrl };
          })
        );

        setCartItems(loadedItems);
      } catch (error) {
        setFetchError("Unable to load cart items. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadCartImages();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const updateQuantity = (itemId, delta) => {
    if (updateCartQuantity) {
      updateCartQuantity(itemId, delta);
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    clearCart();
    setCartItems([]);
    setShowModal(false);
  };

  return (
    <section className="shopping-cart">
      <div className="title-row">
        <div>
          <h1>Shopping Bag</h1>
          <p>Review your order, update quantities, or clear your cart before checkout.</p>
        </div>
        <Button
          variant="outline-secondary"
          className="clear-cart-btn"
          onClick={() => {
            clearCart();
            setCartItems([]);
          }}
          disabled={cartItems.length === 0}
        >
          Clear cart
        </Button>
      </div>

      {loading && (
        <div className="empty" style={{ textAlign: "center", padding: "2rem" }}>
          <h4>Loading cart...</h4>
        </div>
      )}

      {fetchError && !loading && (
        <div className="empty" style={{ textAlign: "center", padding: "2rem" }}>
          <h4>{fetchError}</h4>
        </div>
      )}

      {!loading && cartItems.length === 0 && !fetchError ? (
        <div className="empty" style={{ textAlign: "center", padding: "2rem" }}>
          <h4>Your cart is empty</h4>
          <p>Browse products and add your favorites to start shopping.</p>
        </div>
      ) : (
        !loading && !fetchError && (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="item">
                    <div className="cart-image-wrapper">
                      <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                    </div>

                    <div className="description">
                      <span>{item.brand}</span>
                      <strong>{item.name}</strong>
                      <span className="item-price">₹{item.price}</span>
                    </div>

                    <div className="quantity">
                      <button className="quantity-btn" type="button" onClick={() => updateQuantity(item.id, 1)}>
                        <i className="bi bi-plus-lg"></i>
                      </button>
                      <div className="quantity-value">{item.quantity}</div>
                      <button className="quantity-btn" type="button" onClick={() => updateQuantity(item.id, -1)}>
                        <i className="bi bi-dash-lg"></i>
                      </button>
                    </div>

                    <div className="item-total">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>

                    <button className="remove-btn" onClick={() => handleRemove(item.id)} aria-label={`Remove ${item.name}`}>
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="checkout-summary">
              <div className="summary-text">
                <span>Order total</span>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
              <Button className="btn btn-primary checkout-button" onClick={() => setShowModal(true)}>
                Checkout
              </Button>
            </div>
          </>
        )
      )}

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </section>
  );
};

export default Cart;
