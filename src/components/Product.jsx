import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };
  if (!product) {
    return (
      <div className="empty-state" style={{ padding: "12rem 2rem" }}>
        <h2>Loading product details...</h2>
      </div>
    );
  }

  return (
    <section className="detail-page">
      <div className="detail-grid">
        <div className="detail-image-panel">
          <img
            className="detail-image"
            src={imageUrl}
            alt={product.imageName}
          />
        </div>

        <div className="detail-info-panel">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="brand">{product.brand}</p>

          <div className="detail-tags">
            <span className={`badge ${product.productAvailable ? "badge-available" : "badge-out"}`}>
              {product.productAvailable ? "Available" : "Out of stock"}
            </span>
            <span className="badge badge-available">
              Listed {new Date(product.releaseDate).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h6 style={{ marginBottom: "0.75rem" }}>Product description</h6>
            <p className="detail-description">{product.description}</p>
          </div>

          <div className="detail-footer">
            <div className="price-block">
              <span className="price">₹{product.price}</span>
              <span className="stock-label">Stock Available: {product.stockQuantity}</span>
            </div>
            <div className="detail-actions">
              <button className="btn btn-primary" type="button" onClick={handlAddToCart} disabled={!product.productAvailable}>
                {product.productAvailable ? "Add to Cart" : "Unavailable"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={handleEditClick}>
                Update
              </button>
              <button className="btn btn-secondary" type="button" onClick={deleteProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;