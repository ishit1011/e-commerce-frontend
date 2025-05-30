import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedRiders, setSelectedRiders] = useState({});
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loadingUpdates, setLoadingUpdates] = useState({});
  const [errors, setErrors] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_SERVER}/order/admin-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_SERVER}/user/rider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRiders(res.data);
    } catch (err) {
      console.error("Failed to fetch riders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const handleStatusChange = (orderId, value) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRiderChange = (orderId, riderId) => {
    setSelectedRiders((prev) => ({ ...prev, [orderId]: riderId }));
  };

  const updateOrder = async (orderId) => {
    const status = statusUpdates[orderId];
    const assignedRider = selectedRiders[orderId];

    setLoadingUpdates((prev) => ({ ...prev, [orderId]: true }));
    setErrors((prev) => ({ ...prev, [orderId]: null }));

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_SERVER}/order/admin-orders/${orderId}`,
        { status, assignedRider },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: res.data.status,
                assignedRider: res.data.assignedRider ?? order.assignedRider,
                user: order.user,
              }
            : order
        )
      );
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [orderId]: error.response?.data || "Something went wrong while updating order.",
      }));
    } finally {
      setLoadingUpdates((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f3f4f6" }}>
  <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#1f2937" }}>
    Admin Dashboard
  </h2>

  {orders.map((order) => (
    <div
      key={order._id}
      style={{
        display: "flex",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "30px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left Side: Order Details */}
      <div style={{ width: "50%", padding: "24px", boxSizing: "border-box" }}>
        <p style={{ marginBottom: "10px" }}>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Status:</strong> {order.status}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>User:</strong> {order.user?.email}
        </p>
        <p style={{ marginBottom: "16px" }}>
          <strong>Assigned Rider:</strong> {order.assignedRider?.email || "None"}
        </p>

        <div style={{ marginBottom: "14px" }}>
          <label htmlFor={`status-${order._id}`} style={{ marginRight: "8px", fontWeight: "bold" }}>
            Update Status:
          </label>
          <input
            id={`status-${order._id}`}
            type="text"
            placeholder="New Status"
            value={statusUpdates[order._id] || ""}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "5px",
              border: "1px solid #cbd5e0",
              width: "180px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor={`rider-dropdown-${order._id}`} style={{ marginRight: "8px", fontWeight: "bold" }}>
            Select Rider:
          </label>
          <select
            id={`rider-dropdown-${order._id}`}
            value={selectedRiders[order._id] || ""}
            onChange={(e) => handleRiderChange(order._id, e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "5px",
              border: "1px solid #cbd5e0",
              width: "200px",
            }}
          >
            <option value="">-- Choose a rider --</option>
            {riders.map((rider) => (
              <option key={rider._id} value={rider._id}>
                {rider.email}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => updateOrder(order._id)}
          disabled={loadingUpdates[order._id]}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: loadingUpdates[order._id] ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loadingUpdates[order._id] ? "Updating..." : "Update Order"}
        </button>

        {errors[order._id] && (
          <p style={{ color: "#dc2626", marginTop: "12px" }}>{errors[order._id]}</p>
        )}
      </div>

      {/* Right Side: Order Image */}
      <div style={{ width: "50%", height: "100%", overflow: "hidden" }}>
        <img
          src="public/order-img.png"
          alt="Order"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  ))}
</div>

  );
};

export default AdminDashboard;
