// src/utils/axiosInstance.js
import axios from "axios";

const BASE_URL = "http://35.154.209.48/api"; // Replace with your API's base URL
// const BASE_URL = "http://localhost:3002/api"; // Replace with your API's base URL

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken"); // Replace with your storage strategy
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle global response errors (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/"; // Replace with your login route
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
