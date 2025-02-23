// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import ProductsPage from "./pages/ProductsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import UserFormPage from "./pages/UserFormPage";
import ProductFormPage from "./pages/ProductFormPage";
import InvoicePage from "./pages/InvoicePage";
import ClientPage from "./pages/ClientPage";
import CreateInvoice from "./pages/CreateInvoice";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  return token ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!token) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  if (userData?.Role?.role_name !== "Admin") {
    return <Navigate to="/dashboard" />; // Redirect non-admins to dashboard
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Private Routes with Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="users"
            element={
              <AdminRoute>
                <UserPage />
              </AdminRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <AdminRoute>
                <UserFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <AdminRoute>
                <UserFormPage />
              </AdminRoute>
            }
          />
          <Route path="products" element={<ProductsPage />} />
          <Route path="clients" element={<ClientPage />} />
          <Route path="/products/create" element={<ProductFormPage />} />
          <Route path="/products/edit/:id" element={<ProductFormPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/invoice/create" element={<CreateInvoice />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
