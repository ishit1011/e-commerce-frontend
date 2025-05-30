// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase"; // Adjust path
import { onAuthStateChanged } from "firebase/auth";
import { ClipLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true); // Force refresh token
          localStorage.setItem("token", idToken);
          setAllowed(true);
        } catch {
          setAllowed(false);
        }
      } else {
        setAllowed(false);
      }
      setLoading(false);
    });
  }, []);



if (loading) return (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
    <ClipLoader color="#4f46e5" size={40} />
  </div>
);


  return allowed ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
