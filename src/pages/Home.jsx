import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase"; // Adjust path as needed
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem("token", idToken);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

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
        await auth.signOut();
        return;
      }

      const idToken = await result.user.getIdToken();
      localStorage.setItem("token", idToken);

      setUser(result.user);
      navigate("/products");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
  {["iphone.png", "ps5.png", "macbook.png"].map((imgSrc, idx) => (
    <div
      key={idx}
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        width: "250px",
        height: "200px",            // Fix height to show full image nicely
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        overflow: "hidden",         // Clip overflow for clean edges
      }}
    >
      <img
        src={`/public/${imgSrc}`}
        alt={imgSrc.split(".")[0]}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",      // Fill container without distortion
        }}
      />
    </div>
  ))}
</div>


      {!user ? (
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
      ) : (
        <div style={{ marginTop: "30px" }}>
          <p>Welcome, {user.displayName} 👋</p>
        </div>
      )}
    </div>
  );
};

export default Home;
