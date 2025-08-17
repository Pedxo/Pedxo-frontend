import moneybag from "../assets/svg/moneybag.svg";
import people from "../assets/svg/people.svg";
import telegram from "../assets/svg/telegram.svg";
import add from "../assets/svg/add.svg";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { formatCurrency } from "../utlity/helper";

const Overview = () => {
  const { username } = useUser();
  
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 text-sm font-medium mb-8 rounded-lg shadow-md">
        Get Expert Developers on Demand and Pay as You Go
      </div>

      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Welcome, <span className="text-indigo-600">{username}</span>
        </h1>
        <p className="text-gray-500 text-lg">
          We hope you&apos;re having a great day!
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Expenses Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Expenses</h3>
              <p className="text-gray-500 text-sm mb-4">
                Total amount spent on contractors
              </p>
              <div className="flex items-center">
                <img src={moneybag} alt="Money bag" className="w-10 h-10 mr-4" />
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Contractors Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Active Contractors</h3>
            <p className="text-gray-500 text-sm mb-4">
              Current contractors on your team
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={people} alt="People" className="w-10 h-10 mr-4" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <Link
                to="/dashboard/create-contract"
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <img src={add} alt="Add" className="w-4 h-4 mr-2" />
                <span>Create contract</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Onboarding</h3>
            <p className="text-gray-500 text-sm mb-4">
              Pending contracts on their way
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={telegram} alt="Telegram" className="w-10 h-10 mr-4" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-12 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        </div>
      </div> */}
    </section>
  );
};

export default Overview;