import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";

const newRequest = axios.create({
  baseURL: isDevelopment
    ? "http://localhost:8000/api"   // Development backend URL
    : "/api",                      // Production (served via backend)
  withCredentials: true,           // Required for cookies/auth
});

export default newRequest;
