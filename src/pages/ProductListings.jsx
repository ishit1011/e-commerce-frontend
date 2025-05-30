import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_SERVER}/product`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Available Products
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {products.map((product, index) => (
          <div
            key={product._id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow:
                hoverIndex === index
                  ? "0 8px 16px rgba(0,0,0,0.2)"
                  : "0 4px 8px rgba(0,0,0,0.1)",
              padding: "16px",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <img
              src={`/${product.imageUrl.replace(/^public\//, "")}`}
              alt={product.name}
              style={{
                width: "100%",
                height: "192px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              {product.name}
            </h2>
            <p
              style={{
                color: "#4b5563",
                marginBottom: "8px",
              }}
            >
              {product.description}
            </p>
            <ul
              style={{
                marginTop: "8px",
                fontSize: "0.875rem",
                color: "#6b7280",
                listStyleType: "none",
                paddingLeft: 0,
              }}
            >
              {product.variants.map((v) => (
                <li key={v._id} style={{ marginBottom: "4px" }}>
                  <strong>{v.color}</strong> – {v.size} – ${v.price}
                </li>
              ))}
            </ul>
            <Link
              to={`/product/${product._id}`}
              style={{
                display: "inline-block",
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListings;



