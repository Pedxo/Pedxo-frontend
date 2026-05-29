import AddDeveloperBtn from "../components/AddDeveloperBtn";
import CreateContractBtn from "../components/CreateContractBtn";

const DashboardHeading = ({ heading, subHead }) => {
  return (
    <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between">
      <div>
        {/* <div className="text-[20px] font-medium lg:text-[30px] lg:font-semibold xl:mb-[11px]">
          {heading}
        </div>
        <div className="font-semibold xl:text-2xl">{subHead}</div> */}
      </div>

      <div className="hidden md:flex gap-2">
        <AddDeveloperBtn />
        <CreateContractBtn />
      </div>
    </div>
  );
};
export default DashboardHeading;
