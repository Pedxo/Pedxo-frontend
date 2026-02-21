import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Add useQueryClient
import { getUserContracts } from "../api";
import moneybag from "../assets/svg/moneybag.svg";
import people from "../assets/svg/people.svg";
import telegram from "../assets/svg/telegram.svg";
import onboardIcon1 from "../assets/svg/onboardIcon1.svg";
import onboardIcon2 from "../assets/svg/onboardIcon2.svg";
import add from "../assets/svg/add.svg";
import { Link, useLocation } from "react-router-dom"; // Add useLocation
import { useUser } from "../context/UserContext";
import { formatCurrency } from "../utility/helper";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  const { username } = useUser();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  const [activeContractors, setActiveContractors] = useState(0);
  const [onboardingCount, setOnboardingCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // State for onboarding progress
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingProgress, setOnboardingProgress] = useState({});
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Force refresh when component mounts or location changes
  useEffect(() => {
    console.log("Overview mounted or location changed, refreshing data");
    setRefreshKey(prev => prev + 1);
    
    // Invalidate and refetch
    if (username) {
      queryClient.invalidateQueries({ 
        queryKey: ["user-contracts", username] 
      });
    }
  }, [location.pathname, username, queryClient]);

  // Fetch contracts - with refreshKey in queryKey to force refetch
  const {
    data: contracts,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user-contracts", username, refreshKey], // Add refreshKey to force refetch
    queryFn: () => getUserContracts(username),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!username,
  });

  // Log when data updates
  useEffect(() => {
    if (contracts) {
      console.log("Contracts updated:", contracts);
    }
  }, [contracts]);

  // Load user-specific currency
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

  // Process contracts data - updates whenever contracts changes
  useEffect(() => {
    if (contracts?.data?.contracts) {
      console.log("Processing contracts data:", contracts.data.contracts);
      const contractsData = contracts.data.contracts;

      let assignedTalentsCount = 0;
      let expenses = 0;

      for (const contract of contractsData) {
        const assignedIds = contract.talentAssignedId || [];

        if (assignedIds.length > 0) {
          assignedTalentsCount += assignedIds.length;
          expenses += Number(contract.paymentRate || 0);
        }
      }

      setActiveContractors(assignedTalentsCount);

      // Onboarding = contracts without assigned talents
      const onboardingContracts = contractsData.filter(
        (contract) =>
          !contract.talentAssignedId || contract.talentAssignedId.length === 0,
      ).length;

      console.log("Onboarding count:", onboardingContracts);
      setOnboardingCount(onboardingContracts);
      setTotalExpenses(expenses);

      // Check if onboarding is complete
      const hasUnassignedContracts = contractsData.some(
        (contract) =>
          !contract.talentAssignedId || contract.talentAssignedId.length === 0,
      );
      setIsOnboardingComplete(!hasUnassignedContracts);
    }
  }, [contracts]);

  // Animation effect for onboarding count
  useEffect(() => {
    if (onboardingCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [onboardingCount]);

  // Onboarding progress simulation
  useEffect(() => {
    // Reset progress when onboarding count changes to 0
    if (onboardingCount === 0) {
      setOnboardingProgress({});
      setCurrentStep(0);
      setIsOnboardingComplete(true);
      return;
    }

    if (onboardingCount > 0 && !isOnboardingComplete) {
      let stepIndex = 0;
      let timers = [];

      // Reset progress
      setOnboardingProgress({});
      setCurrentStep(0);

      const processStep = (stepIndex) => {
        if (stepIndex >= onboardingSteps.length) return;

        const step = onboardingSteps[stepIndex];
        setCurrentStep(stepIndex);

        setOnboardingProgress((prev) => ({
          ...prev,
          [step.id]: { status: "in-progress", name: step.name },
        }));

        // For step 6 (searching engineer), start timer
        if (step.id === 6) {
          setSearchStartTime(Date.now());
        }

        // For step 7, we don't need polling anymore since the query will auto-refresh
        if (step.id === 7) {
          // This step will complete when contracts data shows assigned talents
          // The useEffect above will handle updating isOnboardingComplete
          return;
        }

        // For other steps, complete after duration
        if (step.duration) {
          const timer = setTimeout(() => {
            setOnboardingProgress((prev) => ({
              ...prev,
              [step.id]: { status: "completed", name: step.name },
            }));
            processStep(stepIndex + 1);
          }, step.duration);

          timers.push(timer);
        }
      };

      // Start the process
      processStep(0);

      // Cleanup function
      return () => {
        timers.forEach((timer) => {
          if (typeof timer === "number") {
            clearTimeout(timer);
          }
        });
      };
    }
  }, [onboardingCount, isOnboardingComplete]);

  // Timer for searching engineer step
  useEffect(() => {
    let timer;
    if (currentStep === 5 && searchStartTime) {
      // Step 6 is index 5
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - searchStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, searchStartTime]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Use contracts directly for total expenses if available
  const displayTotalExpenses = contracts?.totalExpenses || totalExpenses;

  // Show loading state
  if (isLoading && !contracts) {
    return (
      <section>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

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
                    {formatCurrency(displayTotalExpenses, currencyCode, locale)}
                  </span>
                </div>
                {isFetching && (
                  <div className="text-xs text-gray-400 animate-pulse">
                    Refreshing...
                  </div>
                )}
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
                <div className="flex items-center gap-4">
                  <img src={people} alt="" />
                  <span className="text-2xl font-semibold xl:text-[40px] overview-text">
                    {activeContractors}
                  </span>
                </div>
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
                  {isFetching ? "Refreshing..." : "Pending"}
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
                            <span className="text-xs sm:text-base text-gray-700 capitalize">
                              {step.name}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
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