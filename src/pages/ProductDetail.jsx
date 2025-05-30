import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Track selected color and size separately
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [variant, setVariant] = useState({ color: "", size: "", price: 0 });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_SERVER}/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          // Set initial selected color and size from first variant
          const firstVariant = data.variants[0];
          setSelectedColor(firstVariant.color);
          setSelectedSize(firstVariant.size);
          setVariant(firstVariant);
        }
      });
  }, [id]);

  // Get unique colors and sizes from variants
  const colors = product
    ? [...new Set(product.variants.map((v) => v.color))]
    : [];
  const sizes = product
    ? [...new Set(product.variants.map((v) => v.size))]
    : [];

  // Update variant when selected color or size changes
  useEffect(() => {
    if (!product) return;
    const matchedVariant = product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (matchedVariant) {
      setVariant(matchedVariant);
    } else {
      setVariant(null);
    }
  }, [selectedColor, selectedSize, product]);

  if (!product) {
    return (
      <div style={{ padding: "40px", fontSize: "18px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }


  
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <img
        src={`/${product.imageUrl.replace(/^public\//, "")}`}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      />
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "12px" }}>
        {product.name}
      </h1>
      <p style={{ fontSize: "1rem", color: "#4b5563", marginBottom: "20px" }}>
        {product.description}
      </p>

      {/* Color Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "600", marginRight: "8px" }}>Color:</label>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            marginRight: "20px",
          }}
        >
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        {/* Size Selector */}
        <label style={{ fontWeight: "600", marginRight: "8px" }}>Size:</label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {variant ? (
        <>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "16px",
            }}
          >
            Selected: {variant.color} / {variant.size} – ${variant.price}
          </div>

          {/* Quantity Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <label style={{ fontWeight: "600" }}>Quantity:</label>
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              style={{
                padding: "6px 10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
              }}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              style={{
                padding: "6px 10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>

          {/* Total Price */}
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Total: ${variant.price * quantity}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              const cartItem = {
                productId: product._id,
                name: product.name,
                imageUrl: product.imageUrl,
                color: variant.color,
                size: variant.size,
                price: variant.price,
                quantity,
              };
              const cart = JSON.parse(localStorage.getItem("cart") || "[]");
              cart.push(cartItem);
              localStorage.setItem("cart", JSON.stringify(cart));
              navigate("/cart");
            }}
            style={{
              backgroundColor: "#1d4ed8",
              color: "#fff",
              padding: "12px 20px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </>
      ) : (
        <div style={{ fontSize: "16px", fontWeight: "600", color: "red" }}>
          Selected combination not available.
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
