/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const SideBarContext = createContext(null);

// context/SideBarContext.js
const SideBarProvider = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);

  return (
    <SideBarContext.Provider value={{
      mobileNavOpen,
      setMobileNavOpen,
      desktopNavOpen, 
      setDesktopNavOpen
    }}>
      {children}
    </SideBarContext.Provider>
  );
};
// Add this to prevent memory leaks
function useNavBar() {
  const context = useContext(SideBarContext);
  if (!context) throw new Error("Context used outside its Provider");
  return context;
}

export { useNavBar, SideBarProvider };
