import axios from "axios";

const API_URL = "https://nxtwave-backend-vh3s.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create a separate Axios instance for admin
const adminApi = axios.create({
  baseURL: API_URL,
});

// Interceptor for admin APIs
adminApi.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

// Employee API calls
export const register = (data) => api.post("/register", data);
export const login = (data) => api.post("/login", data);
export const checkIn = (data) => api.post("/checkin", data);
export const getProfile = () => api.get("/me");
export const getAttendance = () => api.get("/attendance");

// Admin API calls
export const adminLogin = (data) => adminApi.post("/admin/login", data);
export const getAllAttendance = () => adminApi.get("/admin/attendance");
