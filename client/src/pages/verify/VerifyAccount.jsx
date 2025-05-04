import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "./Verify.scss";

function VerifyAccount() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30); // 30 seconds cooldown for resend OTP
  const inputRefs = useRef([]);

  const email = localStorage.getItem("verifyEmail"); // Must be stored during registration

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await newRequest.post(`/auth/verify/${token}`, { otp: code });
      toast.success(res.data || "Account verified successfully!");
      localStorage.removeItem("verifyEmail");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data || "Verification failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("No email found to resend OTP.");

    try {
      const res = await newRequest.post("/auth/resend/register", { email });
      toast.success("OTP resent successfully!");
      setResendCooldown(30); // Reset the cooldown to 30 seconds after each resend
    } catch (err) {
      toast.error(err.response?.data || "Couldn't resend OTP.");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-submit OTP when all fields are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
    // eslint-disable-next-line
  }, [otp]);

  return (
    <div className="verify-container">
      <form onSubmit={handleSubmit} className="verify-form">
        <h2>Verify Your Account</h2>
        <p className="subtitle">Enter the OTP sent to your email</p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="resend-section">
          Didn't receive the code?{" "}
          <span
            className="resend-link"
            onClick={handleResend}
            style={{ pointerEvents: resendCooldown > 0 ? "none" : "auto", opacity: resendCooldown > 0 ? 0.5 : 1 }}
          >
            Resend OTP {resendCooldown > 0 && `(${resendCooldown}s)`}
          </span>
        </div>
        
      </form>
    </div>
  );
}

export default VerifyAccount;
