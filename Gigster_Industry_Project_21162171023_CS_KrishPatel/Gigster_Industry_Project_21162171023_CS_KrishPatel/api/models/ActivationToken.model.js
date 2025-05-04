import mongoose from "mongoose";

const ActivationTokenSchema = new mongoose.Schema({
  userData: { type: Object, required: true },
  otp: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// 👇 TTL index here too
ActivationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("ActivationToken", ActivationTokenSchema);

