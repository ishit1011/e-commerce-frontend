// AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true);
          localStorage.setItem("token", idToken);

          // Call your API with 'admin' as role param
          const res = await axios.get(
            `${import.meta.env.VITE_API_SERVER}/user/admin`, // adjust base URL accordingly
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          // Check if current user's email is in the returned list of admin users
          const isCurrentUserAdmin = res.data.some(
            (u) => u.email.toLowerCase() === user.email.toLowerCase()
          );

          setIsAdmin(isCurrentUserAdmin);
        } catch (err) {
          setIsAdmin(false);
          console.error(err);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <ClipLoader color="#4f46e5" size={40} />
      </div>
    );

  return isAdmin ? children : <Navigate to="/products" />;
};

export default AdminRoute;
