import { useState } from "react";
import { useUser } from "../context/UserContext";
import Logo from "../ui/Logo";
import NavBar from "../ui/NavBar";
import Button from "../ui/Button";
import { useLogout } from "../features/auth/useLogout";

function SideBar() {
  const { username, email } = useUser();
  const [toggleLogout, setToggleLogout] = useState(false);
  const { logout } = useLogout();
  return (
    <div className="w-60 pt-0 md:pt-16 fixed  px-2 justify-between hidden pb-3 flex-shrink-0 bg-accentGrey lg:flex flex-col h-screen">
      <div className="flex flex-col pl-4 gap-10">
        <Logo />
        <NavBar />
      </div>
      {/* Profile */}
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
  );
}

export default SideBar;
