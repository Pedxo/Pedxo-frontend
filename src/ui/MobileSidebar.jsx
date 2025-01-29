import { useState } from "react";
import { useNavBar } from "../context/SideBarContext";
import Logo from "./Logo";
import { useUser } from "../context/UserContext";
import NavBar from "./NavBar";
import { useOutsideClick } from "../hooks/useOutsideClick";
import Button from "./Button";
import { useLogout } from "../features/auth/useLogout";

function MobileSidebar() {
  const { username, email } = useUser();
  const { navOpen, setNavOpen } = useNavBar();
  const [toggleLogout, setToggleLogout] = useState(false);
    const { logout } = useLogout();

  const closeSidebar = () => setNavOpen(false);

  const navRef = useOutsideClick(closeSidebar);

  return (
    <section
      className={`w-full fixed inset-0 z-50 h-screen flex items-center overflow-y-hidden bg-black/30 backdrop-blur-md transition-transform ${
        navOpen ? "translate-x-0" : "translate-x-full"
      } lg:hidden`}
    >
      <div ref={navRef} className="w-60  pt-16 fixed px-2 justify-between pb-3 flex-shrink-0 bg-accentGrey flex flex-col h-screen">
        <div className="flex flex-col pl-4 gap-10">
          <Logo />
          <NavBar />
        </div>
        <div className="flex flex-col gap-1 pb-1">
        <button
          onClick={() => setToggleLogout(!toggleLogout)}
          className="flex  items-center p-2 w-full gap-2"
        >
          <h1 className="w-8 h-8 rounded-full bg-primary flex-shrink-0 capitalize text-white flex items-center justify-center">
            {username?.split("")[0]}
          </h1>
          <div className="flex flex-col  gap-1">
            <h2 className="font-semibold text-left text-sm">{username}</h2>
            <p className="text-xs truncate w-32 ">{email}</p>
          </div>
        </button>
        {toggleLogout && (
          <Button onClick={() => logout()} size="small" type="primary">
            Log out
          </Button>
        )}
      </div>
      </div>
    </section>
  );
}

export default MobileSidebar;
