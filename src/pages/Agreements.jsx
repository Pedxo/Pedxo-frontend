import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";
import { getUserContracts } from "../api";
import { useUser } from "../context/UserContext";
import AddDeveloperBtn from "../components/AddDeveloperBtn";
import CreateContractBtn from "../components/CreateContractBtn";
import { NavLink } from "react-router-dom";
import { SearchingDoc } from "../components";
import SearchInput from "../components/SearchInput";
import AgreementsCard from "../components/agreements/AgreementsCard";
import expenseavatar from "../assets/svg/expenseavatar.svg";
import MiniLoader from "../components/MiniLoader";

const Agreements = () => {
  const { userId } = useUser();

  const { data: contractsData, isLoading } = useQuery({
    queryKey: ["user-contracts", userId],
    queryFn: () => getUserContracts(userId),
    enabled: !!userId,
  });

  const onBoarding = [
    {
      id: nanoid(),
      title: "Sign Pending agreements",
      desp: "Select the “Sign” button next to the agreement and sign it on the platform",
    },
    {
      id: nanoid(),
      title: "Review your signed agreements",
      desp: "All signed agreements will be stored in this “Agreements” tab. You can download the documents from here or review anytime.",
    },
  ];

  const contracts = contractsData?.data?.contracts || [];

  return (
    <div className="mt-[62px] mx-5 flex flex-col xl:ml-[86px] xl:mr-[65px] ">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-medium lg:text-[30px] lg:font-semibold xl:mb-5">
          Agreements
        </h1>
        <div className="hidden md:flex gap-2">
          <AddDeveloperBtn />
          <CreateContractBtn />
        </div>
      </div>

      <div className=" font-semibold mt-2 mb-5 xl:text-xl xl:mt-0 xl:mb-10">
        Overall Client&apos;s Agreements
      </div>
      <div className="flex items-center justify-between font-medium mt-2 lg:justify-self-start xl:text-xl">
        <div className="flex items-center gap-1 md:mr-[21px]">
          Active Developers
          <div
            className="w-3 h-3 rounded-full "
            style={{ backgroundColor: "#008000" }}
          ></div>
        </div>
        <SearchInput />
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <MiniLoader />
        </div>
      ) : contracts.length > 0 ? (
        <div className="mt-[23px] grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-[30px] lg:mt-[33px]">
          {contracts.map((el, i) => (
            <AgreementsCard
              key={el._id || i}
              card={{
                avatar: expenseavatar,
                name: el.clientName || "Unnamed Contract",
                id: el._id,
                link: "View contract",
              }}
            />
          ))}
        </div>
      ) : (
        <SearchingDoc
          noticeText="Add devs and pay them to see their 
records here."
          searchingdocTitle="No Agreement yet"
          searchingdocText="They would be generated when you have
created a contract"
          onBoarding={onBoarding}
        >
          <div className="mt-[33px]">
            <NavLink
              to="/dashboard/create-contract"
              className="flex items-center text-[0.8rem] text-white px-3 py-[10px] sm:px-5 sm:py-[14px] pr-bg-clr rounded-lg font-semibold xl:text-[16px]"
            >
              <img src={""} alt="" className="w-4 mr-1" /> Create new contract
            </NavLink>
          </div>
        </SearchingDoc>
      )}
    </div>
  );
};
export default Agreements;
