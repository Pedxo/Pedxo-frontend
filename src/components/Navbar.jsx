import logoutsvg from "../assets/svg/logout.svg";
import { useEffect, useState } from "react";
import SideBarMenuItems from "../components/SideBarMenuItems";
import { useNavigate } from "react-router-dom";
import AddDeveloperIcon from "../assets/icons/AddDeveloperIcon";
import OverviewIcon from "../assets/icons/OverviewIcon";
import CreateContractIcon from "../assets/icons/CreateContractIcon";
import TeamsIcon from "../assets/icons/TeamsIcon";
import PayRollIcon from "../assets/icons/PayRollIcon";
import SpendIcon from "../assets/icons/SpendIcon";
import ExpensesIcon from "../assets/icons/ExpensesIcon";
import AgreementsIcon from "../assets/icons/AgreementsIcon";
import { useUser } from "../context/UserContext";
import { useLogout } from "../features/auth/useLogout";
import { useNavBar } from "../context/SideBarContext";
import { useOutsideClick } from "../hooks/useOutsideClick";
import logosvg from "/logo.svg";
import authFetch from "../api";

const Navbar = () => {
  const { username, email, userId } = useUser();
  const navigate = useNavigate();
  const [toggleLogout, setToggleLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useLogout();
  const { desktopNavOpen } = useNavBar();
  /* ===========================================
   Assigned Talents Count
   This is used to display the badge beside
   Teams Store in the sidebar.
  =========================================== */
  const [teamsCount, setTeamsCount] = useState(0);



  const navRef = useOutsideClick(() => {
    // Don't close if logout is in progress
    if (!isLoggingOut) {
      setToggleLogout(false);
    }
  }, [isLoggingOut]); // Add isLoggingOut as dependency

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Start loading
      await logout(); // Assuming logout returns a promise
      // Only close after logout is complete
      // setToggleLogout(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Keep the button open so user can retry
    } finally {
      setIsLoggingOut(false); // Stop loading regardless of success/failure
    }
  };


  /* ==========================================
   Fetch total assigned talents

   This uses the same logic as Overview.jsx.

   We only count unique assigned talent IDs.
========================================== */
useEffect(() => {
  const fetchTeamsCount = async () => {
    if (!userId) return;

    try {
      const response = await authFetch.get(
        "/contracts/get-user-contracts",
        {
          params: { userId },
        }
      );

      const contracts = Array.isArray(
        response?.data?.data?.contracts
      )
        ? response.data.data.contracts
        : [];

      let totalAssigned = 0;

      contracts.forEach((contract) => {
        const assigned = Array.isArray(contract.talentAssignedId)
          ? [...new Set(contract.talentAssignedId.filter(Boolean))]
          : [];

        totalAssigned += assigned.length;
      });

      setTeamsCount(totalAssigned);
    } catch (err) {
      console.error("Failed to load team count", err);
    }
  };

  fetchTeamsCount();
}, [userId]);


  return (
    <>
      {desktopNavOpen && (
        <nav
          ref={navRef}
          className="hidden md:flex border-r-2 w-full max-w-[13em] pt-8 justify-between h-screen flex-col fixed overview-expense-bg"
        >
          <div className="flex-col px-8">
            <img
              role="button"
              className="p-4 mx-auto my-2 cursor-pointer"
              onClick={() => navigate("/")}
              src={logosvg}
              alt="logo"
            />

            <div className="flex flex-col w-full gap-6 capitalize">
              <SideBarMenuItems
                to="/dashboard"
                icon={OverviewIcon}
                title="Overview"
              />

              <div className="flex flex-col gap-5">
                <div className="grey-text text-sm font-semibold leading-normal">
                  Hiring
                </div>
                <SideBarMenuItems
                  to="add-developer"
                  icon={AddDeveloperIcon}
                  title="add engineer"
                />

                {/* <SideBarMenuItems
                  icon={CreateContractIcon}
                  to="create-contract"
                  title="create contract"
                /> */}

                <SideBarMenuItems to="teams" icon={TeamsIcon} title="teams store" badge={teamsCount}/>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grey-text text-sm font-semibold leading-normal">
                  Payment
                </div>
                <SideBarMenuItems
                  to="payroll"
                  icon={ExpensesIcon} 
                  title="spending"
                />
                <SideBarMenuItems
                  to="expenses"
                  icon={PayRollIcon}
                  title="expenses "
                />
              </div>

              <div className="flex flex-col gap-5">
                <div className="grey-text text-sm font-semibold leading-normal">
                  Activity
                </div>
                <SideBarMenuItems
                  to="agreements"
                  icon={AgreementsIcon}
                  title="Contracts"
                />
              </div>
            </div>
          </div>

          <div className="user-bg-clr flex-shrink-0 flex flex-col w-full p-2">
            <div
              role="button"
              onClick={() => {
                // Only toggle if not currently logging out
                if (!isLoggingOut) {
                  setToggleLogout(!toggleLogout);
                }
              }}
              className="flex w-full hover:shadow-md p-2 items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full uppercase user-avatar text-white font-semibold flex items-center justify-center">
                {username?.charAt(0) || "U"}
              </div>
              <div className="flex w-32 p-1 flex-col">
                <p className="font-semibold leading-normal truncate">
                  {username || "User"}
                </p>
                <p className="text-xs truncate user-email-clr">
                  {email || "No email"}
                </p>
              </div>
            </div>

            {toggleLogout && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-3 font-medium text-[13px] pr-bg-clr text-white mt-[15px] rounded-lg flex items-center justify-center gap-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging Out...
                  </>
                ) : (
                  <>
                    <img src={logoutsvg} alt="logout icon" />
                    Log Out
                  </>
                )}
              </button>
            )}
          </div>
        </nav>
      )}
    </>
  );
};
export default Navbar;