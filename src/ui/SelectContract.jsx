import { FaLocationCrosshairs } from "react-icons/fa6";
import { TbBriefcase2 } from "react-icons/tb";
import ContractLink from "./ContractLink";

function SelectContract() {
  return (
    <section className="w-[38em] flex gap-10 flex-col p-3">
      <div className="flex flex-col text-center gap-4">
        <h1 className="heading-1">Create a contract</h1>
        <p>Choose contract type</p>
      </div>

      <div className="flex flex-col gap-5 w-full">
        <ContractLink
          to={"/contract?ct=full-time"}
          icon={FaLocationCrosshairs}
          title="Full-Time"
          text="Suitable for long-term employees"
        />
        <ContractLink
          to={"/contract?ct=gig-based"}
          icon={TbBriefcase2}
          title="Gig Based"
          text="Suitable for temporal or milestone contracts"
        />
      </div>
    </section>
  );
}

export default SelectContract;
