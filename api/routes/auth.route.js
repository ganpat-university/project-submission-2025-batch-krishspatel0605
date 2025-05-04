import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  verifyAccount,
  loginVerifyOTP,
  resendLoginOTP,
  resendActivationOtp,
  forgotPassword,
  resetPassword,
  resendForgotPasswordOtp,

} from "../controllers/auth.controller.js";

// Registration routes
router.post("/register", register);
router.post("/verify/:token", verifyAccount);
router.post("/resend/register", resendActivationOtp);


// Login routes
router.post("/login", login);
router.post("/login/verify/:token", loginVerifyOTP);
router.post("/login/resend", resendLoginOTP);
router.post("/login/verify/resend", resendLoginOTP);
router.post("/login/forgot", forgotPassword);
router.post("/login/reset/:token", resetPassword);
router.post("/login/forgot/resend", resendForgotPasswordOtp);

// Logout route
router.post("/logout", logout);

export default router;
