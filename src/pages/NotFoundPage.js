// src/pages/NotFoundPage.js
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg mb-4">The page you are looking for does not exist.</p>
    <Link to="/" className="text-blue-600 underline">
      Go back to Login
    </Link>
  </div>
);

export default NotFoundPage;
