import { useEffect, useState, useMemo } from "react";
import { nanoid } from "nanoid";
import { NavLink } from "react-router-dom";
import AddDeveloperBtn from "../components/AddDeveloperBtn";
import CreateContractBtn from "../components/CreateContractBtn";
import { SearchingDoc } from "../components";
import SearchInput from "../components/SearchInput";
import AgreementsCard from "../components/agreements/AgreementsCard";
import Loader from "../components/Loader";
import { getUserContracts } from "../services/contractService";

// Import profile images
import image1 from "../assets/svg/image1.svg";
import image2 from "../assets/svg/image2.svg";
import image3 from "../assets/svg/image3.svg";
import image4 from "../assets/svg/image4.svg";
import image5 from "../assets/svg/image5.svg";
import image6 from "../assets/svg/image6.svg";
import image7 from "../assets/svg/image7.svg";
import image8 from "../assets/svg/image8.svg";
import image9 from "../assets/svg/image9.svg";
import image10 from "../assets/svg/image10.svg";
import image11 from "../assets/svg/image11.svg";
import image12 from "../assets/svg/image12.svg";
import image13 from "../assets/svg/image13.svg";
import image14 from "../assets/svg/image14.svg";
import image15 from "../assets/svg/image15.svg";

const profileImages = [
  image1, image2, image3, image4, image5,
  image6, image7, image8, image9, image10,
  image11, image12, image13, image14, image15,
];

/**
 * Generate a unique key for each contract
 */
const getContractKey = (contract) =>
  `${contract._id || contract.clientName}::${contract.email}`;

/**
 * Assign profile images to contracts and store in localStorage
 */
const getProfileImagesMapping = (contracts) => {
  const stored = JSON.parse(localStorage.getItem("contractImages") || "{}");
  const mapping = { ...stored };
  let imageIndex = Object.keys(mapping).length;

  contracts.forEach((contract) => {
    const key = getContractKey(contract);
    if (!key) return;

    if (!mapping[key]) {
      mapping[key] = profileImages[imageIndex % profileImages.length];
      imageIndex++;
    }
  });

  localStorage.setItem("contractImages", JSON.stringify(mapping));
  return mapping;
};

const Agreements = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMap, setProfileMap] = useState({});

  const onBoarding = [
    {
      id: nanoid(),
      title: "Sign Pending agreements",
      desp: 'Select the "Sign" button next to the agreement and sign it on the platform',
    },
    {
      id: nanoid(),
      title: "Review your signed agreements",
      desp: 'All signed agreements will be stored in this "Agreements" tab. You can download the documents from here or review anytime.',
    },
  ];

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      setError("");

      try {
        const contractsData = await getUserContracts();
        const activeContracts = contractsData.filter(
          (contract) => 
            contract.isCompleted && 
            contract.talentAssignedId && 
            contract.talentAssignedId.length > 0
        );

        setContracts(activeContracts);
        setProfileMap(getProfileImagesMapping(activeContracts));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);
  const filteredContracts = useMemo(() => {
    if (!searchTerm) return contracts;
    const lower = searchTerm.toLowerCase();
    return contracts.filter(
      (contract) =>
        contract.clientName?.toLowerCase().includes(lower) ||
        contract.email?.toLowerCase().includes(lower) ||
        contract.companyName?.toLowerCase().includes(lower) ||
        contract.roleTitle?.toLowerCase().includes(lower)
    );
  }, [searchTerm, contracts]);

  const agreementsCards = filteredContracts.map((contract) => ({
    avatar: profileMap[getContractKey(contract)] || profileImages[0],
    name: contract.clientName,
    id: contract._id,
    email: contract.email,
    companyName: contract.companyName,
    roleTitle: contract.roleTitle,
    link: `/dashboard/contracts/${contract._id}`,
  }));

  return (
    <div className="mt-[62px] mx-5 flex flex-col xl:ml-[86px] xl:mr-[65px]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-medium lg:text-[30px] lg:font-semibold xl:mb-5">
          Agreements
        </h1>
        <div className="hidden md:flex gap-2">
          <AddDeveloperBtn />
          <CreateContractBtn />
        </div>
      </div>

      <div className="font-semibold mt-2 mb-5 xl:text-xl xl:mt-0 xl:mb-10">
        Overall Client&apos;s Agreements
      </div>

      <div className="flex items-center justify-between font-medium mt-2 lg:justify-self-start xl:text-xl">
        <div className="flex items-center gap-1 md:mr-[21px]">
          Active Developers
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#008000" }}
          ></div>
        </div>
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : agreementsCards.length > 0 ? (
        <div className="mt-[23px] grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-[30px] lg:mt-[33px]">
          {agreementsCards.map((card, i) => (
            <AgreementsCard key={card.id || i} card={card} />
          ))}
        </div>
      ) : (
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
              Create new contract
            </NavLink>
          </div>
        </SearchingDoc>
      )}
    </div>
  );
};

export default Agreements;