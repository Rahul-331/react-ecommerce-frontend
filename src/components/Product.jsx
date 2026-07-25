import { useNavigate, useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { Modal, Button } from "react-bootstrap";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData, showToast } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://springboot-ecommerce-backend-0q40.onrender.com/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        } else {
          setFallbackImage(response.data.name, response.data.brand);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://springboot-ecommerce-backend-0q40.onrender.com/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        setFallbackImage(product?.name, product?.brand);
      }
    };

    const setFallbackImage = (name, brand) => {
      const fallbackUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="400" viewBox="0 0 500 400"><rect width="500" height="400" fill="%236366f1" opacity="0.12"/><text x="50%" y="48%" font-family="sans-serif" font-weight="700" font-size="24" fill="%236366f1" text-anchor="middle">${encodeURIComponent(name || 'CAMPER Product')}</text><text x="50%" y="60%" font-family="sans-serif" font-size="16" fill="%2394a3b8" text-anchor="middle">${encodeURIComponent(brand || 'Electronics')}</text></svg>`;
      setImageUrl(fallbackUrl);
    };

    fetchProduct();
  }, [id]);

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      await axios.delete(`https://springboot-ecommerce-backend-0q40.onrender.com/api/product/${id}`);
      removeFromCart(id);
      showToast(`Product "${product.name}" deleted successfully`, "info");
      refreshData();
      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Failed to delete product. Please try again.", "danger");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (!product) {
    return (
      <div className="empty-state" style={{ padding: "8rem 2rem" }}>
        <i className="bi bi-arrow-repeat spin" style={{ fontSize: "2.5rem", color: "var(--accent-primary)" }}></i>
        <h2>Loading product details...</h2>
      </div>
    );
  }

  return (
    <section className="detail-page">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
          <i className="bi bi-arrow-left"></i> Back to catalog
        </Link>
      </div>

      <div className="detail-grid">
        <div className="detail-image-panel">
          <img
            className="detail-image"
            src={imageUrl}
            alt={product.name}
          />
        </div>

        <div className="detail-info-panel">
          <span className="eyebrow">{product.category || "General"}</span>
          <h1>{product.name}</h1>
          <p className="brand">{product.brand}</p>

          <div className="detail-tags">
            <span className={`badge ${product.productAvailable ? "badge-available" : "badge-out"}`}>
              {product.productAvailable ? "In Stock" : "Out of Stock"}
            </span>
            {product.releaseDate && (
              <span className="badge badge-available">
                Released {new Date(product.releaseDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div>
            <h6 style={{ marginBottom: "0.75rem", fontWeight: 700 }}>Description</h6>
            <p className="detail-description">{product.description || "No description provided."}</p>
          </div>

          <div className="detail-footer">
            <div className="price-block">
              <span className="price">₹{product.price}</span>
              <span className="stock-label">Units Available: {product.stockQuantity}</span>
            </div>
            <div className="detail-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAddToCart}
                disabled={!product.productAvailable}
              >
                <i className="bi bi-cart-plus-fill me-1"></i>
                {product.productAvailable ? "Add to Cart" : "Unavailable"}
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={handleEditClick}>
                <i className="bi bi-pencil-square me-1"></i> Edit
              </button>
              <button className="btn btn-outline-danger" type="button" onClick={() => setShowDeleteModal(true)}>
                <i className="bi bi-trash3 me-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 700 }}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>"{product.name}"</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Product;
