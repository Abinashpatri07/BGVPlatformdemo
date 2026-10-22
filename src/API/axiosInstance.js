import axios from "axios";

// Determine base URL depending on env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

// Response Interceptor: Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Get role before clearing storage
      const role = localStorage.getItem("role");

      // Clear all auth tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // Redirect to the correct login page based on role
      const redirectMap = {
        "Vendor": "/vendor/login",
        "HR": "/hr/login",
        "HR 2": "/hr/login",
        "HR Executive": "/hr/login",
        "HR Manager": "/hr/login",
        "HR User": "/hr/login",
        "Client Admin": "/client-admin/login",
        "Candidate": "/candidate/login",
        "Super Admin": "/super-admin/login",
      };
      window.location.href = redirectMap[role] || "/super-admin/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
