import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Login.scss";

function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await newRequest.post("/auth/login", {
        username,
        password,
      });
  
      const token = res.data.token;
      const email = res.data.email; // Make sure backend sends it
      
      // Save email to localStorage for OTP resending
      localStorage.setItem("verifyEmail", email);
      
      // Navigate to OTP verification
      navigate(`/login/verify/${token}`);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      
    }
  };
  

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="username"
          placeholder="username"
          onChange={(e) => setusername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
        <p>
          Forgot your password?{" "}
          <span onClick={() => navigate("/login/forgot")}>Reset</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
