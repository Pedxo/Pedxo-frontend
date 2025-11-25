// src/components/admin/common/AdminLayout.jsx
import { useState, useEffect, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import { Bell, Menu, Key, X, Copy } from "lucide-react"; 
import { useNotifications } from "../../../utility/notificationBus.jsx";
import { getToken } from "../../../utility/adminAuth.js";
import { useNavigate } from "react-router-dom";
import { http } from "../../../utility/adminApi.js"; // Axios instance
// import { http } from "../../../utility/adminApi.js"; 

export default function AdminLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { unreadCount, notifications, markAllRead, markAsRead, clearNotification } = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  // ===== TOKEN MODAL STATE =====
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [tokenData, setTokenData] = useState(null); 
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [copied, setCopied] = useState(false);
  const tokenRefreshRef = useRef(null);

  // CHECK ADMIN AUTH
  useEffect(() => {
    const token = getToken();
    if (!token) navigate("/admin/login");
  }, [navigate]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelOpen && !event.target.closest('.notification-panel') && !event.target.closest('.notification-bell')) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [panelOpen]);

  const handleNotificationClick = () => {
    setPanelOpen(!panelOpen);
    if (!panelOpen) markAllRead();
  };

  // ===== TOKEN FETCHING =====

const fetchToken = async () => {
  setTokenLoading(true);
  setTokenError(null);
  try {
    const res = await http.post("/admin/generate-token"); // uses correct backend URL
    setTokenData({
      token: res.data.token,
      expiresIn: res.data.expiresIn,
      fetchedAt: Date.now(),
    });
  } catch (err) {
    console.error("Token fetch error:", err);
    setTokenError("Unable to fetch token. Try again.");
    setTokenData(null);
  } finally {
    setTokenLoading(false);
  }
};


  const openTokenModal = () => setTokenModalOpen(true);

  // Auto-refresh token when modal is open
  useEffect(() => {
    if (!tokenModalOpen) {
      if (tokenRefreshRef.current) clearInterval(tokenRefreshRef.current);
      return;
    }

    fetchToken(); // Fetch immediately on open

    tokenRefreshRef.current = setInterval(() => {
      fetchToken();
    }, 20 * 60 * 1000); // Every 20 minutes

    // Close modal on ESC
    const handleEsc = (e) => {
      if (e.key === "Escape") setTokenModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      if (tokenRefreshRef.current) clearInterval(tokenRefreshRef.current);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [tokenModalOpen]);

  // Copy token to clipboard
  const handleCopy = async () => {
    if (!tokenData?.token) return;
    try {
      await navigator.clipboard.writeText(tokenData.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform lg:translate-x-0`}>
        <AdminSidebar close={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className={`${sidebarOpen ? "lg:pl-64" : ""} transition-all`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-black">{title}</h1>
            </div>

            <div className="flex items-center gap-2 relative">
              {/* Notification Bell */}
              <button
                className="notification-bell p-2 rounded-md hover:bg-gray-100 relative transition-colors"
                onClick={handleNotificationClick}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Developer Token */}
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={openTokenModal}
                aria-label="Generate developer token"
              >
                <Key className="h-5 w-5 text-gray-700" />
              </button>

              {/* Admin Avatar */}
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* ===== Token Modal ===== */}
      {tokenModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setTokenModalOpen(false)} aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Developer Submission Token</h3>
                <p className="text-xs text-gray-500 mt-1">Copy and share with a developer so they can submit the form.</p>
              </div>
              <button onClick={() => setTokenModalOpen(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              {tokenLoading ? (
                <div className="p-6 text-center">Fetching token…</div>
              ) : tokenError ? (
                <div className="p-4 rounded-md bg-red-50 text-red-700 text-sm">{tokenError}</div>
              ) : tokenData?.token ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded px-4 py-3 break-all select-all cursor-text">
                    <code className="text-sm font-mono">{tokenData.token}</code>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-600">
                      Expires: <span className="font-medium text-gray-800">{tokenData.expiresIn}</span>
                      <span className="ml-2 text-[11px] text-gray-400">· fetched {new Date(tokenData.fetchedAt).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded bg-black text-white text-sm hover:bg-gray-900">
                        <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
                      </button>
                      <button onClick={fetchToken} className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50">Refresh</button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    The token regenerates periodically. Refresh if it stops working.
                  </div>
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-600">No token available. Click refresh to try again.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
