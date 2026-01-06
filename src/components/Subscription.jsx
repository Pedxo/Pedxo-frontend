import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"; // Assuming this hook returns a boolean
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    priceMonthly: 42,
    priceType: "/month per seat",
    description:
      "Great for small teams and founders hiring their first contractor",
    features: [
      { id: 1, text: "1 Active Contractor" },
      { id: 2, text: "Compliance Coverage" },
      { id: 3, text: "Automated Contracts" },
      { id: 4, text: "Simple Dashboard" },
      { id: 5, text: "Email Support" },
    ],
    buttonText: "Start free trial",
    buttonColor:
      "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50",
    buttonLink: "/login", // Default link if not logged in
    requiresLogin: true, // Flag to indicate login check is needed
  },
  {
    name: "Growth",
    tag: "MOST POPULAR",
    priceMonthly: 38,
    priceType: "/month per seat",
    description:
      "For teams scaling remote hiring, save more when you scale your team.",
    features: [
      { id: 6, text: "For up to 10 Active Contractors" },
      { id: 7, text: "Bulk Onboarding" },
      { id: 8, text: "FX-locked Payouts" },
      { id: 9, text: "Contractor Portal" },
      { id: 10, text: "Priority Support" },
      { id: 11, text: "Monthly Compliance Reports" },
    ],
    buttonText: "Subscribe",
    buttonColor: "bg-[#387dcd] text-white hover:bg-blue-800",
    buttonLink: "/login", // Default link if not logged in
    requiresLogin: true, // Flag to indicate login check is needed
  },
  {
    name: "Scale",
    tag: "Custom",
    priceMonthly: 0,
    priceType: "/seat",
    description: "Companies managing global payroll at scale",
    features: [
      { id: 12, text: "Unlimited Contractors" },
      { id: 13, text: "Custom Workflows" },
      { id: 14, text: "Dedicated Account Manager" },
      { id: 15, text: "API Access" },
      { id: 16, text: "24/7 Support" },
      { id: 17, text: "Talk to Founders" },
    ],
    buttonText: "Talk to Founders",
    buttonColor: "bg-gray-800 text-white hover:bg-gray-900",
    buttonLink: "mailto:victor@pedxo.com",
    requiresLogin: false,
  },
];

const DISCOUNT_RATE = 0.17; // 17% discount
const DASHBOARD_URL = "/dashboard/create-contract";

const calculateYearlyPrice = (monthlyPrice) => {
  if (monthlyPrice === 0) return "Custom";
  const discountedPrice = monthlyPrice * (1 - DISCOUNT_RATE);
  return discountedPrice.toFixed(2);
};

const PlanCard = ({ plan, isYearly, isLoggedIn }) => {
  const {
    name,
    tag,
    priceMonthly,
    priceType,
    description,
    features,
    buttonText,
    buttonColor,
    buttonLink,
    requiresLogin,
  } = plan;

  const isCustom = name === "Scale";
  const isPopular = tag === "MOST POPULAR";

  const price = isYearly ? calculateYearlyPrice(priceMonthly) : priceMonthly;
  const priceDisplay = isCustom ? "Custom" : `$${price}`;

  const priceTypeDisplay = isCustom ? "/developer" : priceType;

  // Determine the final button link based on login status for Starter/Growth
  const finalButtonLink =
    requiresLogin && isLoggedIn ? DASHBOARD_URL : buttonLink;

  return (
    <div
      className={`relative flex flex-col p-6 rounded-xl border ${
        isPopular ? "bg-white shadow-lg" : "border-gray-200"
      } bg-gray-100 font-Inter transition-all duration-300`}
    >
      {/* MOST POPULAR Tag */}
      {isPopular && (
        <span className="absolute top-2 right-1/2 translate-x-1/2 -mt-3 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-md">
          {tag}
        </span>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-2 min-h-[40px]">
        {name === "Scale" ? "For growing teams" : description}
      </p>

      {/* Price Block */}
      <div className="flex items-end mb-8 min-h-[52px]">
        <span className="text-4xl font-bold text-gray-900">
          {priceDisplay}
        </span>
        <span className="text-lg font-medium text-gray-500 ml-1">
          {priceTypeDisplay}
        </span>
      </div>
      {isPopular && isYearly && (
        <span>
          <p className="text-xs text-gray-500 mb-4">billed annually</p>
          <p className="text-sm mb-8">Save 17% vs monthly</p>
        </span>
      )}
      {/* Button */}
      <Link
        to={finalButtonLink}
        // Use 'buttonText' unless the user is logged in for Starter/Growth
        className={`w-full text-center rounded-full py-2 font-semibold shadow-md transition-colors duration-200 mb-8 ${buttonColor}`}
        target={isCustom ? "_blank" : "_self"}
        rel={isCustom ? "noopener noreferrer" : ""}
      >
        {buttonText}
      </Link>

      {/* Features List */}
      <div className="space-y-4 flex-grow">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature.id} className="flex items-start text-gray-900">
              <CheckCircleIcon className="flex-shrink-0 w-5 h-5 text-gray-500 mr-2 mt-1" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Subscription = () => {
  const [isYearly, setIsYearly] = useState(false);
  const isLoggedIn = useIsLoggedIn(); // Use the hook here

  return (
    <div id='price' className="py-8 px-0 font-Inter">
      <div className="max-w-7xl mx-auto">
        <div className="text-center flex flex-col items-center gap-4 justify-center">
          <h2 className="text-4xl font-bold">Choose Your Plan</h2>
          <p className="max-w-xl text-xl">
            You can always scale as you grow. Pedxo is fully flexible and
            designed to adapt to your enterprise team needs
          </p>
        </div>
        <hr className="my-12" />
        {/* Monthly/Yearly Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-200 p-0.5 gap-2 rounded-full shadow-inner">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                !isYearly
                  ? "bg-gray-100 shadow-lg font-semibold text-black"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-colors duration-300 relative ${
                isYearly
                  ? "bg-gray-100 shadow-lg font-semibold text-black"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Yearly
              <span className="absolute top-0 right-0 -mt-2 -mr-3 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full rotate-6">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="text-center flex justify-center">
          <p className="max-w-sm text-xl">
            {isYearly ? (
              <span className="bg-gray-300 py-1 px-4 text-black text-sm rounded-full">
                💰 Save 17% with yearly billing
              </span>
            ) : (
              ""
            )}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:gap-10 md:grid-cols-3 mt-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              isYearly={isYearly}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
