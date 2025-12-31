import axios from "axios";

export const baseURL = "https://pedxo-back-project.onrender.com";

// Request cache - works in browser
const cache = new Map();

const authFetch = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    // "Accept-Encoding": "gzip, deflate, br",
  },
  timeout: 30000,
});

// Request interceptor for auth token
authFetch.interceptors.request.use(
  (config) => {
    // console.log('Request:', config.method?.toUpperCase(), config.url);

    // Add authorization token if available
    if (!config.headers.Authorization) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Cache GET requests (browser-only implementation)
    if (config.method?.toLowerCase() === "get") {
      const cacheKey = JSON.stringify({
        url: config.url,
        params: config.params,
      });

      if (cache.has(cacheKey)) {
        const { timestamp, data } = cache.get(cacheKey);
        if (Date.now() - timestamp < 300000) {
          // 5 minute cache
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
authFetch.interceptors.response.use(
  (response) => {
    // console.log('Response:', response.status, response.config.url);

    // Cache successful GET responses
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
        error.response.config.url
      );
    } else {
      console.error("Error:", error.message);
    }

    // Retry logic for failed requests
    const originalRequest = error.config;
    if (error.code !== "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return authFetch(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default authFetch;
