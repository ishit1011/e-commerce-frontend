// Home.jsx
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase"; // Adjust path as needed
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      const checkRes = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/check-email/${userEmail}`
      );
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.approved) {
        alert("Your email is not approved to access this app.");
        return;
      }

      const idToken = await result.user.getIdToken();

      setUser(result.user);
      localStorage.setItem("token", idToken);
      console.log("User signed in:", result.user);
      console.log("ID token : ", idToken);
      navigate("/products");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
          color: "#1a202c",
        }}
      >
        Welcome to TechNest
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#4a5568",
          marginBottom: "40px",
        }}
      >
        Your one-stop shop for the latest gadgets – phones, consoles, laptops,
        and more!
      </p>

      {/* Tech Devices Showcase */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "30px",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "250px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/public/iphone.png"
            alt="iPhone"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />
          <h2 style={{ fontSize: "1.1rem", color: "#2d3748" }}>
            iPhone 15 Pro
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "250px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/public/ps5.png"
            alt="PS5"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />
          <h2 style={{ fontSize: "1.1rem", color: "#2d3748" }}>
            PlayStation 5
          </h2>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            width: "250px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/public/macbook.png"
            alt="MacBook"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />
          <h2 style={{ fontSize: "1.1rem", color: "#2d3748" }}>
            MacBook Air M2
          </h2>
        </div>
      </div>

      {/* Sign In Button */}
      {!user && (
        <button
          onClick={handleSignIn}
          style={{
            padding: "12px 24px",
            backgroundColor: "#1e40af",
            color: "white",
            fontSize: "1rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
        >
          Sign In with Google
        </button>
      )}

      {user && (
        <div style={{ marginTop: "30px" }}>
          <p>Welcome, {user.displayName} 👋</p>
        </div>
      )}
    </div>
  );
};

export default Home;
