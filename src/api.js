import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const authFetch = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authFetch;

authFetch.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
