import { useState, useEffect } from "react";
import moneybag from "../assets/svg/moneybag.svg";
import people from "../assets/svg/people.svg";
import telegram from "../assets/svg/telegram.svg";
import onboardIcon1 from "../assets/svg/onboardIcon1.svg";
import onboradIcon2 from "../assets/svg/onboardIcon2.svg";
import add from "../assets/svg/add.svg";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { formatCurrency } from "../utlity/helper";

const Overview = () => {
  const { username } = useUser();
  const [onboardingCount, setOnboardingCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // Assuming 1024px as desktop breakpoint

  // Handle window resize to update isDesktop state
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get contract completion count from sessionStorage
  useEffect(() => {
    const getCompletionCount = () => {
      const count = sessionStorage.getItem("contractCompletionCount");
      return count ? parseInt(count) : 0;
    };

    setOnboardingCount(getCompletionCount());

    // Listen for storage changes to update the count in real-time
    const handleStorageChange = () => {
      setOnboardingCount(getCompletionCount());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Trigger animation when onboardingCount changes
  useEffect(() => {
    if (onboardingCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [onboardingCount]);

  return (
    <section>
      <div>
        <header className="text-center py-2 overflow-banner text-sm font-medium px-[17px] xl:text-[18px]">
          Get creative developers for your code agents
        </header>

        <div className="mx-[19px] mt-10">
          <h1 className="text-[20px] font-Inter font-bold  leading-normal text-[#000000e6]  xl:text-[30px]">
            Welcome, {username}
            <span className="overview-text"></span>
          </h1>
          <p className="text-sm font-Inter font-medium leading-normal grey-text xl:text-[16px]">
            We hope you&apos;re having a good day!
          </p>

          <div className="px-[22px] pt-[21px] pb-[39px] mt-[62px] rounded-3xl overview-expense-bg flex flex-col gap-6 xl:px-[92px]">
            <div>
              <h2 className="font-semibold leading-normal xl:text-[27px] overview-text">
                Total Expenses
              </h2>
              <p className="mb-2 text-sm font-Inter font-medium leading-normal grey-text pr-[51px] xl:text-[16px]">
                Total amount you've spent on your contractors
              </p>

              <div className="flex justify-between bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16">
                <div className="flex items-center gap-4">
                  <img src={moneybag} alt="" />
                  <span className="text-2xl font-semibold leading-normal xl:text-[40px] overview-text">
                    {formatCurrency(0)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold leading-normal xl:text-[27px] overview-text">
                Active Contractors
              </h2>
              <p className="mb-2 text-sm font-Inter font-medium leading-normal grey-text pr-[51px] xl:text-[16px]">
                Current contractors on your team
              </p>

              <div className="flex justify-between bg-white border  rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16">
                <div className="flex items-center gap-4">
                  <img src={people} alt="" />
                  <span className="text-2xl font-semibold leading-normal xl:text-[40px] overview-text">
                    0
                  </span>
                </div>

                <Link
                  to="/dashboard/create-contract"
                  className="flex items-center text-[0.8rem] text-white px-3 py-[10px] sm:px-5 sm:py-[14px] pr-bg-clr rounded-lg font-semibold xl:text-[16px]"
                >
                  <img src={add} alt="" className="w-4 " />
                  <span>Create contract</span>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-semibold leading-normal xl:text-[27px] overview-text">
                Onboarding
              </h2>
              <p className="mb-2 text-sm font-Inter font-medium leading-normal grey-text pr-[51px] xl:text-[16px]">
                Pending contracts on their way
              </p>

              <div className="flex justify-between items-center bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16 overview-text">
                <div className="flex items-center gap-4">
                  {onboardingCount === 0 && <img src={telegram} alt="" />}
                  <span className="text-2xl font-semibold leading-normal xl:text-[40px]">
                    {onboardingCount}
                  </span>
                  {onboardingCount > 0 && (
                    <span className="flex items-center relative w-30">
                      <img
                        src={isDesktop? onboradIcon2 : onboradIcon2}
                        alt=""
                        className={`transition-all duration-700 sm:w-20 w-10 ${
                          isAnimating
                            ? "animate-pulse  continuous-pulse scale-1110"
                            : "animate-pulse scale-1110  continuous-pulse "
                        }`}
                      />
                      <img
                         src={isDesktop ? onboardIcon1 : ''}
                        className={` transition-all duration-700 w-100 sm:w-30 -ml-10 ${
                          isAnimating
                            ? "animate-bounce  continuous-pulse"
                            : "animate-bounce  continuous-bounce "
                        }`}
                        alt=""
                      />
                    </span>
                  )}
                </div>
                {onboardingCount > 0 && (
                  <p className="text-[10px] pl-0 py-[14px] rounded-lg font-medium xl:text-[20px] text-gray-700 transition-all duration-500 animate-pulse  continuous-pulse  hover:scale-105">
                    {isDesktop ? "Working to onboard human" : "Onboarding human"}
                  </p>
                )}
                <div className="text-[8px] pl-5 py-[14px] rounded-lg font-medium xl:text-[16px] text-gray-500">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};
export default Overview;