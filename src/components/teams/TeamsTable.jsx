import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";

//import default svg profile images into local storage
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


const baseUrl = import.meta.env.VITE_API_BASE_URL;


const profileImages = [
  image1, image2, image3, image4, image5,
  image6, image7, image8, image9, image10,
  image11, image12, image13, image14, image15,
];

// ONE reliable employee key

const getEmployeeKey = (emp) =>
  `${emp.contractId || "no-contract"}::${emp.userId || emp._id || emp.email}`;



// Stable image assignment
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
      const token = localStorage.getItem("token");
      console.log("JWT token:", token);

      if (!token || !token.includes(".")) {
        setError("Authentication expired. Please log in again.");
        return;
      }

      // FETCH TALENTS (USER ACCESSIBLE)
      const talentRes = await fetch(
        `${baseUrl}/contracts/get-user-contracts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const talentJson = await talentRes.json();
      console.log("Talent response:", talentJson);

      // SAFE EXTRACTION (VERY IMPORTANT)
      const talents =
        Array.isArray(talentJson?.data?.contracts)
          ? talentJson.data.contracts
          : [];

      if (!talents.length) {
        console.warn("No talents returned");
        setEmployees([]);
        return;
      }

      const contractIds = talents
        .map(t => t.contractId || t._id)
        .filter(Boolean);

      console.log("Contract IDs:", contractIds);

      //FETCH ASSIGNED BY CONTRACT
      const assigned = [];

      for (const contractId of contractIds) {
        const res = await fetch(
          `${baseUrl}/hire/assigned-by-contract?contractId=${contractId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) continue;

        const json = await res.json();
        console.log(`Assigned for ${contractId}:`, json);

        if (Array.isArray(json?.data)) {
          assigned.push(...json.data);
        }
      }

      const sortedAssigned = [...assigned].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log("FINAL ASSIGNED (sorted):", sortedAssigned);

      setEmployees(sortedAssigned);
      setProfileMap(getProfileImagesMapping(sortedAssigned));

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load employees");
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

                  {/* Seniority Level (badge) */}
                  <div
                    className="mt-3 px-[10px] py-[3px] rounded-[4px] text-[0.65rem] w-max xl:hidden"
                    style={{ backgroundColor: "rgba(0, 128, 0, 0.20)" }}
                  >
                    {employee?.seniorityLevel}
                  </div>

                  {/* Position */}
                  <div className="text-[0.8rem] mt-3">{employee?.roleTitle}</div>
                  <div className="text-[0.8rem] mt-2">{employee?.country}</div>
                  <div className="text-[0.8rem] mt-2">{employee?.paymentRate}</div>
                  <div className="text-[0.8rem] mt-2">{employee?.paymentFrequency}</div>

                  {employee?.githubAccount && (
                    <a
                      href={employee?.githubAccount}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-[0.8rem] mt-2"
                    >
                      Github

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
            <div>Profile</div>
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
                      {/* <img src={expenseavatar} alt="profile photo" /> */}
                      <img
                          src={profileMap[getEmployeeKey(employee)] || profileImages[0]}
                          alt="profile"
                          className="w-9 h-9 rounded-full object-cover"
                        />

                    </div>
                    <div>{employee?.fullName}</div>
                  </div>

                  <a
                    href={`mailto:${employee?.email}`}
                    className="break-words text-black hover:underline"
                  >
                    {employee?.email}
                  </a>

                  <div>{employee?.roleTitle}</div>
                  <div>{employee?.country}</div>
                  <div>{employee?.paymentRate}</div>
                  <div>{employee?.seniorityLevel}</div>
                  <div>{employee?.paymentFrequency}</div>

                  <div className="text-blue-600 underline">
                    {employee?.githubAccount && (
                      <a
                        href={employee?.githubAccount}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Github
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
