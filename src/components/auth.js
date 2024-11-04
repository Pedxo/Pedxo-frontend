import axios from "axios";

const authFetch = axios.create({
  baseURL: "https://pedxo-backend-p7se.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default authFetch;

