import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../Context/Context";

const AddProduct = () => {
  const { showToast, refreshData } = useContext(AppContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: new Date().toISOString().split("T")[0],
    productAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!product.name || !product.price || !product.brand) {
      showToast("Please fill in required fields (Name, Brand, Price)", "danger");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("https://springboot-ecommerce-backend-0q40.onrender.com/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        showToast(`Product "${product.name}" added successfully! ✨`, "success");
        refreshData();
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        showToast("Error creating product. Check backend server.", "danger");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section className="form-card">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
          <i className="bi bi-arrow-left"></i> Back to catalog
        </Link>
      </div>

      <div className="center-container">
        <h1>Add New Product</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Fill out the product information to list a new item in the CAMPER store.
        </p>

        <form className="row g-3" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Product Name *</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sony WH-1000XM5"
              onChange={handleInputChange}
              value={product.name}
              name="name"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand *</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="e.g. Sony, Apple, Dell"
              value={product.brand}
              onChange={handleInputChange}
              id="brand"
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <textarea
              className="form-control"
              placeholder="Describe key features, specs, and details..."
              value={product.description}
              name="description"
              onChange={handleInputChange}
              id="description"
              rows={3}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Price (₹) *</h6>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 24999"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              id="price"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              id="category"
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Units in stock"
              onChange={handleInputChange}
              value={product.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Release Date</h6>
            </label>
            <input
              type="date"
              className="form-control"
              value={product.releaseDate}
              name="releaseDate"
              onChange={handleInputChange}
              id="releaseDate"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Product Image</h6>
            </label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {imagePreview && (
            <div className="col-12" style={{ marginTop: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                Image Preview:
              </span>
              <img
                src={imagePreview}
                alt="Upload Preview"
                style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}
              />
            </div>
          )}

          <div className="col-12" style={{ marginTop: "1.25rem" }}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct({ ...product, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="gridCheck" style={{ fontWeight: 600 }}>
                Product Available for Purchase
              </label>
            </div>
          </div>

          <div className="col-12" style={{ marginTop: "1.75rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ padding: "0.75rem 2rem", borderRadius: "var(--radius-pill)", fontWeight: 700 }}
            >
              {submitting ? "Submitting..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;

