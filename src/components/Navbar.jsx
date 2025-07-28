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
import logosvg from "/logo.svg"

const Navbar = () => {
  const { username, email } = useUser();
  const navigate = useNavigate();
  const { setNavOpen } = useNavBar();
  const [toggleLogout, setToggleLogout] = useState(false);
  const { logout } = useLogout();

  const closeSidebar = () => setNavOpen(false);

  const navRef = useOutsideClick(closeSidebar);

  return (
    <nav
      ref={navRef}
      className="hidden md:flex border-r-2 w-full max-w-[13em] pt-8 justify-between  h-screen  flex-col fixed sec-bg-clr   "
    >
      <div className="flex-col px-8 ">
        {/* <h1
          role="button"
          onClick={() => navigate("/")}
          className=" text-[35px]  font-extrabold leading-normal mb-[50px]"
        >
          Pedxo
        </h1> */}
        <img role="button" className="p-4 mx-auto my-2" onClick={() => navigate("/")} src={logosvg} alt="logo" />
        <div className="flex flex-col  w-full  gap-6 capitalize">
          <SideBarMenuItems to="/dashboard" icon={OverviewIcon} title="Overview" />

          <div className="flex flex-col gap-5">
            <div className="grey-text text-sm font-semibold leading-normal">
              Hiring
            </div>
            <SideBarMenuItems
              to="add-developer"
              icon={AddDeveloperIcon}
              title="add developer"
            />
            <SideBarMenuItems
              icon={CreateContractIcon}
              to="create-contract"
              title="create contract"
            />
            <SideBarMenuItems to="teams" icon={TeamsIcon} title="teams" />
          </div>

          <div className="flex flex-col gap-5">
            <div className="grey-text text-sm font-semibold leading-normal">
              Payment
            </div>
            <SideBarMenuItems
              to="payroll"
              icon={PayRollIcon}
              title=" payroll"
            />
            <SideBarMenuItems
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
              icon={AgreementsIcon}
              title="Contracts"
            />
          </div>
        </div>
      </div>

      <div className="user-bg-clr flex-shrink-0   flex flex-col  w-full  p-2">
        <div
          role="button"
          onClick={() => setToggleLogout(!toggleLogout)}
          className="flex w-full hover:shadow-md p-2  items-center gap-2"
        >
          <div className="w-10 h-10 flex-shrink-0 rounded-full uppercase user-avatar text-white font-semibold flex items-center justify-center">
            {username.split("")[0]}
          </div>
          <div className=" flex w-32 p-1 flex-col">
            <p className="font-semibold leading-normal">{username}</p>

            <p className="text-xs truncate user-email-clr">
              {email || "Pedxo@gmail.com"}
            </p>
          </div>
        </div>
        {toggleLogout && (
          <button
            onClick={() => logout()}
            className="p-3 font-medium text-[13px] pr-bg-clr text-white mt-[15px] rounded-lg flex items-center justify-center gap-[10px]"
          >
            <img src={logoutsvg} alt="logout icon" />
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
