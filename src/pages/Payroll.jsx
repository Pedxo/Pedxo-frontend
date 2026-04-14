import { nanoid } from "nanoid";
import { useState } from "react";
// import SearchingDoc from "../components/SearchingDoc";
import AddDeveloperBtn from "../components/AddDeveloperBtn";
import CreateContractBtn from "../components/CreateContractBtn";
import PaidTable from "../components/payroll/PaidTable";
import PayContractorsTable from "../components/payroll/PayContractorsTable";

const Payroll = () => {
  const [isActive, setIsActive] = useState("pay");


  // const handleClick = () => {
  //   setIsActive(!isActive);
  // };

  const onBoarding = [
    {
      id: nanoid(),
      title: "View all due and paid team.",
      desp: "Review draft contractor payments that have been automatically generated. Ensure all details are accurate",
    },
    {
      id: nanoid(),
      title: "Simple one-click payment",
      desp: "Choose to pay all your due team members at once or select them individually",
    },
    {
      id: nanoid(),
      title: "Automated payment process",
      desp: "Once you've successfully paid your team, an invoice will be generated for your records. After the funds are received, your contractors will be paid seamlessly",
    },
  ];

  return (
    <div>
      <div className="mt-[62px] mx-5 flex flex-col xl:ml-[86px] xl:mr-[65px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="text-xl font-medium lg:text-[30px] lg:font-semibold xl:mb-[11px]">
            Payroll
          </div>
          <div className="hidden md:flex gap-2">
            <AddDeveloperBtn />
            <CreateContractBtn />
          </div>
        </div>

        <div>
          <div className="flex flex-col mt-2">
            <div className="font-semibold xl:text-2xl">
              <span
              className={`mr-6 cursor-pointer ${
                isActive === "pay"
                  ? "text-[#00B9CB]"
                  : "text-[#00000033]"
              }`}
              onClick={() => setIsActive("pay")}
            >
              Pay Contractors
            </span>

            <span
              className={`cursor-pointer ${
                isActive === "paid"
                  ? "text-[#00B9CB]"
                  : "text-[#00000033]"
              }`}
              onClick={() => setIsActive("paid")}
            >
              Paid
            </span>
            </div>
            {isActive === "pay" && <PayContractorsTable />}
            {isActive === "paid" && <PaidTable />}
          </div>
          {/* <div>
          <SearchingDoc
            noticeText="How onboarding works?"
            searchingdocTitle="No Payroll Yet"
            searchingdocText="They would be generated when you start
 making payment"
            onBoarding={onBoarding}
          />
        </div> */}
        </div>
      </div>
    </div>
  );
};
export default Payroll;
