import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "./LoginVerify.scss";

function LoginVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30); // 30-second resend cooldown
  const inputRefs = useRef([]);

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

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const otpCode = otp.join("");

    try {
      const res = await newRequest.post(`/auth/login/verify/${token}`, {
        otp: otpCode,
        token,
      });

      

      localStorage.removeItem("verifyEmail"); // ✅ clean up
      localStorage.setItem("currentUser", JSON.stringify(res.data));      

      localStorage.setItem("accessToken", token);
      toast.success("Logged in successfully");
      navigate(res.data.isSeller ? "/seller/dashboard" : "/");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem("verifyEmail");
    if (!email) {
      toast.error("Email not found in local storage.");
      return;
    }

    try {
      const res = await newRequest.post("/auth/login/resend", { email });
      const newToken = res.data.token;
      toast.info("OTP resent to your email.");
      setResendCooldown(30); // reset cooldown to 30s

      if (newToken) {
        navigate(`/login/verify/${newToken}`);
      }
    } catch (err) {
      toast.error("Failed to resend OTP.");
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerify(new Event("submit"));
    }
    // eslint-disable-next-line
  }, [otp]);

  return (
    <div className="verify-container">
      <form onSubmit={handleVerify} className="verify-form">
        <h2>Login Verification</h2>
        <p className="subtitle">Enter the 6-digit OTP sent to your email</p>

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
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="resend-section">
          Didn't receive the code?{" "}
          <span
            className="resend-link"
            onClick={handleResend}
            style={{
              pointerEvents: resendCooldown > 0 ? "none" : "auto",
              opacity: resendCooldown > 0 ? 0.5 : 1,
            }}
          >
            Resend OTP {resendCooldown > 0 && `(${resendCooldown}s)`}
          </span>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default LoginVerify;
