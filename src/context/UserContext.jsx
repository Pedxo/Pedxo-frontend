import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../services/apiAuth";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("user");
      }
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
    }
  };

  /* ================= DERIVED VALUES ================= */

  const username = user?.userName || "";
  const email = user?.email || "";

  return (
    <UserContext.Provider
      value={{ user, username, email, login, logout }}
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