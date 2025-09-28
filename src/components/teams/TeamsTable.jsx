import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import expenseavatar from "../../assets/svg/expenseavatar.svg";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
        <div className="flex items-center px-4 justify-between font-medium  gap-10 lg:justify-self-start xl:text-xl">
          <h2 className="flex items-center gap-1 ">
            Active Developers
            <GoDotFill className="text-[#008000]" />
          </h2>

          <SearchInput />
        </div>

        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="flex justify-between font-medium px-[18px] py-[22px] rounded-lg xl:flex-row xl:items-center xl:px-10  xl:py-[20px] "
              style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
            >
              <div className="xl:flex xl:items-center">
                <div className="flex gap-[10px] xl:items-center">
                  <img src={expenseavatar} alt="profile photo" />
                  <div className="xl:flex">
                    <div className="text-sm xl:text-sm">{employee.fullName}</div>
                    <div className="text-[0.75rem] xl:text-sm xl:ml-[110px]">
                      {employee.country}
                    </div>
                  </div>
                </div>

                <div className="text-[0.75rem] xl:text-sm mt-[13px] xl:mt-0">
                  {employee.position}
                </div>
              </div>
              <div
                className="px-[10px] py-[3px] rounded-[4px] text-[0.5rem] max-h-max xl:hidden"
                style={{ backgroundColor: " rgba(0, 128, 0, 0.20)" }}
              >
                {employee.status}
              </div>
              <div className="flex justify-between gap-[50px] xl:flex-row-reverse xl:ml-[50px]">
                <div className="text-sm flex flex-col justify-between">
                  {employee.amount}

                  <div
                    className="py-[7px] px-[9px] font-semibold text-[0.625rem] text-center pr-bg-clr text-white rounded-lg max-w-max"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    <Link
                    // to="/dashboard/add-developer"
                    >
                      Terminate
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[21px] hidden xl:w-full lg:block whitespace-nowrap">
          <div
            className="grid grid-cols-9 gap-5 font-medium mb-[15px] px-10 text-sm"
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
            {employees.map((employee, index) => (
              <div key={index} className="flex flex-col gap-[10px]">
                <div
                  className="grid grid-cols-9 items-center gap-5 px-10 py-5 rounded-lg text-sm font-medium"
                  style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="flex items-center gap-[10px]">
                    <div
                      className="w-9 h-9 rounded-full"
                      //   style={{ backgroundColor: "#D9D9D9" }}
                    >
                      <img src={expenseavatar} alt="profile photo" />
                    </div>
                    <div>{employee.fullName}</div>
                  </div>
                  <div className="truncate">{employee.email}</div>
                <div className="truncate">{employee.roleTitle}</div>
                <div className="truncate">{employee.country}</div>
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
                    className="py-[1em] px-[2em]  font-semibold text-[0.625rem] text-center pr-bg-clr text-white rounded-lg max-w-max xl:text-[0.75rem] xl:p-[9px]"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    <Link
                    // to="/dashboard/add-developer"
                    >
                      Terminate
                    </Link>
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
