import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductListings from "./pages/ProductListings";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./component/AdminRoute";
import RiderPWA from "./pages/RiderPWA";
import RiderRoute from "./component/RiderRoute";

function App() {
  return(
    
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProtectedRoute><ProductListings /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>} />
        <Route path="/rider-pwa" element={<ProtectedRoute><RiderRoute><RiderPWA /></RiderRoute></ProtectedRoute>} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  
  )
}

export default App;
