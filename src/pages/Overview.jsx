import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserContracts } from "../api";
import moneybag from "../assets/svg/moneybag.svg";
import people from "../assets/svg/people.svg";
import telegram from "../assets/svg/telegram.svg";
import onboardIcon1 from "../assets/svg/onboardIcon1.svg";
import onboardIcon2 from "../assets/svg/onboardIcon2.svg";
import add from "../assets/svg/add.svg";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { formatCurrency } from "../utility/helper";


// Define onboarding steps
const onboardingSteps = [
  { id: 1, name: "understanding", duration: 5000 },
  { id: 2, name: "analysing", duration: 5000 },
  { id: 3, name: "processing", duration: 5000 },
  { id: 4, name: "deciding", duration: 5000 },
  { id: 5, name: "indexing", duration: 5000 },
  { id: 6, name: "searching engineer", duration: 30000 },
  { id: 7, name: "onboarding engineer", duration: null },
];

const Overview = () => {
  const { username, userId, user } = useUser();


  const [isAnimating, setIsAnimating] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [locale, setLocale] = useState("en-US");

  const [activeContractors, setActiveContractors] = useState(0);
  const [onboardingCount, setOnboardingCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Onboarding progress state
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingProgress, setOnboardingProgress] = useState({});
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);


 
  // ----------------- REACT QUERY -----------------
  
  const {
    data: contracts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-contracts", userId],
    queryFn: () => getUserContracts(userId),
    // enabled: !!user && !!userId,
    enabled: !!user && !!userId,
    suspense: false,
  });

  useEffect(() => {
  if (userId) {
    refetch();
  }
}, [userId, refetch]);

  // ----------------- USER CURRENCY -----------------
  useEffect(() => {
    const storedCode = localStorage.getItem(`${username}_userCurrencyCode`);
    if (storedCode === "NGN") {
      setCurrencyCode("NGN");
      setLocale("en-NG");
    } else {
      setCurrencyCode("USD");
      setLocale("en-US");
    }
  }, [username]);


  // ----------------- DERIVED CONTRACT DATA (YOUR REQUIRED BLOCK) -----------------
  useEffect(() => {
    if (!contracts?.data?.contracts) return;

    const contractsData = contracts.data.contracts;
    console.log("Feteched contracts", contractsData);

    let expenses = 0;
    let activeTalents = 0;

    // contractsData.forEach((contract) => {
    //   const assigned = (contract.talentAssignedId || []).filter(Boolean);
      

    //   if (assigned.length > 0) {
    //     activeTalents += assigned.length;
    //     expenses += Number(contract.paymentRate || 0);
    //   }
    // });
    contractsData.forEach((contract) => {
    const assigned = Array.isArray(contract.talentAssignedId)
      ? [...new Set(contract.talentAssignedId.filter(Boolean))] // remove duplicates
      : [];

    if (assigned.length > 0) {
      activeTalents += assigned.length;
      expenses += Number(contract.paymentRate || 0);

    //FIXED
    //expenses += assigned.length * Number(contract.paymentRate || 0);
     }
    });

    // const onboardingContracts = contractsData.filter((contract) => {
    //   const assigned = (contract.talentAssignedId || []).filter(Boolean);
    //   //console.log("Total Assigned Contract: ", assigned);
    //   return assigned.length === 0;
    // }).length;

    // ONLY contracts with ZERO assigned talents
    const onboardingContracts = contractsData.filter((contract) => {
      const assigned = Array.isArray(contract.talentAssignedId)
        ? contract.talentAssignedId.filter(Boolean)
        : [];
      console.log("Total Assigned Contract: ", assigned);
      return assigned.length === 0;
    }).length;


    setActiveContractors(activeTalents);
    setOnboardingCount(onboardingContracts);
    setTotalExpenses(expenses);
    setIsOnboardingComplete(onboardingContracts === 0);
  }, [contracts]);

  // ----------------- ONBOARDING COUNT ANIMATION -----------------
  useEffect(() => {
    if (onboardingCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [onboardingCount]);

  // ----------------- ONBOARDING PROGRESS SIMULATION -----------------
  useEffect(() => {
    if (onboardingCount > 0 && !isOnboardingComplete) {
      let timers = [];
      setOnboardingProgress({});
      setCurrentStep(0);

      const processStep = (index) => {
        if (index >= onboardingSteps.length) return;

        const step = onboardingSteps[index];
        setCurrentStep(index);

        setOnboardingProgress((prev) => ({
          ...prev,
          [step.id]: { status: "in-progress", name: step.name },
        }));

        if (step.id === 6) setSearchStartTime(Date.now());

        if (step.id === 7) {
          const poll = setInterval(async () => {
            await refetch();
            const data = contracts?.data?.contracts || [];

            const hasTalent = data.some(
              (c) => c.talentAssignedId?.length > 0
            );

            if (hasTalent) {
              clearInterval(poll);
              setIsOnboardingComplete(true);
            }
          }, 5000);

          timers.push(poll);
          return;
        }

        if (step.duration) {
          const timer = setTimeout(() => {
            setOnboardingProgress((prev) => ({
              ...prev,
              [step.id]: { status: "completed", name: step.name },
            }));
            processStep(index + 1);
          }, step.duration);

          timers.push(timer);
        }
      };

      processStep(0);

      return () => timers.forEach((t) => clearTimeout(t));
    }
  }, [onboardingCount, isOnboardingComplete, contracts, refetch]);

  // ----------------- SEARCH TIMER -----------------
  useEffect(() => {
    if (currentStep === 5 && searchStartTime) {
      const timer = setInterval(() => {
        setElapsedTime(
          Math.floor((Date.now() - searchStartTime) / 1000)
        );
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, searchStartTime]);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const displayTotalExpenses = totalExpenses;


  // ----------------- JSX (UNCHANGED LAYOUT) -----------------
  return (
    <section>
          <div>
            <header className="text-center py-2 overflow-banner text-sm font-medium px-[17px] xl:text-[18px]">
              Onboard the right prompt engineers autonomously
            </header>
    
            <div className="mx-[19px] mt-10">
              <h1 className="text-[20px] font-Inter font-bold leading-normal text-[#000000e6] xl:text-[30px]">
                Welcome, {username}
              </h1>
              <p className="text-sm font-Inter font-medium leading-normal grey-text xl:text-[16px]">
                I hope you're having a good day!
              </p>
    
              <div className="px-[22px] pt-[21px] pb-[39px] mt-[62px] rounded-3xl overview-expense-bg flex flex-col gap-6 xl:px-[92px]">
                {/* Total Expenses */}
                <div>
                  <h2 className="font-semibold xl:text-[27px] overview-text">
                    Total Expenses
                  </h2>
                  <p className="mb-2 text-sm grey-text xl:text-[16px]">
                    Total amount you've spent on your contractors
                  </p>
                  <div className="flex justify-between bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16">
                    <div className="flex items-center gap-4">
                      <img src={moneybag} alt="" />
                      <span className="text-2xl font-semibold xl:text-[40px] overview-text">
                        {/* ₦{displayTotalExpenses.toLocaleString()} */}
                        {formatCurrency(displayTotalExpenses, "NGN", "en-NG")}
                      </span>
                      {/* <span className="text-2xl font-semibold xl:text-[40px] overview-text">
                        $0.00
                      </span> */}
                    </div>
                  </div>
                </div>
    
                {/* Active Contractors */}
                <div>
                  <h2 className="font-semibold xl:text-[27px] overview-text">
                    Active Contractors
                  </h2>
                  <p className="mb-2 text-sm grey-text xl:text-[16px]">
                    Current contractors on your team
                  </p>
                  <div className="flex justify-between bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16">
                    <Link to="/dashboard/teams" className="flex items-center gap-4">
                      <img src={people} alt="" />
                      <span className="text-2xl font-semibold xl:text-[40px] overview-text">
                        {/* {contracts?.activeContractors || 0} */}
                         {activeContractors}
                      </span>
                    </Link>
                    <Link
                      to="/dashboard/create-contract"
                      className="flex items-center text-[0.8rem] text-white px-3 py-[10px] sm:px-5 sm:py-[14px] pr-bg-clr shadow-xl rounded-lg font-semibold xl:text-[16px]"
                    >
                      <img src={add} alt="" className="w-4" />
                      <span>Create contract</span>
                    </Link>
                  </div>
                </div>
    
                {/* Onboarding */}
                <div>
                  <h2 className="font-semibold xl:text-[27px] overview-text">
                    Onboarding
                  </h2>
                  <p className="mb-2 text-sm grey-text xl:text-[16px]">
                    Pending contracts on their way
                  </p>
                  <div className="flex justify-between items-center bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16 overview-text">
                    <div className="flex items-center gap-4">
                      {onboardingCount === 0 && <img src={telegram} alt="" />}
                      <span className="text-2xl font-semibold xl:text-[40px]">
                        {/* {contracts?.onboardingCount || 0} */}
                         {onboardingCount}
                      </span>
                      {onboardingCount > 0 && (
                        <span className="flex items-center relative">
                          <img
                            src={onboardIcon2}
                            alt=""
                            className={`transition-all duration-700 ${
                              isAnimating
                                ? "animate-pulse continuous-pulse scale-1110"
                                : "animate-pulse scale-1110 continuous-pulse"
                            }`}
                          />
                          <img
                            src={onboardIcon1}
                            className={`-ml-10 transition-all duration-700 ${
                              isAnimating
                                ? "animate-bounce continuous-pulse"
                                : "animate-bounce continuous-bounce"
                            }`}
                            alt=""
                          />
                          {isAnimating && (
                            <>
                              <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                              <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    {onboardingCount > 0 && (
                      <p className="text-[12px] pl-5 py-[14px] rounded-lg font-medium xl:text-[20px] text-gray-700 transition-all duration-500 animate-pulse continuous-pulse hover:scale-105">
                        Working to onboard human
                      </p>
                    )}
                    <div className="text-[10px] pl-5 py-[14px] rounded-lg font-medium xl:text-[16px] text-gray-500">
                      Pending
                    </div>
                  </div>
                </div>
    
                {/* Onboarding Progress Display - Only show when onboardingCount > 0 */}
                {onboardingCount > 0 && !isOnboardingComplete && (
                  <div className="mt-8 p-6 bg-white border rounded-2xl shadow-sm animate-fadeIn">
                    <div className="space-y-4">
                      {onboardingSteps.map((step, index) => {
                        const stepProgress = onboardingProgress[step.id];
                        const isCurrent = currentStep === index;
    
                        return (
                          <div key={step.id} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 capitalize">
                                  {step.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {stepProgress?.status === "completed" ? (
                                   <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                                  ) : isCurrent ? (
                                    step.id === 6 ? (
                                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                                    ) : step.id === 7 ? (
                                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                                    ) : (
                                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                                    )
                                  ) : (
                                    <span className="text-gray-400">pending</span>
                                  )}
                                </span>
                              </div>
                              {isCurrent && step.id === 6 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Searching for available engineers... (
                                  {formatTime(elapsedTime)} elapsed)
                                </div>
                              )}
                              {isCurrent && step.id === 7 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Waiting for engineer assignment to contract...
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
    
                    {isOnboardingComplete && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-lg">✓</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800">
                              Onboarding Complete!
                            </h4>
                            <p className="text-sm text-green-600">
                              Engineer has been assigned to your contract.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
  );
};

export default Overview;
