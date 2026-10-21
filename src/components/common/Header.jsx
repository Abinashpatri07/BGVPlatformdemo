import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  ChevronUp,
  Bell,
  Eye,
  EyeOff,
  X,
  AlertCircle,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Modal wrapper ─────────────────────────────────────────
function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-400 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

// ── Profile Modal ─────────────────────────────────────────
function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" subtitle="View Your Profile Details" onClose={onClose}>
      <div className="space-y-4">
        {[
          { label: "Name", value: user.name },
          { label: "Mail Id", value: user.email },
          { label: "Phone Number", value: user.phone || "+91 878 241 9830" },
          { label: "Role", value: user.role },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="text-sm text-gray-600 font-medium">{label}</label>
            <input
              readOnly
              value={value}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-[#02027A] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#01016a] transition"
        >
          Okay
        </button>
      </div>
    </Modal>
  );
}

// ── Change Password Modal ─────────────────────────────────
const PasswordField = ({ field, label, placeholder, form, errors, show, onToggle, onChange }) => (
  <div>
    <label className="text-sm text-gray-700 font-medium">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative mt-1">
      <input
        type={show[field] ? "text" : "password"}
        value={form[field]}
        placeholder={placeholder}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full border rounded-lg px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#02027A]/30 ${errors[field] ? "border-red-400" : "border-gray-200"
          }`}
      />
      <button
        type="button"
        onClick={() => onToggle(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
    {errors[field] && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[field]}
      </p>
    )}
  </div>
);

// ── ChangePasswordModal ───────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [errors, setErrors] = useState({});

  const toggle = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.current)
      e.current = "Current password is required.";
    if (form.newPass.length < 8)
      e.newPass = "Password must be at least 8 characters.";
    if (form.confirm !== form.newPass)
      e.confirm = "New password and confirm password do not match.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    // TODO: Connect this to the actual backend change-password endpoint based on role
    alert("Change password backend integration is coming soon!");
    onClose();
  };

  return (
    <Modal title="Password" subtitle="Set and reset your password" onClose={onClose}>
      <div className="space-y-4">
        <PasswordField
          field="current"
          label="Current Password"
          placeholder="Enter Your Current Password"
          form={form}
          errors={errors}
          show={show}
          onToggle={toggle}
          onChange={handleChange}
        />
        <PasswordField
          field="newPass"
          label="New Password"
          placeholder="Enter new password"
          form={form}
          errors={errors}
          show={show}
          onToggle={toggle}
          onChange={handleChange}
        />
        <PasswordField
          field="confirm"
          label="Confirm New Password"
          placeholder="Confirm new password"
          form={form}
          errors={errors}
          show={show}
          onToggle={toggle}
          onChange={handleChange}
        />
      </div>

      <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        <p className="text-xs text-red-500 font-semibold mb-1">Note:</p>
        <p className="text-xs text-red-400">
          Your password must be at least 8 characters long and include a
          combination of letters, numbers, and special characters.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#02027A] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#01016a] transition"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

// ── Main Header ───────────────────────────────────────────
export default function Header() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let storedUser = null;
    const path = location.pathname;

    try {
      if (path.includes("/vendor") || localStorage.getItem("vendorToken")) {
        const vendorData = localStorage.getItem("vendorUser");
        if (vendorData) storedUser = JSON.parse(vendorData);
      } else if (path.includes("/super-admin")) {
        const superAdminData = localStorage.getItem("user");
        if (superAdminData) storedUser = JSON.parse(superAdminData);
      } else {
        const normalUser = localStorage.getItem("user");
        if (normalUser) storedUser = JSON.parse(normalUser);
      }
    } catch (e) {
      console.error("Error loading user in Header:", e);
    }

    if (storedUser) {
      setUser({
        name: storedUser.name || storedUser.fullName || storedUser.poc_name || storedUser.username || "",
        email: storedUser.email || storedUser.poc_email || "",
        role: storedUser.role || (path.includes("/vendor") ? "Vendor" : ""),
        avatar: storedUser.avatar || null,
        phone: storedUser.phone || storedUser.mobile || storedUser.poc_mobile || ""
      });
    }
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openModal = (type) => {
    setModal(type);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);

    const path = window.location.pathname;

    // Determine redirect URL from path first (most reliable)
    let redirectTo = "/";

    if (path.includes("/super-admin")) {
      redirectTo = "/super-admin/login";
    } else if (path.includes("/vendor")) {
      redirectTo = "/vendor/login";
    } else if (path.includes("/hr")) {
      redirectTo = "/hr/login";
    } else if (path.includes("/admin")) {
      redirectTo = "/admin/login";
    } else {
      // Fallback to localStorage role
      const role = localStorage.getItem("role");
      if (role === "super-admin") redirectTo = "/super-admin/login";
      else if (role === "hr") redirectTo = "/hr/login";
      else if (role === "admin" || role === "client_admin") redirectTo = "/admin/login";
      else if (role === "candidate") redirectTo = "/";
    }

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    navigate(redirectTo, { state: { message: "Logout Successful!" } });
  };

  return (
    <>
      <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm z-40 relative">
        {/* LEFT — Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-24 w-auto object-contain" />
        </div>

        {/* Search */}
        <div className="flex ml-auto items-end bg-gray-100 rounded-full px-4 py-2 gap-2 w-72 ">
          <svg
            className="text-gray-800"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>

        {/* RIGHT — Bell + User dropdown */}
        <div className="flex items-center gap-4">
          {/* Bell */}
          <button className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <Bell size={16} className="text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-3 hover:bg-gray-50 px-2 py-1 rounded-xl transition"
            >
              {/* Avatar initials */}
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name || (location.pathname.includes("/vendor") ? "Vendor" : "User"))
                )}
              </div>

              <div className="leading-tight text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>

              {dropdownOpen ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <button
                  onClick={() => openModal("profile")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <User size={15} className="text-gray-400" />
                  Profile
                </button>

                <button
                  onClick={() => openModal("password")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <KeyRound size={15} className="text-gray-400" />
                  Change Password
                </button>

                <hr className="my-1 border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {modal === "profile" && (
        <ProfileModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "password" && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
    </>
  );
}