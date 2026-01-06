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

const Overview = () => {
  const { username } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [locale, setLocale] = useState("en-US");

  // ✅ Fetch contracts filtered by username
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["user-contracts", username],
    queryFn: () => getUserContracts(username),
  });

  // ✅ Load user-specific currency
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

  useEffect(() => {
    if ((contracts?.onboardingCount || 0) > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [contracts?.onboardingCount]);

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
              <h2 className="font-semibold xl:text-[27px] overview-text">Total Expenses</h2>
              <p className="mb-2 text-sm grey-text xl:text-[16px]">
                Total amount you've spent on your contractors
              </p>
              <div className="flex justify-between bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16">
                <div className="flex items-center gap-4">
                  <img src={moneybag} alt="" />
                  <span className="text-2xl font-semibold xl:text-[40px] overview-text">
                    {formatCurrency(contracts?.totalExpenses || 0, currencyCode, locale)}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Contractors */}
            <div>
              <h2 className="font-semibold xl:text-[27px] overview-text">Active Contractors</h2>
              <p className="mb-2 text-sm grey-text xl:text-[16px]">
                Current contractors on your team
              </p>
              <div className="flex justify-between bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16">
                <div className="flex items-center gap-4">
                  <img src={people} alt="" />
                  <span className="text-2xl font-semibold xl:text-[40px] overview-text">
                    {contracts?.activeContractors || 0}
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
              <h2 className="font-semibold xl:text-[27px] overview-text">Onboarding</h2>
              <p className="mb-2 text-sm grey-text xl:text-[16px]">
                Pending contracts on their way
              </p>
              <div className="flex justify-between items-center bg-white border rounded-2xl py-3 px-[21px] xl:py-10 xl:px-16 overview-text">
                <div className="flex items-center gap-4">
                  {contracts?.onboardingCount === 0 && <img src={telegram} alt="" />}
                  <span className="text-2xl font-semibold xl:text-[40px]">
                    {contracts?.onboardingCount || 0}
                  </span>
                  {contracts?.onboardingCount > 0 && (
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
                {contracts?.onboardingCount > 0 && (
                  <p className="text-[12px] pl-5 py-[14px] rounded-lg font-medium xl:text-[20px] text-gray-700 transition-all duration-500 animate-pulse continuous-pulse hover:scale-105">
                    Working to onboard human
                  </p>
                )}
                <div className="text-[10px] pl-5 py-[14px] rounded-lg font-medium xl:text-[16px] text-gray-500">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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