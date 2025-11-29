// src/components/admin/common/AdminLayout.jsx
import { useState, useEffect, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import { Bell, Menu, Key, X, Copy, Settings } from "lucide-react";
import { useNotifications } from "../../../utility/notificationBus.jsx";
import { getToken } from "../../../utility/adminAuth.js";
import { useNavigate } from "react-router-dom";
import { http } from "../../../utility/adminApi.js"; // Axios instance (optional)

function relativeTime(ts) {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function AdminLayout({ title = "Admin", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // notifications from your notificationBus (if available)
  const {
    unreadCount = 0,
    notifications = [],
    markAllRead = () => {},
    markAsRead = () => {},
    clearNotification = () => {},
  } = useNotifications() || {};

  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  // ===== TOKEN MODAL STATE =====
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [copied, setCopied] = useState(false);
  const tokenRefreshRef = useRef(null);

  // ===== NOTIFICATION FETCH FALLBACK (if notificationBus or backend missing) =====
  const [localNotifications, setLocalNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

  // CHECK ADMIN AUTH
  useEffect(() => {
    const token = getToken();
    if (!token) navigate("/admin/login");
  }, [navigate]);

  // Fetch notifications from backend optionally — if http or endpoint missing, fallback to notificationBus or local mock
  const fetchNotifications = async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      if (http) {
        const res = await http.get("/admin/notifications"); // try your API
        // expect array of { id, message, time, read }
        setLocalNotifications(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error("No http client");
      }
    } catch (err) {
      // fallback: use notificationBus notifications if available
      if (notifications && notifications.length) {
        setLocalNotifications(notifications);
      } else {
        // final fallback: lightweight mocked notifications so UI remains functional
        setLocalNotifications((prev) =>
          prev.length ? prev : [
            { id: "mock-1", message: "Welcome to admin — token ready.", time: new Date().toISOString(), read: false },
            { id: "mock-2", message: "No notifications endpoint — using local mode.", time: new Date().toISOString(), read: false },
          ]
        );
        setNotifError("Using local notifications (endpoint unavailable).");
      }
    } finally {
      setNotifLoading(false);
    }
  };

  // close panel on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (!panelOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target) && bellRef.current && !bellRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [panelOpen]);

  const handleNotificationClick = async () => {
    const willOpen = !panelOpen;
    setPanelOpen(willOpen);
    if (willOpen) {
      // show freshest notifications when opened
      await fetchNotifications();
      // try to mark all read from bus (non-blocking)
      try { markAllRead(); } catch (e) { /* ignore */ }
    }
  };

  const handleMarkRead = (id) => {
    // try bus first, then local fallback
    try { markAsRead(id); } catch (e) { }
    setLocalNotifications((prev) => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleClear = (id) => {
    try { clearNotification(id); } catch (e) { }
    setLocalNotifications((prev) => prev.filter(n => n.id !== id));
  };

  // ===== TOKEN FETCHING =====
  const fetchToken = async () => {
    setTokenLoading(true);
    setTokenError(null);
    try {
      if (!http) throw new Error("No http client configured");
      const res = await http.post("/admin/generate-token");
      setTokenData({
        token: res.data?.token ?? "",
        expiresIn: res.data?.expiresIn ?? "unknown",
        fetchedAt: Date.now(),
      });
    } catch (err) {
      console.error("Token fetch error:", err);
      setTokenError("Unable to fetch token. Try again later.");
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

    fetchToken(); // immediate
    tokenRefreshRef.current = setInterval(fetchToken, 20 * 60 * 1000); // every 20 minutes

    const handleEsc = (e) => {
      if (e.key === "Escape") setTokenModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      if (tokenRefreshRef.current) clearInterval(tokenRefreshRef.current);
      window.removeEventListener("keydown", handleEsc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Keyboard: close notification panel on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        setTokenModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:translate-x-0`}
      >
        <AdminSidebar close={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className={`${sidebarOpen ? "lg:pl-64" : ""} transition-all`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-black">{title}</h1>
            </div>

            <div className="flex items-center gap-2 relative">
              {/* Notification Bell */}
              <button
                ref={bellRef}
                className="notification-bell p-2 rounded-md hover:bg-gray-100 relative transition-colors"
                onClick={handleNotificationClick}
                aria-haspopup="dialog"
                aria-expanded={panelOpen}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {(unreadCount || localNotifications.filter(n => !n.read).length) > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount || localNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Token / Developer Key */}
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={openTokenModal}
                aria-label="Generate developer token"
                title="Developer submission token"
              >
                <Key className="h-5 w-5 text-gray-700" />
              </button>

              {/* Admin Avatar */}
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center ml-1">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Notification Panel */}
      {panelOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className="fixed right-4 top-20 z-[60] w-[360px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="font-semibold text-black">Notifications</p>
              <p className="text-xs text-gray-500">{notifError ? "Using local data" : `${localNotifications.length} recent`}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-xs text-gray-600 hover:underline"
                onClick={() => {
                  fetchNotifications();
                }}
                aria-label="Refresh notifications"
              >
                Refresh
              </button>
              <button
                className="text-xs text-gray-600 hover:underline"
                onClick={() => {
                  // clear notifications locally and via bus if available
                  try { localNotifications.forEach(n => clearNotification(n.id)); } catch (e) { }
                  setLocalNotifications([]);
                }}
                aria-label="Clear all notifications"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-auto divide-y divide-gray-100">
            {notifLoading ? (
              <div className="p-6 text-center text-sm text-gray-600">Loading…</div>
            ) : localNotifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-600">No notifications</div>
            ) : (
              localNotifications.map((n) => (
                <div key={n.id} className="p-4 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${n.read ? "text-gray-500" : "text-black font-medium"}`}>{n.message}</p>
                      <div className="text-xs text-gray-400">{relativeTime(n.time)}</div>
                    </div>
                    {n.meta && <div className="text-xs text-gray-500 mt-1">{n.meta}</div>}
                    <div className="flex items-center gap-2 mt-3">
                      {!n.read && (
                        <button
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleMarkRead(n.id)}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        onClick={() => handleClear(n.id)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===== Token Modal ===== */}
      {tokenModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setTokenModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
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
