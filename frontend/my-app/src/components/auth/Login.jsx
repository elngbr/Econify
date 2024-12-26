import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Correctly import AuthContext
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const { login } = useContext(AuthContext); // Use AuthContext here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/login", { email, password });
      console.log("Login response:", response.data);
      const userData = response.data;

      login(userData); // Call login function from context
      navigate(
        userData.role === "professor"
          ? "/professor-dashboard"
          : "/student-dashboard"
      );
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form">
        <h2>Login</h2>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
