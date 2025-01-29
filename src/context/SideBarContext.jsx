import { createContext, useContext, useState } from "react";

const SideBarContext = createContext(null);

function SideBarProvider({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <SideBarContext.Provider
      value={{
        navOpen,
        setNavOpen,
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
}

function useNavBar() {
  const context = useContext(SideBarContext);
  if (!context) throw new Error("Context used outside its Provider");
  return context;
}

export { useNavBar, SideBarProvider };
