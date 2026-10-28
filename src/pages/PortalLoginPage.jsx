import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Mail, Lock } from "lucide-react";
import axiosInstance from "../API/axiosInstance";
import logo from "../assets/logo.png";

// List of individual portal fallback routes (used if backend is an older deployment without unified endpoints)
const fallbackPortals = [
  {
    role: "candidate",
    login: "/api/candidate/auth/login",
    verify: "/api/candidate/auth/verify-otp",
    dashboard: "/verification",
  },
  {
    role: "hr",
    login: "/api/hr/auth/login",
    verify: "/api/hr/auth/verify-otp",
    dashboard: "/hr/home",
  },
  {
    role: "admin",
    login: "/api/client-admin/auth/login",
    verify: "/api/client-admin/auth/verify-otp",
    dashboard: "/admin/home",
  },
  {
    role: "vendor",
    login: "/api/vendor/auth/login",
    verify: "/api/vendor/auth/verify-otp",
    resend: "/api/vendor/auth/resend-otp",
    dashboard: "/vendor/home",
  },
  {
    role: "super-admin",
    login: "/api/auth/login",
    verify: "/api/auth/verify-otp",
    resend: "/api/auth/resend-otp",
    dashboard: "/super-admin/home",
  },
];

const destinationForStoredRole = (role) => ({
  "super-admin": "/super-admin/home",
  "Super Admin": "/super-admin/home",
  admin: "/admin/home",
  "Client Admin": "/admin/home",
  hr: "/hr/home",
  HR: "/hr/home",
  "HR 2": "/hr/home",
  "HR Executive": "/hr/home",
  "HR Manager": "/hr/home",
  "HR User": "/hr/home",
  vendor: "/vendor/home",
  Vendor: "/vendor/home",
  candidate: "/verification",
  Candidate: "/verification",
}[role] || null);

const clearAuthState = () => {
  [
    "accessToken", "refreshToken", "candidateToken", "vendorToken",
    "vendorRefreshToken", "vendorRole", "vendorUser", "role", "user",
  ].forEach((key) => localStorage.removeItem(key));
};

