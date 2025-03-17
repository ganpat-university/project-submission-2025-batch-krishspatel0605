import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
dotenv.config();

// MongoDB connection
mongoose.set("strictQuery", true);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB!");
    } catch (error) {
        console.log(error);
    }
};

// ✅ CORS Configuration — Fixed for frontend at localhost:5173
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// ✅ Handle preflight OPTIONS requests for all routes
app.options("*", cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Serve static files if needed (e.g., for Docker/production)
// app.use(express.static(path.resolve(__dirname, 'public')));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

// Root route
app.get("/", (req, res) => {
    res.send("hello from server 👓");
});

// Error handler
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connect();
    console.log(`Backend server is running on ${PORT}!`);
});
