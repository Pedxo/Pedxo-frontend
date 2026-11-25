import axios from "axios";
import { refreshToken } from "./services/refreshToken";

/* ================= BASE URLS ================= */
export const baseURL = "https://pedxo-back-project.onrender.com";
export const paymentBaseURL = "https://pedxo-pay-702a.onrender.com";


/*=========PAY API KEY==========*/
const PEDXO_API_KEY = import.meta.env.VITE_PEDXO_PAY_SECRET_KEY;

/* ================= CACHE ================= */
const cache = new Map();

/* ===============================================
   AXIOS INSTANCES
================================================== */
const authFetch = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

if(!PEDXO_API_KEY ) {
    console.error("PEDXO PAY API Key is missing");
  }
export const paymentFetch = axios.create({
  baseURL: paymentBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
  timeout: 60000,
});



/* DEBUG */
console.log("Payment Base URL:", paymentFetch.defaults.baseURL);

/* =========================================================
   TOKEN HANDLER
========================================================= */
const attachToken = (config) => {
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

  return config;
};

/* ===========================================
   REQUEST INTERCEPTORS
============================================== */
authFetch.interceptors.request.use((config) => {
  config = attachToken(config);

  // NEVER CACHE CONTRACT REQUESTS
  if (
  config.url?.includes("/contracts/") ||
  config.url?.includes("/hire/assigned-by-contract") ||
  config.url?.includes("/captcha/") ||
  config.baseURL === paymentBaseURL
  ) {
    config.params = { ...config.params, _t: Date.now() };
    return config;
  }
  

  // GET CACHE
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
});


paymentFetch.interceptors.request.use((config) => {
  const cleanKey = PEDXO_API_KEY?.trim();

  if (!cleanKey) {
    console.error("❌ Missing API Key");
    throw new Error("Missing API Key");
  }

  /* IMPORTANT: USE AUTHORIZATION HEADER (BACKEND EXPECTS THIS) */
  config.headers.Authorization = `Bearer ${cleanKey}`;

  /*  DO NOT SEND USER TOKEN TO PAYMENT SERVICE */
  delete config.headers["x-api-key"];

  /* debug */
  console.log("➡️ Payment Request:", {
    url: config.url,
    hasKey: !!cleanKey,
  });


  return config;
});


