import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../services/apiAuth";
import authFetch from "../api";

const UserContext = createContext(null);

function UserProvider({ children }) {

  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {

    try {

      const storedUser = localStorage.getItem("user");

      if (storedUser) {

        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        if (parsedUser?.accessToken) {
          authFetch.defaults.headers.common.Authorization =
            `Bearer ${parsedUser.accessToken}`;
        }

      }

    } catch (err) {

      console.error("User restore failed", err);
      localStorage.removeItem("user");

    } finally {

      setInitialized(true);

    }

  }, []);

  /* ================= LOGIN ================= */

  const login = (userData) => {

    if (!userData?.accessToken) {
      console.warn("Login attempted without accessToken");
      return;
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

  const username = user?.userName || "";
  const email = user?.email || "";
  const userId = user?._id || user?.userId || user?.id || null;

  return (
    <UserContext.Provider
      value={{
        user,
        username,
        email,
        login,
        logout,
        userId,
        initialized
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* SAFE HOOK */

function useUser() {

  const context = useContext(UserContext);

  if (!context) {

    return {
      user: null,
      username: "",
      email: "",
      userId: null,
      login: () => {},
      logout: () => {},
      initialized: false
    };

  }

  return context;
}

export { useUser, UserProvider };