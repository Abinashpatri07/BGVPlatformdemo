// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function LoginForm() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     // ✅ Dummy credentials
//     const dummyEmail = "ramesh@gmail.com";
//     const dummyPassword = "123456";

//     if (email === dummyEmail && password === dummyPassword) {
//       // store login flag
//       localStorage.setItem("isLoggedIn", "true");

//       // redirect
//       navigate("/verification");
//     } else {
//       alert("Invalid email or password");
//     }
//   };

//   return (
//     <div className="relative z-10 w-full max-w-sm px-8">

//       {/* Heading */}
//       <h1 className="text-4xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
//         Welcome
//       </h1>
//       <p className="text-center text-sm text-gray-500 mb-8">
//         Candidate login Portal
//       </p>

//       {/* Email */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Email
//         </label>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
//         />
//       </div>

//       {/* Password */}
//       <div className="mb-3">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Password
//         </label>
//         <input
//           type="password"
//           placeholder="••••••••••"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
//         />
//       </div>

//       {/* Remember me + Forgot password */}
//       <div className="flex items-center justify-between mb-6">
//         <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//           <input
//             type="checkbox"
//             className="w-3.5 h-3.5 rounded border-gray-300 accent-indigo-500"
//           />
//           Remember me
//         </label>

//         <button
//           type="button"
//           onClick={() => navigate("/forgot-password")}
//           className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
//         >
//           Forgot password
//         </button>
//       </div>

//       {/* Login button */}
//       <button
//         onClick={handleLogin}
//         className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white text-sm font-medium py-3 rounded-lg transition-all"
//       >
//         Log in
//       </button>

//       {/* Sign up link */}
//       <p className="text-center text-sm text-gray-500 mt-10">
//         Don't have an account?{" "}
//         <span className="text-indigo-500 hover:underline cursor-pointer">
//           Sign up to free!
//         </span>
//       </p>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/candidate/auth/login`, { email, password });

      if (res.data.success) {
        localStorage.setItem("candidateToken", res.data.token);
        localStorage.setItem("role", "candidate");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/verification");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="relative z-10 w-full max-w-sm px-8">

      <h1 className="text-4xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
        Welcome
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        Candidate login Portal
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      {/* Password */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      {/* Remember + Forgot */}
      <div className="flex justify-between mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Remember me
        </label>

        <button
          onClick={() => navigate("/candidate/forgot-password")}
          className="text-sm text-gray-500 hover:text-indigo-600"
        >
          Forgot password
        </button>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition-colors"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-10">
        Don't have an account?{" "}
        <span className="text-indigo-500 cursor-pointer">Sign up</span>
      </p>
    </div>
  );
}
