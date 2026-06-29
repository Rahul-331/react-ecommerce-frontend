import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
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
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="empty-state">
        <img src={unplugged} alt="Error" style={{ width: "120px", marginBottom: "1.5rem" }} />
        <h2>Unable to load products</h2>
        <p>Check your backend service and refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">Launch your storefront</span>
          <h1>Modern eCommerce UX for shoppers and sellers.</h1>
          <p>
            Browse top-rated products, manage inventory with ease, and present your
            catalog in a premium layout that looks like a real marketplace.
          </p>
        </div>
      </section>

      <section className="product-grid-section">
        <div className="grid-title">
          <div>
            <h2>{selectedCategory ? selectedCategory : "Featured Products"}</h2>
            <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 0" }}>
              {selectedCategory
                ? `Showing all ${selectedCategory} products.`
                : "Explore the latest items in stock."}
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h2>No products available</h2>
            <p>Try adding new items or choose a different category.</p>
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
                      <span className="card-brand">{brand}</span>
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
