import { API_BASE_URL } from "../../API/config.js";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff, CheckCircle, Loader2, Mail } from "lucide-react";

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [fetchingInfo, setFetchingInfo] = useState(true);

  useEffect(() => {
    if (token) {
      setFetchingInfo(true);
      axios.get(`${API_BASE_URL}/api/client-admin/candidate/setup-info?token=${token}`)
        .then(res => {
          if (res.data && res.data.success && res.data.email) {
            setEmail(res.data.email);
          } else {
            setError(res.data?.message || "Invalid or expired setup link.");
          }
        })
        .catch(err => {
          setError(err.response?.data?.message || "Invalid or expired setup link.");
        })
        .finally(() => {
          setFetchingInfo(false);
        });
    } else {
      setFetchingInfo(false);
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
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
      const response = await axios.post(`${API_BASE_URL}/api/client-admin/candidate/send-setup-otp`, {
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
      const response = await axios.post(`${API_BASE_URL}/api/client-admin/candidate/set-password`, {
        token,
        otp,
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/"); // Redirect to portal login
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/50 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/50 blur-[100px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Lock className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
          Welcome to BGV Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Set up your secure password to access your Candidate account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/60">
          
          {error && (
            <div className="mb-4 bg-red-50/80 border-l-4 border-red-500 p-4 rounded-r-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-bounce">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Password Set Successfully!</h3>
              <p className="mt-2 text-sm text-slate-600">
                Redirecting to login in a few seconds...
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
                >
                  Go to Login Now
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={otpSent ? handleVerifyAndSetPassword : handleSendOtp}>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Registered Email
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={email || (fetchingInfo ? "Loading..." : "Email unavailable")}
                    className="bg-slate-100/70 border border-slate-200 text-slate-500 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={otpSent}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 chars, 1 uppercase, 1 special"
                    required
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full p-3 pr-10 transition-all font-medium disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  <button
                    type="button"
                    disabled={otpSent}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={otpSent}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full p-3 pr-10 transition-all font-medium disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  <button
                    type="button"
                    disabled={otpSent}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="pt-2 animate-[fadeIn_0.3s_ease-out]">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-blue-700">
                      An OTP has been sent to <b>{email}</b>. Please enter it below to set your password.
                    </p>
                  </div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    className="bg-white border-2 border-blue-500 text-slate-900 text-center tracking-widest text-lg font-bold rounded-xl focus:ring-2 focus:ring-blue-500/20 block w-full p-3 shadow-sm"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-slate-500 hover:text-blue-600 underline font-medium"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
              <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Copyright */}
      <footer className="relative z-10 mt-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} <span className="font-semibold text-slate-700">HedgeVerify</span>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SetupPasswordPage;
