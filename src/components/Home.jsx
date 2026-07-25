import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory, onSelectCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        setLoading(true);
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              // High quality SVG fallback placeholder
              const fallbackUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%236366f1" opacity="0.1"/><text x="50%" y="48%" font-family="sans-serif" font-weight="700" font-size="20" fill="%236366f1" text-anchor="middle">${encodeURIComponent(product.name || 'CAMPER Product')}</text><text x="50%" y="60%" font-family="sans-serif" font-size="14" fill="%2394a3b8" text-anchor="middle">${encodeURIComponent(product.brand || 'Electronics')}</text></svg>`;
              return { ...product, imageUrl: fallbackUrl };
            }
          })
        );
        setProducts(updatedProducts);
        setLoading(false);
      };

      fetchImagesAndUpdateProducts();
    } else if (data && data.length === 0) {
      setProducts([]);
      setLoading(false);
    }
  }, [data]);

  const categories = ["All", "Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  const filteredProducts = selectedCategory && selectedCategory !== "All"
    ? products.filter((product) => product.category?.toLowerCase() === selectedCategory.toLowerCase())
    : products;

  if (isError) {
    return (
      <div className="empty-state">
        <img src={unplugged} alt="Error" style={{ width: "120px", marginBottom: "1.5rem" }} />
        <h2>Unable to connect to service</h2>
        <p>Ensure your backend server is running on port 8080.</p>
        <button className="btn btn-primary" onClick={refreshData} style={{ marginTop: "1rem" }}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><i className="bi bi-stars"></i> Premium Storefront</span>
          <h1>Upgrade Your Tech & Lifestyle Today.</h1>
          <p>
            Explore our curated catalog of laptops, headphones, mobiles, and fashion items with instant shipping and live availability.
          </p>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${
                  (cat === "All" && !selectedCategory) || selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => onSelectCategory && onSelectCategory(cat === "All" ? "" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="product-grid-section">
        <div className="grid-title">
          <div>
            <h2>{selectedCategory ? `${selectedCategory} Collection` : "Featured Catalog"}</h2>
            <p style={{ color: "var(--text-secondary)", margin: "0.4rem 0 0" }}>
              {selectedCategory
                ? `Showing ${filteredProducts.length} items in ${selectedCategory}`
                : `Discover all ${filteredProducts.length} available items in stock.`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="product-card" style={{ height: "360px", opacity: 0.6 }}>
                <div className="product-card-image-wrapper" style={{ background: "var(--surface-soft)" }}></div>
                <div className="product-card-body" style={{ gap: "0.5rem" }}>
                  <div style={{ width: "40%", height: "14px", background: "var(--surface-soft)", borderRadius: "4px" }}></div>
                  <div style={{ width: "80%", height: "20px", background: "var(--surface-soft)", borderRadius: "4px" }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-box-seam" style={{ fontSize: "3rem", color: "var(--accent-primary)" }}></i>
            <h2>No products found</h2>
            <p>Try switching categories or add new products to the catalog.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageUrl } = product;
              return (
                <article className="product-card" key={id}>
                  <Link to={`/product/${id}`} className="product-card-link">
                    <div className="product-card-image-wrapper">
                      <img src={imageUrl} alt={name} className="product-card-image" />
                    </div>
                    <div className="product-card-body">
                      <span className="card-brand">{brand || "CAMPER"}</span>
                      <h3>{name}</h3>
                      <div className="product-card-meta">
                        <span className="price">₹{price}</span>
                        <span className={`badge ${productAvailable ? "badge-available" : "badge-out"}`}>
                          {productAvailable ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button
                      className="btn btn-primary btn-add"
                      onClick={() => addToCart(product)}
                      disabled={!productAvailable}
                    >
                      <i className="bi bi-cart-plus-fill"></i>
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;

