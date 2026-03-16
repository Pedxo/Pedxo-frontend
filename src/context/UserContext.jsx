import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../services/apiAuth";
import authFetch from "../api";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

 
useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (!storedUser) return;

  try {

    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);

    if (parsedUser?.accessToken) {

      authFetch.defaults.headers.common.Authorization =
        `Bearer ${parsedUser.accessToken}`;

    }

  } catch (err) {

    localStorage.removeItem("user");

  }

}, []);

/* ================= LOGIN ================= */

    const login = (userData) => {
    if (!userData?.accessToken) {
      throw new Error("Invalid login payload");
    }

    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.accessToken);

    if (userData.refreshToken) {
      localStorage.setItem("refreshToken", userData.refreshToken);
    }

    authFetch.defaults.headers.common.Authorization =
      `Bearer ${userData.accessToken}`;
  };


  /* ================= LOGOUT ================= */

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      delete authFetch.defaults.headers.common.Authorization;
    }
  };

  /* ================= DERIVED VALUES ================= */

  const username = user?.userName || "";
  const email = user?.email || "";
  const userId = user?._id || user?.userId || user?.id || null;
  

  return (
    <UserContext.Provider
      value={{ user, username, email, login, logout, userId }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Context used outside Provider");
  }

  return context;
}

export { useUser, UserProvider };