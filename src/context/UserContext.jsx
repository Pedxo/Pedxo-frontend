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

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

 // Update the logout function to be more thorough
const logout = async () => {
  try {
    await logoutUser(); // Use the API logout function
    setUser(null);
    // Storage is already cleared by logoutUser()
  } catch (error) {
    console.error("Logout error:", error);
    // Force cleanup anyway
    setUser(null);
    localStorage.removeItem("user");
  }
};

  // Use consistent naming (either username or userName)
  const username = user?.userName || '';
  const email = user?.email || '';


  return (
    <UserContext.Provider value={{ user, username, email, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("Context used outside Provider");
  return context;
}

export { useUser, UserProvider };