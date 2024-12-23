// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Backend base URL
});

// Automatically include the token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Fetch the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token as Bearer
  }
  return config;
});

export default api;
