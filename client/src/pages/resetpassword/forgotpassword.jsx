import React, { useState } from "react";
import { toast } from "react-toastify";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import "./forgotpassword.scss"; // Adjust the path as necessary

function ForgotPasswordRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await newRequest.post("/auth/login/forgot", { email });
      toast.success(res.data || "OTP sent to your email");
      navigate(`/login/reset-password/${res.data.token} `);
    } catch (err) {
      toast.error(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
    <form onSubmit={handleSubmit} className="form-box">
      <h2>Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  </div>
  );
}

export default ForgotPasswordRequest;
