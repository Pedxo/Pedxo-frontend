import axios from "axios";
import { refreshToken } from "./services/refreshToken";

export const baseURL = "https://pedxo-back-project.onrender.com";
// export const baseURL = 'http://localhost:5000'

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

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    
    const token =
        localStorage.getItem("token") ||
        storedUser?.accessToken;
    
   if (!token) {
      console.warn("No auth token found");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ================= CONTRACT REQUESTS (NEVER CACHE) =================
    if (config.url?.includes("/contracts/") || config.url?.includes("/hire/assigned-by-contract")) {
      config.params = {
        ...config.params,
        _t: Date.now(), // bust cache
      };
      return config;
    }

    // ================= GET CACHE =================
    if (config.method?.toLowerCase() === "get") {
      const cacheKey = JSON.stringify({
        url: config.url,
        params: config.params,
      });

      if (cache.has(cacheKey)) {
        const { timestamp, data } = cache.get(cacheKey);

        // cache valid for 5 minutes
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

// Response interceptor: stores GET responses in cache (only for non-contract endpoints)
authFetch.interceptors.response.use(
  (response) => {

    if (
      !response.config.url?.includes("/contracts/") &&
      response.config.method?.toLowerCase() === "get"
    ) {
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
        error.response.config?.url,
        error.response.data
      );
    } else {
      console.error("Error:", error.message);
    }

    const originalRequest = error.config;

    // ================= HANDLE 401 TOKEN REFRESH =================
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {

        const newAccessToken = await refreshToken();

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return authFetch(originalRequest);

      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // ================= RETRY NETWORK ERRORS =================
    if (
      error.code !== "ECONNABORTED" &&
      !originalRequest._retryNetwork
    ) {
      originalRequest._retryNetwork = true;

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      return authFetch(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Updated to use userId instead of username
export async function getUserContracts(userId) {
  try {
    if (!userId) {
    throw new Error("userId missing when fetching contracts");
    }


    const response = await authFetch.get(
      "/contracts/get-user-contracts",
      {
        params: { userId },
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "getUserContracts failed:",
      error.response?.data || error.message
    );

    throw error;
  }
}

export default authFetch;