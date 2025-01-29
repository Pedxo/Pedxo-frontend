import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const username = user?.userName;
  const email = user?.email;

  return (
    <UserContext.Provider value={{ user, username, email }}>
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
