import logoutsvg from "../assets/svg/logout.svg";
import { useState } from "react";
import SideBarMenuItems from "../components/SideBarMenuItems";
import { useNavigate } from "react-router-dom";
import AddDeveloperIcon from "../assets/icons/AddDeveloperIcon";
import OverviewIcon from "../assets/icons/OverviewIcon";
import CreateContractIcon from "../assets/icons/CreateContractIcon";
import TeamsIcon from "../assets/icons/TeamsIcon";
import PayRollIcon from "../assets/icons/PayRollIcon";
import ExpensesIcon from "../assets/icons/ExpensesIcon";
import AgreementsIcon from "../assets/icons/AgreementsIcon";
import { useUser } from "../context/UserContext";
import { useLogout } from "../features/auth/useLogout";
import { useNavBar } from "../context/SideBarContext";
import { useOutsideClick } from "../hooks/useOutsideClick";
import logosvg from "/logo.svg";

const Navbar = () => {
  const { username, email } = useUser();
  const navigate = useNavigate();
  const [toggleLogout, setToggleLogout] = useState(false);
  const { logout } = useLogout();
  const { desktopNavOpen } = useNavBar();

  const navRef = useOutsideClick(() => setToggleLogout(false), []);

  const handleLogout = () => {
    logout();
    setToggleLogout(false);
  };

  return (
    <>
      {desktopNavOpen && (
        <nav
          ref={navRef}
          className="hidden md:flex flex-col w-full max-w-[13em] h-screen fixed bg-white shadow-lg border-r border-gray-200"
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100">
            <img
              role="button"
              className="h-10 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
              src={logosvg}
              alt="logo"
            />
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <SideBarMenuItems
              to="/dashboard"
              icon={OverviewIcon}
              title="Overview"
              className="hover:bg-gray-50 rounded-lg"
            />

            {/* Hiring Section */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hiring
              </h3>
              <div className="mt-2 space-y-1">
                <SideBarMenuItems
                  to="add-developer"
                  icon={AddDeveloperIcon}
                  title="Add Developer"
                  className="hover:bg-gray-50 rounded-lg"
                />
                <SideBarMenuItems
                  icon={CreateContractIcon}
                  to="create-contract"
                  title="Create Contract"
                  className="hover:bg-gray-50 rounded-lg"
                />
                <SideBarMenuItems
                  to="teams"
                  icon={TeamsIcon}
                  title="Teams"
                  className="hover:bg-gray-50 rounded-lg"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Payment
              </h3>
              <div className="mt-2 space-y-1">
                <SideBarMenuItems
                  to="payroll"
                  icon={PayRollIcon}
                  title="Payroll"
                  className="hover:bg-gray-50 rounded-lg"
                />
                <SideBarMenuItems
                  to="expenses"
                  icon={ExpensesIcon}
                  title="Expenses"
                  className="hover:bg-gray-50 rounded-lg"
                />
              </div>
            </div>

            {/* Activity Section */}
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Activity
              </h3>
              <div className="mt-2 space-y-1">
                <SideBarMenuItems
                  to="agreements"
                  icon={AgreementsIcon}
                  title="Contracts"
                  className="hover:bg-gray-50 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="relative">
              <div
                role="button"
                onClick={() => setToggleLogout(!toggleLogout)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {email || "No email"}
                  </p>
                </div>
              </div>

              {/* Logout Dropdown */}
              {toggleLogout && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10">
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
      )}
    </>
  );
};

export default Navbar;