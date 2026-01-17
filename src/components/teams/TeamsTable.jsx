import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";
import Loader from "../Loader";
import EmptyState from "../../ui/emptyState";
import { getAllAssignedEmployees } from "../../services/contractService";
import image1 from "../../assets/svg/image1.svg";
import image2 from "../../assets/svg/image2.svg";
import image3 from "../../assets/svg/image3.svg";
import image4 from "../../assets/svg/image4.svg";
import image5 from "../../assets/svg/image5.svg";
import image6 from "../../assets/svg/image6.svg";
import image7 from "../../assets/svg/image7.svg";
import image8 from "../../assets/svg/image8.svg";
import image9 from "../../assets/svg/image9.svg";
import image10 from "../../assets/svg/image10.svg";
import image11 from "../../assets/svg/image11.svg";
import image12 from "../../assets/svg/image12.svg";
import image13 from "../../assets/svg/image13.svg";
import image14 from "../../assets/svg/image14.svg";
import image15 from "../../assets/svg/image15.svg";

const profileImages = [
  image1, image2, image3, image4, image5,
  image6, image7, image8, image9, image10,
  image11, image12, image13, image14, image15,
];

const getEmployeeKey = (emp) =>
  `${emp.contractId || "no-contract"}::${emp.userId || emp._id || emp.email}`;


const getProfileImagesMapping = (employees) => {
  const stored = JSON.parse(localStorage.getItem("employeeImages") || "{}");
  const mapping = { ...stored };
  let imageIndex = Object.keys(mapping).length;

  employees.forEach((emp) => {
    const key = getEmployeeKey(emp);
    if (!key) return;

    if (!mapping[key]) {
      mapping[key] = profileImages[imageIndex % profileImages.length];
      imageIndex++;
    }
  });

  localStorage.setItem("employeeImages", JSON.stringify(mapping));
  return mapping;
};

const TeamsTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMap, setProfileMap] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError("");

      try {
        const assignedEmployees = await getAllAssignedEmployees();
        
        setEmployees(assignedEmployees);
        setProfileMap(getProfileImagesMapping(assignedEmployees));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load employees");
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
          <h2 className="flex items-center gap-1">
            Active Developers
            <GoDotFill className="text-[#008000]" />
          </h2>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* -------- MOBILE VIEW -------- */}
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {loading ? (
            <Loader />
          ) : filteredEmployees.length === 0 ? (
            <EmptyState
              icon="👥"
              title="There are no assigned employees at the moment."
              message="No Employees Found"
            />
          ) : (
            filteredEmployees.map((employee, index) => (
              <div
                key={index}
                className="flex flex-col font-medium px-[18px] py-[22px] rounded-lg xl:flex-row xl:items-center xl:px-10 xl:py-[20px]"
                style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
              >
                {/* Name + Email */}
                <div className="flex gap-[10px] items-center">
                  <img
                    src={profileMap[getEmployeeKey(employee)] || profileImages[0]}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <div className="text-sm">{employee?.fullName}</div>
                    <a
                      href={`mailto:${employee?.email}`}
                      className="text-sm text-black hover:underline"
                    >
                      {employee?.email}
                    </a>
                  </div>
                </div>

                {/* Seniority Level */}
                <div
                  className="mt-3 px-[10px] py-[3px] rounded-[4px] text-[0.65rem] w-max xl:hidden"
                  style={{ backgroundColor: "rgba(0, 128, 0, 0.20)" }}
                >
                  {employee?.seniorityLevel}
                </div>

                {/* Details */}
                <div className="text-[0.8rem] mt-3">{employee?.roleTitle}</div>
                <div className="text-[0.8rem] mt-2">{employee?.country}</div>
                <div className="text-[0.8rem] mt-2">{employee?.paymentRate}</div>
                <div className="text-[0.8rem] mt-2">{employee?.paymentFrequency}</div>

                {/* Links */}
                {employee?.githubAccount && employee.portfolio && (
                  <div className="flex flex-col">
                    <a
                      href={employee?.githubAccount}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-[0.8rem] mt-2"
                    >
                      Github
                    </a>
                    <a
                      href={employee?.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-[0.8rem] mt-2"
                    >
                      Portfolio
                    </a>
                  </div>
                )}

                {/* Terminate Button */}
                <div className="mt-4">
                  <button
                    className="py-[7px] px-[12px] font-semibold text-[0.7rem] text-center text-white rounded-lg"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    <Link>Terminate</Link>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* -------- DESKTOP VIEW -------- */}
        <div className="mt-[21px] hidden xl:w-full lg:block">
          {loading ? (
            <Loader />
          ) : filteredEmployees.length === 0 ? (
            <EmptyState
              icon="👥"
              title="There are no assigned employees at the moment."
              message="No Employees Found"
            />
          ) : (
            <>
              {/* Table Headers */}
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
                <div>Profile</div>
                <div>Action</div>
              </div>

              {/* Table Rows */}
              <div>
                {filteredEmployees.map((employee, index) => (
                  <div key={index} className="flex flex-col gap-[10px]">
                    <div
                      className="grid grid-cols-9 items-center gap-5 px-10 py-5 rounded-lg text-sm font-medium"
                      style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
                    >
                      {/* Name */}
                      <div className="flex items-center gap-[10px]">
                        <img
                          src={profileMap[getEmployeeKey(employee)] || profileImages[0]}
                          alt="profile"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>{employee?.fullName}</div>
                      </div>

                      {/* Email */}
                      <a
                        href={`mailto:${employee?.email}`}
                        className="break-words text-black hover:underline"
                      >
                        {employee?.email}
                      </a>

                      {/* Position, Country, Pay, etc. */}
                      <div>{employee?.roleTitle}</div>
                      <div>{employee?.country}</div>
                      <div>{employee?.paymentRate}</div>
                      <div>{employee?.seniorityLevel}</div>
                      <div>{employee?.paymentFrequency}</div>

                      {/* Profile Links */}
                      <div className="text-blue-600 underline">
                        {employee?.githubAccount && employee.portfolio && (
                          <div className="flex flex-col">
                            <a
                              href={employee?.githubAccount}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Github
                            </a>
                            <a
                              href={employee?.portfolio}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Portfolio
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Terminate Button */}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamsTable;