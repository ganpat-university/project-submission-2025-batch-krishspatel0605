import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

newRequest.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser?.token) {
    config.headers.Authorization = `Bearer ${currentUser.token}`;
  }
  return config;
});

export default newRequest;
