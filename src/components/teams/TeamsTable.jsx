import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import expenseavatar from "../../assets/svg/expenseavatar.svg";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";

const baseUrl = "https://pedxo-back-project.onrender.com";

const TeamsTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // 1. Get all hires first
        const hiresRes = await fetch(`${baseUrl}/hire/get-all-hires`);
        if (!hiresRes.ok) throw new Error(`Error: ${hiresRes.status}`);
        const hiresData = await hiresRes.json();

        // hiresData should be an array of hires with their IDs
        const hireIds = hiresData?.data?.map((h) => h._id) || [];

        // 2. Fetch assigned employees for each hire
        const allAssigned = [];
        for (const id of hireIds) {
          const res = await fetch(`${baseUrl}/hire/assigned-by-hire?hireId=${id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.data)) {
              allAssigned.push(...data.data); // flatten into one array
            }
          }
        }

        // 3. Update state with merged employees
        setEmployees(allAssigned);
        console.log("All assigned employees:", allAssigned);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load assigned employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <section>
      <div>
        {/* Header Section */}
        <div className="flex items-center px-4 justify-between font-medium gap-10 lg:justify-self-start xl:text-xl">
          <h2 className="flex items-center gap-1 ">
            Active Developers
            <GoDotFill className="text-[#008000]" />
          </h2>
          <SearchInput />
        </div>

        {/* Loading & Error States */}
        {loading && <p className="px-4 mt-4 text-sm text-gray-500">Loading...</p>}
        {error && <p className="px-4 mt-4 text-sm text-red-500">{error}</p>}

        {/* Desktop Layout */}
        <div className="mt-6 hidden lg:block">
          {/* Table Header */}
          <div className="grid grid-cols-9 gap-4 font-semibold mb-[12px] px-10 text-xs text-gray-600">
            <div className="truncate">Name</div>
            <div className="truncate">Email</div>
            <div className="truncate">Country</div>
            <div className="truncate">Role</div>
            <div className="truncate">Monthly Pay</div>
            <div className="truncate">Seniority</div>
            <div className="truncate">Frequency</div>
            <div className="truncate">GitHub</div>
            <div className="truncate text-center">Action</div>
          </div>

          {/*  Table Rows */}
          {employees.map((employee, index) => (
            <div
              key={index}
              className="grid grid-cols-9 items-center gap-4 px-10 py-4 rounded-lg text-xs font-medium mb-2"
              style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
            >
              <div className="flex items-center gap-[8px] truncate">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={expenseavatar} alt="profile" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">{employee.fullName}</div>
              </div>
              <div className="truncate">{employee.email}</div>
              <div className="truncate">{employee.country}</div>
              <div className="truncate">{employee.roleTitle}</div>
              <div className="truncate">{employee.paymentRate}</div>
              <div className="truncate">{employee.seniorityLevel}</div>
              <div className="truncate">{employee.paymentFrequency}</div>
              <div className="truncate text-blue-600 underline">
                {employee.githubAccount && (
                  <a href={employee.githubAccount} target="_blank" rel="noreferrer">
                    Profile
                  </a>
                )}
              </div>
              <div
                className="py-[6px] px-[12px] font-semibold text-[0.65rem] text-center text-white rounded-lg max-w-max"
                style={{ backgroundColor: "#FF0000" }}
              >
                <Link>Terminate</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 mt-6 lg:hidden px-4">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 font-medium px-4 py-4 rounded-lg shadow-sm"
              style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
            >
              {/* Top row */}
              <div className="flex gap-3 items-center">
                <img src={expenseavatar} alt="profile" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">{employee.fullName}</div>
                  <div className="text-xs text-gray-600">{employee.email}</div>
                </div>
              </div>

              {/* Details */}
              <div className="text-xs">Country: {employee.country}</div>
              <div className="text-xs">Role: {employee.roleTitle}</div>
              <div className="text-xs">Pay: {employee.paymentRate}</div>
              <div className="text-xs">Seniority: {employee.seniorityLevel}</div>
              <div className="text-xs">Frequency: {employee.paymentFrequency}</div>
              {employee.githubAccount && (
                <div className="text-xs text-blue-600 underline">
                  <a href={employee.githubAccount} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </div>
              )}

              {/* Action */}
              <div
                className="mt-2 py-1 px-3 font-semibold text-xs text-center text-white rounded-lg max-w-max"
                style={{ backgroundColor: "#FF0000" }}
              >
                <Link>Terminate</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsTable;
