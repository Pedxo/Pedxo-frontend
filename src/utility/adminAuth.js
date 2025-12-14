// src/utility/adminAuth.js
const TOKEN_KEY = "pexdo_admin_token";

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch { return null; }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function isAuthenticated() {
  return !!getToken();
}

export const authHeader = () => {
  const token = getToken("pexdo_admin_token"); // use your getToken function
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};


