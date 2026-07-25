import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  toast: null,
  showToast: (message, type = "success") => {},
  closeToast: () => {},
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  updateCartQuantity: (productId, delta) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {},
  clearCart: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const closeToast = () => {
    setToast(null);
  };

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    let updatedCart = [];
    if (existingProductIndex !== -1) {
      updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    showToast(`Added "${product.name || 'Item'}" to your cart! ✨`, "success");
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cart.find((item) => item.id === productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    showToast(`Removed "${itemToRemove?.name || 'Item'}" from cart`, "info");
  };

  const updateCartQuantity = (productId, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    showToast("Cart has been cleared", "info");
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        toast,
        showToast,
        closeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        refreshData,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;