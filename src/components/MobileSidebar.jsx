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
    [userButtonRef, logoutButtonRef, hamburgerRef]
  );

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
      {/* Enhanced Hamburger Button */}
      <button
        ref={hamburgerRef}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/90 rounded-lg shadow-md hover:bg-white transition-all"
        aria-label="Toggle menu"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
          className={`transition-transform ${mobileNavOpen ? 'rotate-90' : ''}`}
        >
          <path 
            d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" 
            fill="currentColor"
            className="text-gray-800"
          />
        </svg>
      </button>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden">
          <nav
            ref={navRef}
            className="flex flex-col w-64 h-full bg-white shadow-xl"
          >
            {/* Close Button */}
            <button 
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo Section */}
            <div className="p-4 border-b border-gray-100">
              <img
                role="button"
                className="h-10 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  navigate("/");
                  setMobileNavOpen(false);
                }}
                src={logosvg}
                alt="logo"
              />
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
              <SideBarMenuItems
                onClick={() => setMobileNavOpen(false)}
                to="/"
                icon={OverviewIcon}
                title="Overview"
                className="hover:bg-gray-50 rounded-lg"
              />

              {/* Hiring Section */}
              <div className="mt-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hiring
                </h3>
                <div className="mt-2 space-y-1">
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="add-developer"
                    icon={AddDeveloperIcon}
                    title="Add Developer"
                    className="hover:bg-gray-50 rounded-lg"
                  />
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    icon={CreateContractIcon}
                    to="create-contract"
                    title="Create Contract"
                    className="hover:bg-gray-50 rounded-lg"
                  />
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="teams"
                    icon={TeamsIcon}
                    title="Teams"
                    className="hover:bg-gray-50 rounded-lg"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="mt-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </h3>
                <div className="mt-2 space-y-1">
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="payroll"
                    icon={PayRollIcon}
                    title="Payroll"
                    className="hover:bg-gray-50 rounded-lg"
                  />
                  <SideBarMenuItems
                    onClick={() => setMobileNavOpen(false)}
                    to="expenses"
                    icon={ExpensesIcon}
                    title="Expenses"
                    className="hover:bg-gray-50 rounded-lg"
                  />
                </div>
              </div>

              {/* Activity Section */}
              <div className="mt-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Activity
                </h3>
                <div className="mt-2 space-y-1">
                  <SideBarMenuItems
                    to="agreements"
                    onClick={() => setMobileNavOpen(false)}
                    icon={AgreementsIcon}
                    title="Agreements"
                    className="hover:bg-gray-50 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="relative">
                <div
                  ref={userButtonRef}
                  role="button"
                  onClick={handleToggleLogout}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    {(username || userBio?.email || "P").charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {username || "Personal"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {email || userBio?.email || "Pedxo@gmail.com"}
                    </p>
                  </div>
                </div>

                {/* Logout Dropdown */}
                {toggleLogout && (
                  <div
                    ref={logoutButtonRef}
                    className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <img 
                        src={logoutsvg} 
                        alt="logout icon" 
                        className="w-4 h-4 mr-2" 
                      />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileSideBar;