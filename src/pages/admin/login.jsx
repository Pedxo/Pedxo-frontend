// src/pages/admin/login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../utility/adminApi.js";
import { setToken } from "../../utility/adminAuth.js";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { getToken } from "../../utility/adminAuth.js";



export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [form, setForm] = useState({ email: "", password: "" });
  
  useEffect(() => {
    if (getToken()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);
  
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!form.email || !form.password) {
      setMsg({ type: "error", text: "Email and password are required." });
      return;
    }

    setLoading(true);
    const res = await adminLogin({ email: form.email.trim(), password: form.password });
    setLoading(false);

    if (!res.ok) {
      setMsg({ type: "error", text: res.error || "Login failed." });
      return;
    }

    // Expect: { token, admin }
    const token = res.data?.token || null;
    const admin = res.data?.admin || null;

    if (!token) {
      setMsg({ type: "error", text: "No token returned from server." });
      return;
    }

    if (res.data?.token) {
  setToken(res.data.token); // saves to "pexdo_admin_token"
  }
  setMsg({ type: "success", text: "Welcome back." });
    navigate("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-black rounded-2xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-black">Admin Portal</h1>
          <p className="mt-2 text-gray-600">Sign in to your admin dashboard</p>
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

          <label className="block">
            <span className="text-sm font-semibold text-black">Password</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-2.5 p-1 rounded hover:bg-gray-100"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-black">
              <input type="checkbox" className="rounded border-gray-300" /> Remember me
            </label>
            <a className="text-sm underline text-black" href="#">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an admin account?{" "}
          <Link to="/admin/signup" className="underline text-black">
            Request Access
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Pexdo. Admin Portal v1.0
        </p>
      </div>
    </div>
  );
}
