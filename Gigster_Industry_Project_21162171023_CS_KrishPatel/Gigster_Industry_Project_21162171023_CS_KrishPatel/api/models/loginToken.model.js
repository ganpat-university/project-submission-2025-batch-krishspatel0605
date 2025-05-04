import mongoose from "mongoose";

const LoginTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  token: { type: String, required: true },
  type: { 
    type: String,
    required: true,
    enum: ["login", "forgotPassword"],  // Add forgotPassword or other types if needed
    default: "login"
  },
  expiresAt: { type: Date, required: true },
});

// Add TTL index for automatic expiration
LoginTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("LoginToken", LoginTokenSchema);
