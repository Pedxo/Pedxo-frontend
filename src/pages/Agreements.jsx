import React, {useState, useEffect} from "react";
import { nanoid } from "nanoid";
import SearchingDoc from "../components/SearchingDoc";
import AddDeveloperBtn from "../components/AddDeveloperBtn";
import CreateContractBtn from "../components/CreateContractBtn";
import AgreementTable from "../components/agreements/AgreementTable";
import { NavLink } from "react-router-dom";
//import { SearchingDoc } from "../components";
import SearchInput from "../components/SearchInput";
import AgreementsCard from "../components/agreements/AgreementsCard";
//import expenseavatar from "../assets/svg/expenseavatar.svg";
import {getEmployeeKey, getProfileImagesMapping} from "../utility/profileImages";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// import { NavLink } from "react-router-dom";
// import add from "../assets/svg/add.svg";

const Agreements = () => {
  const [assignedContracts, setAssignedContracts] = useState([]);
  const [profileMap, setProfileMap] = useState({});
  const [loading, setLoading] = useState(true);


  // NEW: loader state
  const [showLoader, setShowLoader] = useState(true);


  // prevents blank screen before effects run
  const [hasMounted, setHasMounted] = useState(false);


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

  


useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const token = localStorage.getItem("token");

        /** FETCH REAL CONTRACTS */
        const contractRes = await fetch(
          `${baseUrl}/contracts/get-user-contracts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        

        const contractJson = await contractRes.json();
        const contracts = Array.isArray(contractJson?.data?.contracts)
          ? contractJson.data.contracts
          : [];

          console.log("Contract created", contracts);
        /** FETCH ASSIGNMENTS USING REAL CONTRACT IDs */
        const assigned = [];

        for (const contract of contracts) {
          // const realContractId = contract?._id;
          // if (!realContractId) continue;
          if(!contract?._id) continue;

          const res = await fetch(
            `${baseUrl}/hire/assigned-by-contract?contractId=${contract._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!res.ok) continue;

          const json = await res.json();

          if (Array.isArray(json?.data)) {
            json.data.forEach((dev) => {
              assigned.push({
                ...dev,
                //contractId: realContractId, // ONLY REAL CONTRACT ID
                contractId: contract._id,
               // _id: contract._id,
                contract,                  // PASS FULL CONTRACT
              });
              
            });
            
          }
          
        }

        /** SORT + PROFILE MAP */
        assigned.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log("Assigned Fetched", assigned);

        setAssignedContracts(assigned);
        setProfileMap(getProfileImagesMapping(assigned));
      } catch (err) {
        console.error("Failed to fetch agreements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, []);


  
  // ----------------- FORCE 10s LOADER -----------------
  useEffect(() => {
    setHasMounted(true);

    const loaderShown = sessionStorage.getItem("overview_loader_shown");

    if (loaderShown) {
      setShowLoader(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem("overview_loader_shown", "true");
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // SINGLE SOURCE OF TRUTH
  const shouldShowLoader = !hasMounted || showLoader || loading;


   // ----------------- LOADER (BEFORE PAGE LOAD) -----------------
   if (shouldShowLoader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-24 h-24 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-2xl font-semibold">Loading Contracts...</p>
      </div>
    );
  }


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

      {!loading && assignedContracts.length > 0 ? (
        <div className="mt-[23px] grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-[30px] lg:mt-[33px]">
          
          {assignedContracts.map((emp) => (
            <AgreementsCard
              key={`${emp.contractId}-${emp.email}`}
              card={{
                contractId: emp.contractId,
                name: emp.fullName,
                avatar: profileMap[getEmployeeKey(emp)],
                link: "View contract",
              }}
              assignedName={emp.fullName}
            />
          ))}
        
        </div>
      ) : (
        !loading && (
        <SearchingDoc
          noticeText="Add devs and pay them to see their records here."
          searchingdocTitle="No Agreement yet"
          searchingdocText="They would be generated when you have created a contract"
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
      ))}
    </div>
  );
};
export default Agreements;
