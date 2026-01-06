// src/utility/adminApi.js
import axios from "axios";
import { authHeader } from "./adminAuth.js";

// ---------- DEPLOYED BACKEND ----------
const BASE_URL = "https://pedxo-back-project.onrender.com";

// Axios instance for all admin API calls
export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach Bearer token automatically
http.interceptors.request.use((config) => {
  const tokenHeader = authHeader();
  if (tokenHeader) {
    config.headers = { ...config.headers, ...tokenHeader };
  }
  return config;
});

// Centralized error normalization
function normalizeError(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data?.error) return err.response.data.error;
  if (err.message) return err.message;
  return "Unexpected error";
}

// ---------- ADMIN AUTH ----------
export async function adminSignup({ firstName, lastName, email, password, role, signupKey }) {
  try {
    const res = await http.post("/admin/signup", { firstName, lastName, email, password, role, signupKey });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: normalizeError(err) };
  }
}

export async function adminLogin({ email, password }) {
  try {
    const res = await http.post("/admin/login", { email, password });
    return {
      ok: !res.data.error,
      data: res.data.data,
      error: res.data.message || null
    };
  } catch (err) {
    return { ok: false, error: normalizeError(err) };
  }
}

// ---------- CONTRACTS / HIRES ----------
export const listContracts = async () => {
  try {
    const res = await http.get("/contracts/get-all-contract");
    return res.data?.data || res.data || [];
  } catch (err) {
    console.error("Error fetching contracts:", err.message);
    return [];
  }
};

export const createContract = async (contractData) => {
  try {
    const res = await http.post("/api/v1/hire", contractData);
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: normalizeError(err) };
  }
};

// ---------- DEVELOPERS / TALENTS ----------
export const listDevelopers = async () => {
  try {
    const res = await http.get("/talent/get-all-talents");
    return res.data?.data || res.data || [];
  } catch (err) {
    console.error("Error fetching developers:", err.message);
    return [];
  }
};

// ---------- ASSIGNMENT ----------
// src/utility/adminApi.js
export const assignDeveloper = async (talentIds, contractId) => {
  try {
    // Basic validation / normalization
    if (!talentIds || (Array.isArray(talentIds) && talentIds.length === 0)) {
      return { ok: false, error: "No talentIds provided" };
    }
    const tIds = Array.isArray(talentIds) ? talentIds.map(String) : [String(talentIds)];
    const payload = { talentIds: tIds, contractId: String(contractId) };

    const res = await http.patch("/admin/assign-talent", payload);

    // treat 2xx as success
    if (res && res.status >= 200 && res.status < 300) {
      return { ok: true, data: res.data };
    }

    // fallback normalization
    return { ok: false, error: res?.data?.message || "Assignment failed" };
  } catch (err) {
    console.error("Error assigning developer:", err);
    return { ok: false, error: normalizeError(err) };
  }
};



export const listHires = async () => {
  try {
    const res = await http.get("/hire/get-all-hires");
    return res.data?.data || res.data || [];
  } catch (err) {
    console.error("Error fetching hires:", err.message);
    return [];
  }
};



// ---------- ADMIN PROFILE & PASSWORD ----------
export const getAdminProfile = async () => {
  try {
    const res = await http.get("/admin/profile");
    return { ok: true, data: res.data?.data || res.data };
  } catch (err) {
    return { ok: false, error: "Feature not available yet" };
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const res = await http.put("/admin/profile", profileData);
    return { ok: true, data: res.data?.data || res.data };
  } catch (err) {
    return { ok: false, error: "Feature not available yet" };
  }
};

export const changePassword = async (data) => {
  try {
    const res = await http.post("/admin/change-password", data);
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: "Feature not available yet" };
  }
};

// ---------- NOTIFICATIONS ----------
export const getNotifications = async () => {
  try {
    const res = await http.get("/admin/notifications");
    return {
      ok: true,
      data: res.data?.data || res.data,
      notifications: res.data?.data?.notifications || res.data?.notifications || [],
      unreadCount: res.data?.data?.unreadCount || res.data?.unreadCount || 0
    };
  } catch (err) {
    return { ok: false, error: "Feature not available yet", data: { notifications: [], unreadCount: 0 } };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await http.put(`/admin/notifications/${notificationId}/read`);
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: "Feature not available yet" };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const res = await http.delete(`/admin/notifications/${notificationId}`);
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: "Feature not available yet" };
  }
};
export async function clearAllNotifications() {
  try {
    const res = await fetch("/notifications/clear", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to clear notifications");
    return await res.json();
  } catch (err) {
    console.error("Error clearing notifications:", err);
    throw err;
  }
}
export async function markAllNotificationsAsRead() {
  try {
    const res = await fetch("/notifications/mark-all-read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to mark notifications as read");
    return await res.json();
  } catch (err) {
    console.error("Error marking notifications:", err);
    throw err;
  }
}



// ---------- STATISTICS ----------
export const getStats = async () => {
  try {
    const res = await http.get("/admin/stats");
    return res.data?.data || {
      totalContracts: 0,
      totalDevelopers: 0,
      pendingAssignments: 0,
      completedProjects: 0,
      activeProjects: 0,
      message: "Loading statistics..."
    };
  } catch (err) {
    // Fallback stats
    try {
      const [contracts, developers] = await Promise.all([listContracts(), listDevelopers()]);
      return {
        totalContracts: contracts.length,
        totalDevelopers: developers.length,
        pendingAssignments: contracts.filter(c => !c.assignedDeveloper && !c.talentId && !c.developerId).length,
        completedProjects: contracts.filter(c => c.status === "completed").length,
        activeProjects: contracts.filter(c => c.status === "active" || c.status === "in_progress").length,
        message: "Stats calculated from available data"
      };
    } catch {
      return { totalContracts: 0, totalDevelopers: 0, pendingAssignments: 0, completedProjects: 0, activeProjects: 0, message: "Stats unavailable" };
    }
  }
};

// ---------- HELPERS ----------
export const getPendingContracts = async () => {
  const contracts = await listContracts();
  return contracts.filter(c => !c.assignedDeveloper && !c.talentId && !c.developerId);
};

export const getAvailableDevelopers = async () => {
  const developers = await listDevelopers();
  return developers.filter(dev => dev.status === "available" || !dev.currentProject);
};

export const createSystemNotification = async (type, message, priority = "medium", actionUrl = null) => {
  const notificationData = {
    title: getNotificationTitle(type),
    message,
    type,
    priority,
    actionUrl,
    actionText: getActionText(type)
  };
  return await http.post("/admin/notifications", notificationData);
};

const getNotificationTitle = (type) => {
  const titles = {
    assignment: "Developer Assignment",
    contract: "New Contract",
    system: "System Update",
    warning: "System Warning",
    success: "Action Completed"
  };
  return titles[type] || "Notification";
};

const getActionText = (type) => {
  const actionTexts = {
    assignment: "View Assignment",
    contract: "View Contract",
    system: "View Details",
    warning: "View Issue",
    success: "View Result"
  };
  return actionTexts[type] || "View Details";
};


