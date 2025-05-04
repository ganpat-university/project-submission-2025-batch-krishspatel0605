import mongoose from "mongoose";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ActivationToken from "../models/ActivationToken.model.js";
import loginTokenModel from "../models/loginToken.model.js"
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/sendEmail.js";
import generateOTP from "../utils/generateOtp.js";
import {
  registrationEmailTemplate,
  loginEmailTemplate,
  resendLoginOTPTemplate,
  resendRegistrationOTPTemplate
} from "../utils/emailtemplates.js";


// ----------------------------------
// Registration: Send Activation OTP Email
// ----------------------------------
export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const otp = generateOTP();
    const token = uuidv4();
    const tempUser = { ...req.body, password: hash };

    const newActivation = new ActivationToken({
      userData: tempUser,
      otp,
      token,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    });

    await newActivation.save();

    const html = registrationEmailTemplate(otp, token);
    await sendEmail(req.body.email, html, "Gigster - Verify Your Account");

    res.status(200).send("Verification email sent.");
  } catch (err) {
    next(err);
  }
};

// ----------------------------------
// Verify Account Activation OTP
// ----------------------------------
export const verifyAccount = async (req, res, next) => {
  const { token } = req.params;
  const { otp } = req.body;

  try {
    const record = await ActivationToken.findOne({ token });
    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return next(createError(400, "Invalid or expired OTP/token"));
    }

    const newUser = new User(record.userData);
    await newUser.save();
    await ActivationToken.findOneAndDelete({ token });

    res.status(201).send("Account activated. Please login.");
  } catch (err) {
    next(err);
  }
};

// ----------------------------------
// Login: Send Login OTP
// ----------------------------------
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong credentials"));

    const otp = generateOTP();
    const token = uuidv4();

    await new loginTokenModel({
      userId: user._id,
      otp,
      token,
      type: "login",
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    }).save();

    const loginHtml = loginEmailTemplate(otp);
    await sendEmail(user.email, loginHtml, "Gigster - Login OTP");

    // Send token and email for frontend to store (for resend)
    res.status(200).send({
      message: "OTP sent",
      token,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// ----------------------------------
// Verify Login OTP
// ----------------------------------
// adjust if needed

export const loginVerifyOTP = async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;

  if (!token || !otp) {
    return res.status(400).json({ message: "Token and OTP are required" });
  }

  try {
    const normalizedOtp = otp.toString();

    // Find the login token
    const tokenDoc = await loginTokenModel.findOne({ token, type: "login" });

    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired login link" });
    }

    if (tokenDoc.otp !== normalizedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate proper JWT token here
    const jwtToken = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    // ✅ Delete the token after use
    await loginTokenModel.findOneAndDelete({ token });

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};


// ----------------------------------
// Resend Login OTP
// ----------------------------------
export const resendLoginOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const token = uuidv4();

    await loginTokenModel.findOneAndUpdate(
      { userId: user._id, type: "login" },
      { otp, token, expiresAt: Date.now() + 10 * 60 * 1000 },
      { upsert: true, new: true }
    );


    const html = resendLoginOTPTemplate(otp, email);
    await sendEmail(email, html, "Gigster - Resend Login OTP");

    res.status(200).json({ message: "OTP resent successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
  
};

// ----------------------------------
// Resend Registration OTP
// ----------------------------------
export const resendActivationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const existing = await ActivationToken.findOne({ "userData.email": email });
    if (!existing) return next(createError(404, "No activation pending for this email."));
    
    await ActivationToken.findOneAndDelete({ "userData.email": email });
    
    const otp = generateOTP();
    const token = uuidv4();
    const tempUser = existing.userData;
    
    const newActivation = new ActivationToken({
      userData: tempUser,
      otp,
      token,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    
    await newActivation.save();
    const html = resendRegistrationOTPTemplate(otp, token);
    await sendEmail(email, html, "Gigster - Resend Account Verification");
    
    res.status(200).send("New OTP sent to your email.");
  } catch (err) {
    next(err);
  }
};

// ----------------------------------
// Logout
// ----------------------------------
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const otp = generateOTP();  // Make sure this function generates a valid OTP
    const token = uuidv4();     // Generates a unique token for the user

    // Store OTP and token in the database (for forgot password flow)
    await loginTokenModel.findOneAndUpdate(
      { userId: user._id, type: "forgotPassword" },
      { otp, token, expiresAt: Date.now() + 10 * 60 * 1000 }, // OTP expires in 10 minutes
      { upsert: true, new: true }
    );

    // Prepare the email content with OTP
    const html = loginEmailTemplate(otp);

    // Send the OTP to the user's email
    await sendEmail(email, html, "Gigster - Reset Password OTP");

    res.status(200).json({ message: "OTP sent successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}



// ----------------------------------
// resetPassword
// ----------------------------------

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { otp, newPassword } = req.body;

  if (!token || !otp || !newPassword) {
    return res.status(400).json({ message: "Token, OTP, and new password are required" });
  }

  try {
    const normalizedOtp = otp.toString();

    // Find the login token
    const tokenDoc = await loginTokenModel.findOne({ token, type: "forgotPassword" });

    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    if (tokenDoc.otp !== normalizedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update it
    const hashedPassword = bcrypt.hashSync(newPassword, 5);
    user.password = hashedPassword;
    await user.save();

    // Delete the token after use
    await loginTokenModel.findOneAndDelete({ token });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed" });
  }
}

// ----------------------------------
// resendforgotPasswordOtp
// ----------------------------------

export const resendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User
.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const token = uuidv4();

    await loginTokenModel.findOneAndUpdate(
        { userId: user._id, type: "forgotPassword" },
        { otp, token, expiresAt: Date.now() + 10 * 60 * 1000 },
        { upsert: true, new: true }
      );
    const html = loginEmailTemplate(otp);
    await sendEmail(email, html, "Gigster - Resend Reset Password OTP");

    res.status(200).json({ message: "OTP resent successfully", token });
  }
  catch (err) {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
}
