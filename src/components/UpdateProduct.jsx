import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, refreshData } = useContext(AppContext);

  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://springboot-ecommerce-backend-0q40.onrender.com/api/product/${id}`
        );

        setProduct(response.data);
        setUpdateProduct(response.data);

        try {
          const responseImage = await axios.get(
            `https://springboot-ecommerce-backend-0q40.onrender.com/api/product/${id}/image`,
            { responseType: "blob" }
          );
          const imageFile = await converUrlToFile(responseImage.data, response.data.imageName || "product.jpg");
          setImage(imageFile);
          setImagePreview(URL.createObjectURL(responseImage.data));
        } catch (imgErr) {
          console.warn("Could not fetch existing image blob", imgErr);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const updatedProductData = new FormData();
    if (image) {
      updatedProductData.append("imageFile", image);
    }
    updatedProductData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    axios
      .put(`https://springboot-ecommerce-backend-0q40.onrender.com/api/product/${id}`, updatedProductData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        showToast(`Product "${updateProduct.name}" updated successfully! ✨`, "success");
        refreshData();
        navigate(`/product/${id}`);
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        showToast("Failed to update product. Please try again.", "danger");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <section className="form-card">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to={`/product/${id}`} style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
          <i className="bi bi-arrow-left"></i> Back to product details
        </Link>
      </div>

      <div className="center-container">
        <h1>Update Product</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Modify the details or update inventory levels for this item.
        </p>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.name}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder={product.brand}
              value={updateProduct.brand}
              onChange={handleChange}
              id="brand"
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <textarea
              className="form-control"
              placeholder={product.description}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
              id="description"
              rows={3}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Price (₹)</h6>
            </label>
            <input
              type="number"
              className="form-control"
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price}
              name="price"
              id="price"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={updateProduct.category}
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder={product.stockQuantity}
              value={updateProduct.stockQuantity}
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
              value={updateProduct.releaseDate ? updateProduct.releaseDate.split("T")[0] : ""}
              name="releaseDate"
              onChange={handleChange}
              id="releaseDate"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Update Product Image</h6>
            </label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              name="imageUrl"
              id="imageUrl"
            />
          </div>

          {imagePreview && (
            <div className="col-12" style={{ marginTop: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                Current / Selected Image:
              </span>
              <img
                src={imagePreview}
                alt="Product Preview"
                style={{ width: "160px", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}
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
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="gridCheck" style={{ fontWeight: 600 }}>
                Product Available
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
              {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateProduct;
