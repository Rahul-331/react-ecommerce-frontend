import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory, selectedCategory }) => {
  const { cart, data } = useContext(AppContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = async (value) => {
    setInput(value);
    if (value.trim().length >= 1) {
      setShowSearchResults(true);
      if (data && data.length > 0) {
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.brand?.toLowerCase().includes(value.toLowerCase()) ||
          item.category?.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        try {
          const response = await axios.get(`http://localhost:8080/api/products/search?keyword=${value}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error searching:", error);
          setSearchResults([]);
        }
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const categories = ["All", "Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];
  const cartCount = cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid nav-container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-bag-heart-fill"></i> CAMPER
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${!selectedCategory ? "active" : ""}`} to="/" onClick={() => handleCategorySelect("")}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add_product">
                  Add Product
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn-dropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCategory || "Categories"}
                </button>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`dropdown-item ${selectedCategory === category || (category === "All" && !selectedCategory) ? "active" : ""}`}
                        onClick={() => handleCategorySelect(category === "All" ? "" : category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <div className="navbar-actions">
              <div className="navbar-search" ref={searchRef}>
                <div className="search-input-wrapper">
                  <i className="bi bi-search"></i>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search laptop, headphone..."
                    aria-label="Search"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => input.length > 0 && setShowSearchResults(true)}
                  />
                </div>
                {showSearchResults && (
                  <div className="search-dropdown">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <div key={result.id} className="search-result-item">
                          <Link
                            to={`/product/${result.id}`}
                            className="search-result-link"
                            onClick={() => {
                              setShowSearchResults(false);
                              setInput("");
                            }}
                          >
                            <div className="search-item-info">
                              <span className="search-item-title">{result.name}</span>
                              <span className="search-item-meta">{result.brand} • ₹{result.price}</span>
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="no-results-message">No matching products found</div>
                    )}
                  </div>
                )}
              </div>

              <button className="theme-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                {theme === "dark-theme" ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
              </button>

              <Link className="nav-link cart-link" to="/cart">
                <i className="bi bi-cart-fill"></i>
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

