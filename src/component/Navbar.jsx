import React, { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const Navbar = () => {
  const [role, setRole] = useState(null); // 'admin', 'rider', or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async (user) => {
      try {
        const idToken = await user.getIdToken(true);
        localStorage.setItem("token", idToken);

        // Fetch admin list
        const adminRes = await axios.get(
          `${import.meta.env.VITE_API_SERVER}/user/admin`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        const isAdmin = adminRes.data.some(
          (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );
        if (isAdmin) {
          setRole("admin");
          return;
        }

        // Fetch rider list
        const riderRes = await axios.get(
          `${import.meta.env.VITE_API_SERVER}/user/rider`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        const isRider = riderRes.data.some(
          (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );
        if (isRider) {
          setRole("rider");
          return;
        }

        // Normal user
        setRole(null);
      } catch (err) {
        console.error(err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <nav style={navStyle}>
        <p>Loading...</p>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <NavLink to="/" style={({ isActive }) => linkStyle(isActive)}>
        Home
      </NavLink>

      {/* Common links for logged-in users */}
      <NavLink to="/products" style={({ isActive }) => linkStyle(isActive)}>
        Products
      </NavLink>
      <NavLink to="/cart" style={({ isActive }) => linkStyle(isActive)}>
        Cart
      </NavLink>

      {/* Admin specific */}
      {role === "admin" && (
        <NavLink
          to="/admin-dashboard"
          style={({ isActive }) => linkStyle(isActive)}
        >
          Admin Dashboard
        </NavLink>
      )}

      {/* Rider specific */}
      {role === "rider" && (
        <NavLink to="/rider-pwa" style={({ isActive }) => linkStyle(isActive)}>
          Rider PWA
        </NavLink>
      )}
    </nav>
  );
};

// Simple styling
const navStyle = {
  display: "flex",
  gap: "20px",
  padding: "16px 24px",
  backgroundColor: "#4f46e5", // Indigo-600
  color: "white",
  fontWeight: "600",
  alignItems: "center",
};

const linkStyle = (isActive) => ({
  color: isActive ? "#fbbf24" : "white", // amber-400 when active
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  backgroundColor: isActive ? "#4338ca" : "transparent", // Indigo-700 for active bg
  transition: "background-color 0.3s ease",
});

export default Navbar;