/* =================================================
   RESPONSE INTERCEPTORS (MAIN BACKEND)
==================================================== */
authFetch.interceptors.response.use(
  (response) => {
    // CACHE GET RESPONSES
    if (
      !response.config.url?.includes("/contracts/") &&
      response.config.method?.toLowerCase() === "get" &&
      !response.config.url?.includes("/captcha/")
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
    if (error.isCached) return Promise.resolve(error.response);

    // ERROR LOGGING
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

    /* ===== TOKEN REFRESH ===== */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authFetch(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    /* ===== NETWORK RETRY ===== */
    if (error.code !== "ECONNABORTED" && !originalRequest._retryNetwork) {
      originalRequest._retryNetwork = true;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return authFetch(originalRequest);
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   RESPONSE INTERCEPTOR (PAYMENT SERVICE)
========================================================= */
paymentFetch.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response) {
      console.error(
        "Payment Error:",
        error.response.status,
        error.response.config?.url,
        error.response.data
      );
    } else {
      console.error("Payment Error:", error.message);
    }

    const originalRequest = error.config;

    /* RETRY NETWORK */
    if (error.code !== "ECONNABORTED" && !originalRequest._retryNetwork) {
      originalRequest._retryNetwork = true;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return paymentFetch(originalRequest);
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   AUTO CREATE PAYMENT USER + ACCOUNT
========================================================= */

export const initializePaymentAccount = async (user) => {
  try {
    if (!user?.email) return;

    console.log("Initializing payment account for:", user.email);

    /* ================= STEP 1: FETCH ACCOUNT USING EMAIL ================= */

    try {
      const res = await paymentFetch.get(
        `/account/users/${encodeURIComponent(user.email)}`
      );

      console.log("Get existing account:", res);

      const responseData = res?.data;
      const matchedUser = responseData?.data || responseData;

      if (matchedUser && matchedUser.accounts?.length) {
        const bestAccount = matchedUser.accounts.reduce((prev, current) => {
          return Number(current.balance) > Number(prev.balance)
            ? current
            : prev;
        });

        const accountNumber = bestAccount.account_number;
        console.log("Selected Best Account:", accountNumber);
        localStorage.setItem("accountNumber", accountNumber);
        return accountNumber;
      }
    } catch (err) {
      if (err?.response?.status !== 404) {
        console.warn("User lookup error:", err?.response?.data || err.message);
      }
    }

    console.log("No account found for email, creating user...");

    /* ================= STEP 2: CREATE USER IF ACCOUNT NOT FOUND ================= */

    const fullName = user.userName || "User Default";

    const [first_name, ...rest] = fullName.split(" ");
    const last_name = rest.join(" ") || "User";

    await paymentFetch.post("/account", {
      email: user.email,
      first_name,
      last_name,
      currency: "NGN",
    });

    console.log("Payment user created");

    const userRes = await paymentFetch.get(
      `/account/users/${encodeURIComponent(user.email)}`
    );

    const newUserData = userRes?.data?.data || userRes?.data;
    const userId = newUserData?.id;

    if (!userId) {
      console.error("User ID missing from:", newUserData);
      throw new Error("User ID not found");
    }

    /* ================= STEP 3: CREATE ACCOUNT ================= */

    const accountRes = await paymentFetch.post("/account/account", {
      account_name: fullName,
      currency: "NGN",
      type: "saving",
      user_id: Number(userId),
    });

    const newAccount =
      accountRes?.data?.account_number ||
      accountRes?.data?.data?.account_number;

    console.log("New account created:", newAccount);

    localStorage.setItem("accountNumber", newAccount);

    return newAccount;

  } catch (err) {
    console.error(
      "Payment Init Error:",
      err?.response?.data || err.message
    );
  }
};

export const getUserAccountNumber = async (email) => {
  if (!email) throw new Error("Missing user email");

  const res = await paymentFetch.get(
    `/account/users/${encodeURIComponent(email)}`
  );
  const responseData = res?.data;
  const payload = responseData?.data || responseData;
  const users = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
      ? payload
      : [payload];
  const accountUser =
    users.find((item) => item?.email === email) || users[0];
  const accounts = Array.isArray(accountUser?.accounts)
    ? accountUser.accounts
    : [];
  const bestAccount = accounts.reduce((best, account) => {
    if (!best || Number(account.balance) > Number(best.balance)) return account;
    return best;
  }, null);
  const accountNumber =
    accountUser?.account_number || bestAccount?.account_number;

  if (!accountNumber) {
    throw new Error(`Account number not found for ${email}`);
  }

  localStorage.setItem("accountNumber", accountNumber);
  return accountNumber;
};

/* =========================================================
   MAIN BACKEND APIs
========================================================= */
export const getUserContracts = async (userId) => {
  if (!userId) throw new Error("userId missing");

  const res = await authFetch.get("/contracts/get-user-contracts", {
    params: { userId },
  });

  return res.data;
};

/* =========================================================
   PAYMENT APIs
========================================================= */

export const getUserBalance = async (accountNumber) => {
  if (!accountNumber) throw new Error("Missing account number");

  try {
    const res = await paymentFetch.get(`/account/balance/${accountNumber}`);
    return res?.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      console.warn("Account not found. Resetting account.");

      localStorage.removeItem("accountNumber");

      throw new Error("ACCOUNT_NOT_FOUND");
    }

    throw error;
  }
};


export const getUserTransactions = async (accountNumber) => {
  if (!accountNumber) throw new Error("Missing account number");

  const res = await paymentFetch.get(`/transaction/${accountNumber}`);
  return res?.data;
};

export const getUserAccountSummary = async (accountNumber) => {
  if (!accountNumber) throw new Error("Missing account number");

  const res = await paymentFetch.get(
    `/transaction/user-account-summary/${accountNumber}`
  );
  return res?.data;
};



export const depositFunds = async (payload) => {
  const res = await paymentFetch.post("/transaction/deposit", payload);
  return res.data;
};

export const payoutFunds = async (payload) => {
  const res = await paymentFetch.post("/transaction/payout", payload);
  return res.data;
};

export const reverseTransaction = async (payload) => {
  const res = await paymentFetch.post("/transaction/reverse", payload);
  return res.data;
};

export const getTransactionSummary = async () => {
  const res = await paymentFetch.get("/transaction/summary");
  return res.data;
};

export default authFetch;