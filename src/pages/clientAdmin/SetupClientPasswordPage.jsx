import { API_BASE_URL } from "../../API/config.js";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff, CheckCircle, Loader2, Mail } from "lucide-react";

const SetupClientPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE_URL}/api/client-admin/auth/setup-info?token=${token}`)
        .then(res => {
          if (res.data.success) setEmail(res.data.email);
        })
        .catch(err => {
          setError(err.response?.data?.message || "Invalid or expired setup link.");
        });
    } else {
      setError("No setup token provided in the link.");
    }
  }, [token]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing setup token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @, #, $).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/client-admin/auth/send-setup-otp`, {
        token,
      });

      if (response.data.success) {
        setOtpSent(true);
        setError(""); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/client-admin/auth/set-password`, {
        token,
        otp,
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/admin/login"); // Redirect to client admin login
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/50 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/50 blur-[100px]" />
        <div className="absolute top-[30%] left-[50%] w-[30%] h-[30%] rounded-full bg-blue-300/30 blur-[80px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
          Welcome to Client Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 max-w-sm mx-auto">
          Please set a secure password to activate your Client Admin account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-white">
          
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 shadow-sm">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Password Set Successfully!</h3>
              <p className="text-sm text-slate-500 mb-6">
                Your account is now active. Redirecting you to login...
              </p>
              <button
                onClick={() => navigate("/client-admin/login")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Go to Client Login Now
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={otpSent ? handleVerifyAndSetPassword : handleSendOtp}>
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="appearance-none block w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl shadow-sm text-slate-500 bg-slate-50 sm:text-sm cursor-not-allowed"
                    placeholder={error ? "Email not found" : "Loading..."}
                  />
                </div>
              </div>

              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-800 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="Abcd@1234"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-800 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="Repeat new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-[fadeIn_0.3s_ease-in-out]">
                  <div className="bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-4 mb-6">
                    <p className="text-sm text-indigo-700 text-center">
                      We've sent a 6-digit OTP to <b className="text-indigo-900">{email}</b>. Please enter it below to verify your identity.
                    </p>
                  </div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-[0.5em] font-bold text-slate-800 bg-white/50 focus:bg-white transition-all"
                    placeholder="------"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      {otpSent ? "Verifying..." : "Sending OTP..."}
                    </>
                  ) : (
                    otpSent ? "Verify & Set Password" : "Send OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link to="/admin/login" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupClientPasswordPage;
