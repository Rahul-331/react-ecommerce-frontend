import axios from "../axios";
import { useState, useEffect, createContext, useCallback } from "react";

const SAMPLE_PRODUCTS = [
  {
    id: 101,
    name: 'MacBook Pro 16" M3 Max',
    brand: "Apple",
    category: "Laptop",
    price: 249900,
    description: "Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD storage with extreme performance for pros.",
    stockQuantity: 12,
    productAvailable: true,
    releaseDate: "2026-01-15"
  },
  {
    id: 102,
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    category: "Headphone",
    price: 29990,
    description: "Industry-leading active noise cancellation with 8 microphones and crystal clear hands-free calling.",
    stockQuantity: 25,
    productAvailable: true,
    releaseDate: "2026-02-10"
  },
  {
    id: 103,
    name: "iPhone 15 Pro Max Titanium",
    brand: "Apple",
    category: "Mobile",
    price: 139900,
    description: "Forged in titanium, A17 Pro chip, customizable Action button, 48MP main camera with 5x Telephoto.",
    stockQuantity: 8,
    productAvailable: true,
    releaseDate: "2025-11-20"
  },
  {
    id: 104,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Mobile",
    price: 129999,
    description: "Galaxy AI features, 200MP camera, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy.",
    stockQuantity: 15,
    productAvailable: true,
    releaseDate: "2026-01-28"
  },
  {
    id: 105,
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Headphone",
    price: 35900,
    description: "World-class noise cancellation, breakthrough spatialized audio, custom tune audio technology.",
    stockQuantity: 0,
    productAvailable: false,
    releaseDate: "2025-10-05"
  },
  {
    id: 106,
    name: "ASUS ROG Zephyrus G16",
    brand: "ASUS",
    category: "Laptop",
    price: 189990,
    description: "Intel Core Ultra 9, RTX 4080 GPU, 2.5K 240Hz OLED Display for elite gaming.",
    stockQuantity: 5,
    productAvailable: true,
    releaseDate: "2026-03-01"
  }
];

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
  const [data, setData] = useState(SAMPLE_PRODUCTS);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      let updatedCart = [];
      if (existingProductIndex !== -1) {
        updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
    showToast(`Added "${product.name || 'Item'}" to cart! ✨`, "success");
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.id === productId);
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      showToast(`Removed "${itemToRemove?.name || 'Item'}" from cart`, "info");
      return updatedCart;
    });
  }, [showToast]);

  const updateCartQuantity = useCallback((productId, delta) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const response = await axios.get("/products");
      if (response.data && response.data.length > 0) {
        setData(response.data);
        setIsError("");
      } else {
        setData(SAMPLE_PRODUCTS);
      }
    } catch (error) {
      console.warn("Backend unavailable, using sample store products:", error.message);
      setData(SAMPLE_PRODUCTS);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('cart');
    showToast("Cart has been cleared", "info");
  }, [showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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

