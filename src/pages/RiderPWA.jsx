import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RiderPWA() {
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loadingUpdates, setLoadingUpdates] = useState({});
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  // Fetch assigned orders on mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_SERVER}/order/rider`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() =>
        setErrors((prev) => ({ ...prev, global: "Failed to load orders" }))
      );
  }, []);

  const handleStatusChange = (orderId, value) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: value }));
  };

  const updateOrderStatus = async (orderId) => {
    if (!statusUpdates[orderId]) {
      setErrors((prev) => ({ ...prev, [orderId]: "Please enter a status" }));
      return;
    }
    setLoadingUpdates((prev) => ({ ...prev, [orderId]: true }));
    setErrors((prev) => ({ ...prev, [orderId]: null }));
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_SERVER}/order/rider/${orderId}`,
        { status: statusUpdates[orderId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedOrder = res.data;

      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      setStatusUpdates((prev) => ({ ...prev, [orderId]: "" }));
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Update failed";
      setErrors((prev) => ({ ...prev, [orderId]: message }));
    } finally {
      setLoadingUpdates((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div
      style={{
        width: "98vw",
        minHeight: "95vh",
        padding: "16px 24px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "24px",
          color: "#111827",
          textAlign: "center",
        }}
      >
        Rider Dashboard
      </h1>

      {errors.global && (
        <p
          style={{
            color: "#b91c1c",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {errors.global}
        </p>
      )}

      {orders.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "18px",
            marginTop: "40px",
          }}
        >
          No assigned orders currently.
        </p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "24px",
              padding: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              alignItems: "stretch",
              flexWrap: "wrap",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Left Side: Details & Controls */}
            <div
              style={{
                flex: "1 1 300px",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start", // no extra spacing, keep tight vertically
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  marginBottom: "12px", // small margin only
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "8px",
                }}
              >
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: "700",
                    fontSize: "22px", // bigger font size
                    color: "#374151",
                    wordBreak: "break-word",
                  }}
                >
                  Order ID:{" "}
                  <span style={{ fontWeight: "400", fontSize: "20px" }}>
                    {order._id}
                  </span>
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: "700",
                    fontSize: "22px",
                    color: "#374151",
                  }}
                >
                  Status:{" "}
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "20px",
                      textTransform: "capitalize",
                    }}
                  >
                    {order.status}
                  </span>
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: "700",
                    fontSize: "22px",
                    color: "#374151",
                  }}
                >
                  User:{" "}
                  <span style={{ fontWeight: "400", fontSize: "20px" }}>
                    {order.user?.email}
                  </span>
                </p>
              </div>

              <label
                htmlFor={`status-input-${order._id}`}
                style={{
                  marginBottom: "6px",
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "#4b5563",
                }}
              >
                Update Status:
              </label>
              <input
                id={`status-input-${order._id}`}
                type="text"
                placeholder="Enter new status"
                value={statusUpdates[order._id] || ""}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "20px",
                  marginBottom: "12px",
                  outline: "none",
                }}
              />

              <button
                onClick={() => updateOrderStatus(order._id)}
                disabled={loadingUpdates[order._id]}
                style={{
                  backgroundColor: loadingUpdates[order._id]
                    ? "#93c5fd"
                    : "#3b82f6",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "20px",
                  fontWeight: "700",
                  cursor: loadingUpdates[order._id] ? "not-allowed" : "pointer",
                  userSelect: "none",
                }}
              >
                {loadingUpdates[order._id] ? "Updating..." : "Update Status"}
              </button>

              {errors[order._id] && (
                <p
                  style={{
                    color: "#dc2626",
                    marginTop: "10px",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  {errors[order._id]}
                </p>
              )}
            </div>

            {/* Right Side: Image */}
            <div
              style={{
                flex: "1 1 200px",
                minWidth: "200px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#e0e7ff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="public/rider.png"
                alt="Order Illustration"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
