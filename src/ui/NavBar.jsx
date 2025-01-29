import AddDeveloperIcon from "../assets/icons/AddDeveloperIcon";
import AgreementsIcon from "../assets/icons/AgreementsIcon";
import CreateContractIcon from "../assets/icons/CreateContractIcon";
import ExpensesIcon from "../assets/icons/ExpensesIcon";
import OverviewIcon from "../assets/icons/OverviewIcon";
import PayRollIcon from "../assets/icons/PayRollIcon";
import TeamsIcon from "../assets/icons/TeamsIcon";
import { useNavBar } from "../context/SideBarContext";
import CustomNavLink from "./CustomNavLink";

function NavBar() {

  const {setNavOpen} = useNavBar()

  return (
    <nav className="flex w-full gap-4 flex-col">
      <CustomNavLink onClick={() => setNavOpen(false)} to="/" icon={OverviewIcon}>Overview</CustomNavLink>
      <h4>Hiring</h4>
      <CustomNavLink onClick={() => setNavOpen(false)} to="/add-developer" icon={AddDeveloperIcon}>Add Developer</CustomNavLink>
      <CustomNavLink onClick={() => setNavOpen(false)} to="/create-contract" icon={CreateContractIcon}>Create Contract</CustomNavLink>
      <CustomNavLink onClick={() => setNavOpen(false)} to="/teams" icon={TeamsIcon}>Teams</CustomNavLink>
      <h4>Payment</h4>
      <CustomNavLink onClick={() => setNavOpen(false)} to="/payroll" icon={PayRollIcon}>Payroll</CustomNavLink>
      <CustomNavLink onClick={() => setNavOpen(false)} to="/expenses" icon={ExpensesIcon}>Expenses</CustomNavLink>
      <h4>Activity</h4>
      <CustomNavLink onClick={() => setNavOpen(false)} to="/agreements" icon={AgreementsIcon}>Agreements</CustomNavLink>
    </nav>
  );
}

export default NavBar;
