// RiderRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const RiderRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isRider, setIsRider] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsRider(false);
      setLoading(false);
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true);
          localStorage.setItem("token", idToken);

          // Call your API with 'rider' role param
          const res = await axios.get(
            `${import.meta.env.VITE_API_SERVER}/user/rider`, // adjust endpoint as needed
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          // Check if current user's email is in the returned list of riders
          const isCurrentUserRider = res.data.some(
            (u) => u.email.toLowerCase() === user.email.toLowerCase()
          );

          setIsRider(isCurrentUserRider);
        } catch (err) {
          setIsRider(false);
          console.error(err);
        }
      } else {
        setIsRider(false);
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

  return isRider ? children : <Navigate to="/products" />;
};

export default RiderRoute;
