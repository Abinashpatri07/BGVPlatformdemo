import axios from "axios";
import { API_BASE_URL } from "./config.js";

// Determine base URL depending on env (runtime config → build-time env → localhost fallback)
const BASE_URL = API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized for expired sessions
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      const isAuthRequest = url.includes("/auth/login") || url.includes("/unified-login") || url.includes("/verify-otp");
      const isLoginPage = window.location.pathname === "/" || window.location.pathname.endsWith("/login");

      // Don't auto-redirect/reload during login attempt, let the login form show the error message!
      if (!isAuthRequest && !isLoginPage) {
        // Clear all auth tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
