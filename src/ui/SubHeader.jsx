import { FaUserPlus } from "react-icons/fa6";
import Button from "./Button";
import SearchBox from "./SearchBox";
import CreateContractIcon from "../assets/icons/CreateContractIcon";
import { GoDotFill } from "react-icons/go";

function SubHeader({ title, hasSearch = true, active = true }) {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-end justify-between w-full">
        <h1 className="heading-1 capitalize">{title}</h1>

        <div className=" hidden lg:flex items-center gap-4">
          <Button
            link
            linkTo={"/add-developer"}
            type={"primary"}
            iconLeft={<FaUserPlus size={18} />}
          >
            Add Developer
          </Button>
          <Button
            link
            linkTo={"/add-developer"}
            size="large"
            type={"secondary"}
            iconLeft={<CreateContractIcon />}
          >
            Create Contract
          </Button>
        </div>
      </div>
      {active && (
        <div className="w-full items-center flex justify-between">
          <div className="flex items-center ">
            <h4>Active Developers</h4>
            <GoDotFill className="text-brandGreen" />
          </div>
          {hasSearch && <SearchBox />}
        </div>
      )}
    </section>
  );
}

export default SubHeader;
