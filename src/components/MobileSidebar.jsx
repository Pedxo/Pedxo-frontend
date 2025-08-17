import { useState, useRef } from "react";
import SideBarMenuItems from "../components/SideBarMenuItems";
import { useGlobalContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/auth/useLogout";
import AddDeveloperIcon from "../assets/icons/AddDeveloperIcon";
import OverviewIcon from "../assets/icons/OverviewIcon";
import CreateContractIcon from "../assets/icons/CreateContractIcon";
import TeamsIcon from "../assets/icons/TeamsIcon";
import PayRollIcon from "../assets/icons/PayRollIcon";
import ExpensesIcon from "../assets/icons/ExpensesIcon";
import AgreementsIcon from "../assets/icons/AgreementsIcon";
import { useNavBar } from "../context/SideBarContext";
import logoutsvg from "../assets/svg/logout.svg";
import logosvg from "/logo.svg";
import { useUser } from "../context/UserContext";
import { useOutsideClick } from "../hooks/useOutsideClick";

const MobileSideBar = () => {
  const { mobileNavOpen, setMobileNavOpen } = useNavBar();
  const [toggleLogout, setToggleLogout] = useState(false);
  const navigate = useNavigate();
  const { userBio } = useGlobalContext();
  const { logout } = useLogout();
  const { username, email } = useUser();

  const userButtonRef = useRef(null);
  const logoutButtonRef = useRef(null);
  const hamburgerRef = useRef(null);

  const navRef = useOutsideClick(
    () => {
      setMobileNavOpen(false);
      setToggleLogout(false);
    },
    [userButtonRef, logoutButtonRef, hamburgerRef] // Pass as array
  );
  // Handle clicks outside the sidebar
  const handleClickOutside = (e) => {
    if (
      !navRef.current?.contains(e.target) &&
      !hamburgerRef.current?.contains(e.target)
    ) {
      setMobileNavOpen(false);
      setToggleLogout(false);
    }
  };

  useOutsideClick(navRef, handleClickOutside);

  const handleToggleLogout = (e) => {
    e.stopPropagation();
    setToggleLogout((prev) => !prev);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    setMobileNavOpen(false);
    setToggleLogout(false);
  };

  return (
    <>
      <button
        ref={hamburgerRef}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="md:hidden fixed top-4 left-4 z-50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md md:hidden">
          <nav
            ref={navRef}
            className="flex border-r-2 w-full max-w-[20em] h-full flex-col fixed user-bg-clr"
          >
            <div className="flex-col pt-2 p-8">
              <img
                role="button"
                className="p-4 mx-auto my-2"
                onClick={() => {
                  navigate("/");
                  setMobileNavOpen(false);
                }}
                src={logosvg}
                alt="logo"
              />
              <div className="flex flex-col h-full gap-6 capitalize">
                <SideBarMenuItems
                  onClick={() => setMobileNavOpen(false)}
                  to="/"
                  icon={OverviewIcon}
                  title="Overview"
                />
                <div className="flex flex-col gap-5">
                  <div className="grey-text text-sm font-semibold leading-normal">
                    Hiring
                  </div>
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="add-developer"
                    icon={AddDeveloperIcon}
                    title="add developer"
                  />
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    icon={CreateContractIcon}
                    to="create-contract"
                    title="create contract"
                  />
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="teams"
                    icon={TeamsIcon}
                    title="teams"
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <div className="grey-text text-sm font-semibold leading-normal">
                    Payment
                  </div>
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="payroll"
                    icon={PayRollIcon}
                    title=" payroll"
                  />
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="expenses"
                    icon={ExpensesIcon}
                    title="expenses "
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <div className="grey-text text-sm font-semibold leading-normal">
                    Activity
                  </div>
                  <SideBarMenuItems
                    to="agreements"
                    onClick={() => setMobileNavOpen(false)}
                    icon={AgreementsIcon}
                    title="agreements "
                  />
                </div>
              </div>
            </div>
            <div className="user-bg-clr mt-auto p-4">
              <div
                ref={userButtonRef}
                role="button"
                onClick={handleToggleLogout}
                className="flex px-4 hover:shadow-md p-2 items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full user-avatar text-white font-semibold flex items-center justify-center">
                  {(username || userBio?.email || "P").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold leading-normal">
                    {username || "Personal"}
                  </div>
                  <div className="text-[12px] user-email-clr">
                    {email || userBio?.email || "Pedxo@gmail.com"}
                  </div>
                </div>
              </div>

              {toggleLogout && (
                <div
                  ref={logoutButtonRef}
                  className="flex w-full justify-center mt-2"
                >
                  <button
                    onClick={handleLogout}
                    className="py-2 px-8 font-medium text-sm pr-bg-clr text-white rounded-lg flex items-center gap-2"
                  >
                    <img src={logoutsvg} alt="logout icon" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileSideBar;
