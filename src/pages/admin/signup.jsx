// src/pages/admin/signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminSignup } from "../../utility/adminApi.js";
import { Mail, Lock, Eye, EyeOff, User, KeyRound, Shield } from "lucide-react";

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "super-admin", // matches your backend sample
    signupKey: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!form.signupKey.trim()) return "Admin signup key is required.";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }

    setLoading(true);
    const res = await adminSignup({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,           // e.g. "super-admin"
      signupKey: form.signupKey, // e.g. "ABCD1234KEY"
    });
    setLoading(false);

    if (!res.ok) {
      setMsg({ type: "error", text: res.error || "Signup failed." });
      return;
    }

    setMsg({ type: "success", text: "Signup successful. Please sign in." });
    // brief delay so the success message can flash (optional)
    setTimeout(() => navigate("/admin/login"), 600);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-black rounded-2xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-black">Create Admin Account</h1>
          <p className="mt-2 text-gray-600">Register for admin access to Pexdo</p>
        </div>

        {msg.text && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
              msg.type === "error"
                ? "border-red-300 text-red-700 bg-red-50"
                : "border-green-300 text-green-700 bg-green-50"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-black">First Name</span>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={onChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-black">Last Name</span>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={onChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                />
              </div>
            </label>
          </div>

          {/* Email */}
          <label className="block">
            <span className="text-sm font-semibold text-black">Email Address</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={onChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                autoComplete="email"
              />
            </div>
          </label>

          {/* Passwords */}
          <label className="block">
            <span className="text-sm font-semibold text-black">Password</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={onChange}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-2.5 p-1 rounded hover:bg-gray-100"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-black">Confirm Password</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPwd2 ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={onChange}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd2((s) => !s)}
                className="absolute right-3 top-2.5 p-1 rounded hover:bg-gray-100"
              >
                {showPwd2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {/* Signup Key */}
          <label className="block">
            <span className="text-sm font-semibold text-black">Admin Signup Key</span>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="signupKey"
                placeholder="Enter admin signup key"
                value={form.signupKey}
                onChange={onChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Contact your supervisor for the admin signup key
            </p>
          </label>

          {/* Role (hidden/default or selectable) */}
          <div className="hidden">
            <select name="role" value={form.role} onChange={onChange}>
              <option value="super-admin">super-admin</option>
              <option value="admin">admin</option>
            </select>
          </div>

          {/* Terms */}
          <label className="inline-flex items-center gap-2 text-sm text-black">
            <input type="checkbox" className="rounded border-gray-300" required /> I agree to the{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/admin/login" className="underline text-black">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