export default function PortalLoginPage() {
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("role");
  const storedToken = storedRole === "candidate"
    ? localStorage.getItem("candidateToken")
    : storedRole === "vendor" || storedRole === "Vendor"
      ? localStorage.getItem("vendorToken")
      : localStorage.getItem("accessToken");
  const existingDestination = storedRole && storedToken
    ? destinationForStoredRole(storedRole)
    : null;

  const [mode, setMode] = useState("login"); // 'login' | 'otp' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activePortalInfo, setActivePortalInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (mode !== "otp" || resendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setResendIn((remaining) => remaining - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [mode, resendIn]);

  if (existingDestination) return <Navigate to={existingDestination} replace />;

  const completeLogin = (role, dashboard, data) => {
    clearAuthState();
    const normalizedRole = role || data.user?.role || "candidate";

    if (normalizedRole === "candidate" || normalizedRole === "Candidate") {
      localStorage.setItem("candidateToken", data.token);
    } else if (normalizedRole === "vendor" || normalizedRole === "Vendor") {
      localStorage.setItem("vendorToken", data.token);
      if (data.refreshToken) localStorage.setItem("vendorRefreshToken", data.refreshToken);
      localStorage.setItem("vendorRole", "Vendor");
      localStorage.setItem("vendorUser", JSON.stringify(data.user || {}));
    } else {
      localStorage.setItem("accessToken", data.token);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
    }

    localStorage.setItem("role", normalizedRole);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

    setNotice("Signed in successfully. Opening your workspace…");
    const targetDashboard = dashboard || destinationForStoredRole(normalizedRole) || "/";
    window.setTimeout(() => navigate(targetDashboard, { replace: true }), 400);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      // Step 1: Try Unified Login Endpoint
      let response;
      let usedFallback = false;

      try {
        response = await axiosInstance.post("/api/auth/unified-login", {
          email: normalizedEmail,
          password,
        });
      } catch (err) {
        // If the backend has not yet deployed unified-login (returns 404), fallback seamlessly to individual endpoints
        if (err.response?.status === 404) {
          usedFallback = true;
        } else {
          throw err;
        }
      }

      if (usedFallback) {
        let matched = false;
        let specificErrorMsg = "";

        for (const portal of fallbackPortals) {
          try {
            const fbRes = await axiosInstance.post(portal.login, {
              email: normalizedEmail,
              password,
            });
            const fbData = fbRes.data;
            if (fbData?.success && (fbData.requires2FA || fbData.otpSent)) {
              setActivePortalInfo({
                portalRole: portal.role,
                verifyEndpoint: portal.verify,
                resendEndpoint: portal.resend || null,
                dashboard: portal.dashboard,
                canResend: Boolean(portal.resend),
              });
              setMode("otp");
              setResendIn(portal.resend ? 60 : 0);
              setNotice("A verification code has been sent to your email.");
              matched = true;
              return;
            }
            if (fbData?.success && fbData.token) {
              completeLogin(portal.role, portal.dashboard, fbData);
              matched = true;
              return;
            }
          } catch (fbErr) {
            const status = fbErr.response?.status;
            const msg = fbErr.response?.data?.message || "";

            // Agar account suspended, locked ya inactive ka specific message hai to use capture karein
            if (
              msg.toLowerCase().includes("suspended") ||
              msg.toLowerCase().includes("suspend") ||
              msg.toLowerCase().includes("locked") ||
              msg.toLowerCase().includes("inactive") ||
              msg.toLowerCase().includes("not active")
            ) {
              specificErrorMsg = msg;
              break; // user ko clear status dikhayein
            }

            // Normal invalid credentials (401) ya non-matching role continue karega
            if (status && status >= 400 && status < 500) continue;
            console.warn(`[Fallback] Portal ${portal.role} login error:`, fbErr.message);
            continue;
          }
        }
        if (!matched) {
          setError(
            specificErrorMsg ||
            "We couldn’t sign you in with those details. Check them and try again."
          );
        }
        return;
      }

      // Unified Endpoint Response handling
      const data = response.data;
      if (data?.success && (data.requires2FA || data.otpSent)) {
        setActivePortalInfo({
          portalRole: data.portalRole,
          verifyEndpoint: data.verifyEndpoint,
          resendEndpoint: data.resendEndpoint || "/api/auth/unified-resend-otp",
          dashboard: data.dashboard,
          canResend: data.canResend ?? true,
        });
        setMode("otp");
        setResendIn(60);
        setNotice("A verification code has been sent to your email.");
        return;
      }

      if (data?.success && data.token) {
        completeLogin(data.portalRole, data.dashboard, data);
        return;
      }

      setError(data?.message || "Invalid credentials. Please try again.");
    } catch (requestError) {
      const status = requestError.response?.status;
      const serverMsg = requestError.response?.data?.message;

      if (status === 429) {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError(serverMsg || "We couldn’t sign you in with those details. Check them and try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!activePortalInfo || !otp.trim()) {
      setError("Enter the 6-digit verification code from your email.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const endpoint = activePortalInfo.verifyEndpoint || "/api/auth/verify-otp";
      const { data } = await axiosInstance.post(endpoint, {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (!data?.success || !data.token) {
        throw new Error(data?.message || "The verification code could not be verified.");
      }

      completeLogin(activePortalInfo.portalRole, activePortalInfo.dashboard, data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        requestError.message ||
        "The verification code could not be verified."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!activePortalInfo?.canResend || resendIn > 0 || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const endpoint = activePortalInfo.resendEndpoint || "/api/auth/unified-resend-otp";
      const { data } = await axiosInstance.post(endpoint, {
        email: email.trim().toLowerCase(),
      });
      if (!data?.success) throw new Error(data?.message || "Could not resend the code.");
      setResendIn(60);
      setNotice("A new verification code has been sent to your email.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not resend the code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    try {
      let unifiedSuccess = false;
      try {
        const { data } = await axiosInstance.post("/api/auth/unified-forgot-password", {
          email: normalizedEmail,
        });
        if (data?.success) unifiedSuccess = true;
      } catch (err) {
        if (err.response?.status !== 404) throw err;
      }

      if (!unifiedSuccess) {
        // Fallback for older backend
        const forgotEndpoints = [
          "/api/auth/forgot-password",
          "/api/client-admin/auth/forgot-password",
          "/api/hr/auth/forgot-password",
          "/api/vendor/auth/forgot-password",
          "/api/candidate/auth/forgot-password",
        ];
        for (const ep of forgotEndpoints) {
          try {
            const { data } = await axiosInstance.post(ep, { email: normalizedEmail });
            if (data?.success) break;
          } catch (err) {
            if ([400, 401, 404].includes(err.response?.status)) continue;
          }
        }
      }
      setNotice("If an account matches that email, password reset instructions have been sent.");
    } catch {
      setNotice("If an account matches that email, password reset instructions have been sent.");
    } finally {
      setBusy(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-100/40 blur-3xl pointer-events-none -z-0" />

      <section className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200/80 sm:p-10 backdrop-blur-sm">
        {/* Logo / Header Branding */}
        <div className="mb-8 flex items-center gap-3.5">
          {logo ? (
            <img src={logo} alt="HedgeVerify" className="h-11 w-auto object-contain" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-950 text-white shadow-md">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">HedgeVerify</p>
            <p className="text-xs font-medium text-slate-500">Secure workspace access</p>
          </div>
        </div>

        {mode !== "login" && (
          <button
            type="button"
            onClick={() => changeMode("login")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-900 transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to sign in
          </button>
        )}

        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {mode === "otp"
              ? "Verify your email"
              : mode === "forgot"
              ? "Reset your password"
              : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {mode === "otp"
              ? `Enter the 6-digit verification code sent to ${email.trim()}.`
              : mode === "forgot"
              ? "Enter your email and we’ll send reset instructions if an account matches."
              : "Sign in with your email to continue to your portal workspace."}
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3.5 py-2.5 text-sm font-medium text-emerald-800">
            {notice}
          </p>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <div className="relative mt-1.5">
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 pr-11 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => changeMode("forgot")}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-900 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in to Workspace"}
            </button>
          </form>
        )}

        {/* OTP VERIFICATION FORM */}
        {mode === "otp" && (
          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            <label className="block text-sm font-medium text-slate-700">
              Verification code
              <div className="relative mt-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-center text-2xl font-bold tracking-[0.35em] text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-900 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify and Continue"}
            </button>
            {activePortalInfo?.canResend && (
              <button
                type="button"
                onClick={handleResend}
                disabled={busy || resendIn > 0}
                className="w-full text-center text-xs font-semibold text-indigo-700 hover:underline disabled:text-slate-400 disabled:no-underline pt-1"
              >
                {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
              </button>
            )}
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === "forgot" && (
          <form className="mt-6 space-y-4" onSubmit={handleForgotPassword}>
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <div className="relative mt-1.5">
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-900 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send Reset Instructions"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
