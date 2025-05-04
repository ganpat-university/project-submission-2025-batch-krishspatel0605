import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "./resetpassword.scss"; // Adjust the path as necessary

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
   
  
    if (!otp || !newPassword || !token) {
      return toast.error("All fields are required");
    }
  
    setLoading(true);
    try {
      const res = await newRequest.post(`/auth/login/reset/${token}`, {
        otp,
        newPassword,
      });
      console.log("Response:", res);          
      toast.success(res.data?.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Reset Password</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
  
}

export default ResetPassword;
