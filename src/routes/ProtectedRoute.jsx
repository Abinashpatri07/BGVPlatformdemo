import { Navigate } from "react-router-dom";

// Map required role → correct login page
const LOGIN_PATHS = {
  "super-admin": "/super-admin/login",
  "admin":       "/admin/login",
  "hr":          "/hr/login",
  "vendor":      "/vendor/login",
};

function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  // NOT LOGGED IN → send to the correct portal's login page
  if (!userRole) {
    const loginPath = LOGIN_PATHS[role] || "/";
    return <Navigate to={loginPath} replace />;
  }

  // WRONG ROLE → redirect based on STORED role, not required role
  if (role && userRole !== role) {
    if (userRole === "super-admin") return <Navigate to="/super-admin/home" replace />;
    if (userRole === "admin")       return <Navigate to="/admin/home" replace />;
    if (userRole === "hr")          return <Navigate to="/hr/home" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;