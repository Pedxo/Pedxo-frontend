import axios from "axios";

export const baseURL = "https://pedxo-back-project.onrender.com";

// Simple in-memory cache for GET requests
const cache = new Map();

const authFetch = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor: adds auth token and handles caching
authFetch.interceptors.request.use(
  (config) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.accessToken;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method?.toLowerCase() === "get") {
      const cacheKey = JSON.stringify({
        url: config.url,
        params: config.params,
      });

      if (cache.has(cacheKey)) {
        const { timestamp, data } = cache.get(cacheKey);
        if (Date.now() - timestamp < 300000) {
          return Promise.reject({
            response: { data },
            config,
            isCached: true,
          });
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: stores GET responses in cache and handles retries
authFetch.interceptors.response.use(
  (response) => {
    if (response.config.method?.toLowerCase() === "get") {
      const cacheKey = JSON.stringify({
        url: response.config.url,
        params: response.config.params,
      });
      cache.set(cacheKey, {
        timestamp: Date.now(),
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    if (error.isCached) {
      return Promise.resolve(error.response);
    }

    if (error.response) {
      console.error(
        "Error Response:",
        error.response.status,
        error.response.config.url,
        error.response.data
      );
    } else {
      console.error("Error:", error.message);
    }

    const originalRequest = error.config;
    if (error.code !== "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return authFetch(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Updated to use userId instead of username
export async function getUserContracts(userId) {
  try {
    const response = await authFetch.get("/contracts/get-user-contracts", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("getUserContracts failed:", error.response?.data || error.message);
    throw error;
  }
}

export default authFetch;