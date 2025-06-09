import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "primereact/resources/themes/lara-dark-indigo/theme.css"; // Changed to dark theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./styles/theme.css"; // Import our custom dark theme

import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Shopping from "./components/Shopping";
import Checkout from "./components/Checkout";
import Details from "./components/Details";
import Home from "./components/Home";
import Customer from "./components/Customer";
import Product from "./components/Product";
import Reports from "./components/Reports";
import Invoice from "./components/Invoice";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
   const {login} = useAuth();

  useEffect(() => {
    document.title = "BillPP - Invoice Management";
  }, []);

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Login setUserId={login}/> : <Navigate to="/home" replace />} />
      <Route path="/home" element={<ProtectedRoute><Home /> </ProtectedRoute>} />
      <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
      <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
      <Route path="/shopping" element={<ProtectedRoute><Shopping /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
      <Route path="/details" element={<ProtectedRoute><Details /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
