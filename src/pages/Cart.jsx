import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const token = localStorage.getItem("token"); // Firebase idToken stored on login

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter your delivery address");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/order/post-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cartItems,
          address: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      setCartItems([]);
      alert("Order placed successfully!");
      localStorage.removeItem("cart"); // Clear cart on success
      console.log('result ', result)
    } catch (error) {
      console.error(error);
      alert("Error placing order, please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p
          style={{
            fontSize: "1.2rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          Your cart is empty.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={`/${item.imageUrl}`}
                  alt={item.name}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h2 style={{ margin: "0 0 10px" }}>{item.name}</h2>
                  <p style={{ margin: "4px 0", color: "#555" }}>
                    Color: <b>{item.color}</b> | Size: <b>{item.size}</b>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    Quantity: <b>{item.quantity}</b>
                  </p>
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    minWidth: "100px",
                    textAlign: "right",
                  }}
                >
                  ₹{item.price * item.quantity}
                </div>
              </div>

              {/* Back to product detail button */}
              <div style={{ marginTop: "15px", textAlign: "right" }}>
                <button
                  onClick={() => navigate(`/product/${item.productId}`)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ← Back to Product Detail
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              textAlign: "right",
              marginTop: "30px",
              fontSize: "1.5rem",
              fontWeight: "700",
              borderTop: "2px solid #ddd",
              paddingTop: "20px",
            }}
          >
            Total: ₹{totalCartPrice}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, margin: '20px auto', gap: '12px' }}>
  <input
    type="text"
    placeholder="Enter delivery address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    style={{
      padding: '12px 16px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1.5px solid #ccc',
      outline: 'none',
      transition: 'border-color 0.3s',
    }}
    onFocus={e => e.target.style.borderColor = '#0070f3'}
    onBlur={e => e.target.style.borderColor = '#ccc'}
  />
  <button
    onClick={handlePlaceOrder}
    style={{
      padding: '12px 20px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#0070f3',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }}
    onMouseEnter={e => e.target.style.backgroundColor = '#005bb5'}
    onMouseLeave={e => e.target.style.backgroundColor = '#0070f3'}
  >
    Place Order
  </button>
</div>

        </div>
      )}
    </div>
  );
};

export default Cart;
