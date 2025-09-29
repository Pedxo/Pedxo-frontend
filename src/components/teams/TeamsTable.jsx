import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import expenseavatar from "../../assets/svg/expenseavatar.svg";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const TeamsTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const hiresRes = await fetch(`${baseUrl}/hire/get-all-hires`);
        if (!hiresRes.ok) throw new Error(`Error: ${hiresRes.status}`);
        const hiresData = await hiresRes.json();

        const hireIds = hiresData?.data?.map((h) => h._id) || [];

        const allAssigned = [];
        for (const id of hireIds) {
          const res = await fetch(
            `${baseUrl}/hire/assigned-by-hire?hireId=${id}`
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.data)) {
              allAssigned.push(...data.data);
            }
          }
        }

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

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.fullName?.toLowerCase().includes(lower) ||
        emp.roleTitle?.toLowerCase().includes(lower) ||
        emp.country?.toLowerCase().includes(lower) ||
        String(emp.paymentRate).toLowerCase().includes(lower)
    );
  }, [searchTerm, employees]);

  return (
    <section>
      <div>
        {/* Header */}
        <div className="flex items-center px-4 justify-between font-medium gap-10 lg:justify-self-start xl:text-xl">
          <h2 className="flex items-center gap-1 ">
            Active Developers
            <GoDotFill className="text-[#008000]" />
          </h2>
          {/* Pass state + setter */}
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* -------- MOBILE VIEW -------- */}
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col font-medium px-[18px] py-[22px] rounded-lg"
                  style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
                >
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                </div>
              ))
            : filteredEmployees.map((employee, index) => (
                <div
                  key={index}
                  className="flex flex-col font-medium px-[18px] py-[22px] rounded-lg xl:flex-row xl:items-center xl:px-10 xl:py-[20px]"
                  style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
                >
                  {/* Name + Email */}
                  <div className="flex gap-[10px] items-center">
                    <img src={expenseavatar} alt="profile" />
                    <div className="flex flex-col">
                      <div className="text-sm">{employee.fullName}</div>
                      <a
                        href={`mailto:${employee.email}`}
                        className="text-sm text-black hover:underline"
                      >
                        {employee.email}
                      </a>
                    </div>
                  </div>

                  {/* Seniority Level (badge) */}
                  <div
                    className="mt-3 px-[10px] py-[3px] rounded-[4px] text-[0.65rem] w-max xl:hidden"
                    style={{ backgroundColor: "rgba(0, 128, 0, 0.20)" }}
                  >
                    {employee.seniorityLevel}
                  </div>

                  {/* Position */}
                  <div className="text-[0.8rem] mt-3">{employee.roleTitle}</div>
                  <div className="text-[0.8rem] mt-2">{employee.country}</div>
                  <div className="text-[0.8rem] mt-2">{employee.paymentRate}</div>

                  {employee.githubAccount && (
                    <a
                      href={employee.githubAccount}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-[0.8rem] mt-2"
                    >
                      Profile
                    </a>
                  )}

                  <div className="mt-4">
                    <button
                      className="py-[7px] px-[12px] font-semibold text-[0.7rem] text-center text-white rounded-lg"
                      style={{ backgroundColor: "#FF0000" }}
                    >
                      <Link>Terminate</Link>
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* -------- DESKTOP VIEW -------- */}
        <div className="mt-[21px] hidden xl:w-full lg:block">
          <div
            className="grid grid-cols-9 gap-5 font-medium mb-[15px] px-10 text-sm whitespace-nowrap"
            style={{ color: "rgba(0, 0, 0, 0.60)" }}
          >
            <div>Name</div>
            <div>Email</div>
            <div>Position</div>
            <div>Country</div>
            <div>Pay</div>
            <div>Seniority Level</div>
            <div>Frequency</div>
            <div>GitHub</div>
            <div>Action</div>
          </div>
          <div>
            {filteredEmployees.map((employee, index) => (
              <div key={index} className="flex flex-col gap-[10px]">
                <div
                  className="grid grid-cols-9 items-center gap-5 px-10 py-5 rounded-lg text-sm font-medium"
                  style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="flex items-center gap-[10px]">
                    <div className="w-9 h-9 rounded-full">
                      <img src={expenseavatar} alt="profile photo" />
                    </div>
                    <div>{employee.fullName}</div>
                  </div>

                  <a
                    href={`mailto:${employee.email}`}
                    className="break-words text-black hover:underline"
                  >
                    {employee.email}
                  </a>

                  <div>{employee.roleTitle}</div>
                  <div>{employee.country}</div>
                  <div>{employee.paymentRate}</div>
                  <div>{employee.seniorityLevel}</div>
                  <div>{employee.paymentFrequency}</div>

                  <div className="text-blue-600 underline">
                    {employee.githubAccount && (
                      <a
                        href={employee.githubAccount}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Profile
                      </a>
                    )}
                  </div>

                  <div
                    className="py-[1em] px-[2em] font-semibold text-[0.625rem] text-center text-white rounded-lg max-w-max xl:text-[0.75rem] xl:p-[9px]"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    <Link>Terminate</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamsTable;
