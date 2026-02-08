import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";
import {getProfileImagesMapping, getEmployeeKey, profileImages} from "../../utility/profileImages";
import {useGlobalContext} from "../../Context";
import PerformanceReviewModal from "../PerformanceReviewModal";


const baseUrl = import.meta.env.VITE_API_BASE_URL;



const TeamsTable = () => {
  const { signature} = useGlobalContext();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMap, setProfileMap] = useState({});

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [terminating, setTerminating] = useState(false);

  // ADDED: reset key for modal state
  const [modalResetKey, setModalResetKey] = useState(0);
  
  
  // NEW: loader state
  const [showLoader, setShowLoader] = useState(true);
  
  
  // prevents blank screen before effects run
  const [hasMounted, setHasMounted] = useState(false);
  



  /* ---------------- FETCH EMPLOYEES ---------------- */
const fetchEmployees = async () => {
  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");
    if (!token || !token.includes(".")) {
      setError("Authentication expired. Please log in again.");
      return;
    }

    /* FETCH USER CONTRACTS */
    const res = await fetch(
      `${baseUrl}/contracts/get-user-contracts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const json = await res.json();
    console.log("Total Contracts created:", json);
    const rawContracts = Array.isArray(json?.data?.contracts)
      ? json.data.contracts
      : [];

    /*  NORMALIZE CONTRACT IDS  */
    const normalizedContracts = rawContracts
      .map(c => ({
        contractId: c._id || c.contractId || null,
        talentAssignedId: c.talentAssignedId?.[0] || null,
      }))
      .filter(c => c.contractId); // no undefined allowed

    if (!normalizedContracts.length) {
      setEmployees([]);
      return;
    }
    console.log("Contract fetched:", normalizedContracts);

    /* FETCH ASSIGNED TALENTS */
    const assigned = [];

    for (const contract of normalizedContracts) {
      const res = await fetch(
        `${baseUrl}/hire/assigned-by-contract?contractId=${contract.contractId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) continue;

      const data = await res.json();

      if (Array.isArray(data?.data)) {
        assigned.push(
          ...data.data.map(emp => ({
            ...emp,
            contractId: contract.contractId,
            talentAssignedId: contract.talentAssignedId,
          }))
        );
      }
    }

    const sorted = assigned.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log("Fetch Assigned Sorted", sorted);

    setEmployees(sorted);
    setProfileMap(getProfileImagesMapping(sorted));

  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to load employees");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
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


  /* ---------------- STATE FLAGS ---------------- */
  const showEmptyState = !loading && filteredEmployees.length === 0;
  const showTable = !loading && filteredEmployees.length > 0;


  /* ---------------- TERMINATION ---------------- */
  const handleTerminate = (employee) => {
      console.log("Terminate clicked:", employee); // debug
      setSelectedEmployee(employee);
      setShowModal(true);
    };


  const confirmTermination = async ({ rating, note }) => {
    console.log("Confirm clicked", { selectedEmployee, rating, note });


  if (
      !selectedEmployee?.contractId ||
      !selectedEmployee?.talentAssignedId
    ) {
      console.error("Missing termination identifiers", selectedEmployee);
      return;
    }

    setTerminating(true);

    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${baseUrl}/contracts/${selectedEmployee.contractId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            terminationNote: note,
            removeTalentIds: [selectedEmployee.talentAssignedId],
            emailNotification: {
              to: "victor@pedxo.com",
              employeeName: selectedEmployee.fullName,
              roleTitle: selectedEmployee.roleTitle,
              paymentRate: selectedEmployee.paymentRate,
              paymentFrequency: selectedEmployee.paymentFrequency,
            },
          }),
        }
      );

      // ADDED: reset modal state after confirm
      setModalResetKey(prev => prev + 1);

      setShowModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Termination failed:", err);
    } finally {
      setTerminating(false);
    }
  };


  // ---------------- SIGNATURE BLOCK ----------------
  const SignatureBlock = () => (
    <div className={`mb-[39px] ${signature ? "block" : "hidden"}`}>
      <div className="w-full h-[0.5px] bg-[#0000004d]"></div>
      <div className="mt-[39px] max-w-[100px] mx-auto">
        {signature && <img src={signature} alt="user signature" />}
      </div>
    </div>
  );

   
    // ----------------- FORCE 10s LOADER -----------------
    useEffect(() => {
      setHasMounted(true);
  
      const loaderShown = sessionStorage.getItem("overview_loader_shown");
  
      if (loaderShown) {
        setShowLoader(false);
        return;
      }
  
      const timer = setTimeout(() => {
        setShowLoader(false);
        sessionStorage.setItem("overview_loader_shown", "true");
      }, 5000);
  
      return () => clearTimeout(timer);
    }, []);
  
    // SINGLE SOURCE OF TRUTH
    const shouldShowLoader = !hasMounted || showLoader || loading;



  return (
    <section>
      <div>
        {/* Header section*/}
        <div className="flex items-center px-4 justify-between font-medium gap-10 lg:justify-self-start xl:text-xl">
          <h2 className="flex items-center gap-1 ">
            Active Developers
            <GoDotFill className="text-[#008000]" />
          </h2>
          {/* Pass state + setter */}
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* ADDED: inline loader (header stays visible) */}
        {shouldShowLoader && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-[12px] text-gray-600">Loading page...</p>
          </div>
        )}

        {/* -------- MOBILE VIEW -------- */}
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {loading
            && Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col font-medium px-[18px] py-[22px] rounded-lg"
                  style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
                >
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                </div>
              )) }
            {showTable && 
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
                      portfolio

                    </a>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={() => handleTerminate(employee)}
                      className="py-[7px] px-[12px] font-semibold text-[0.7rem] text-center text-white rounded-lg"
                      style={{ backgroundColor: "#FF0000" }}
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              ))}
            {showEmptyState && <SignatureBlock />}
        </div>

        {/* -------- DESKTOP VIEW -------- */}
        <div className="mt-[21px] hidden xl:w-full lg:block">
          {showTable && (
            <>
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
                        portfolio
                      </a>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => handleTerminate(employee)}
                    className="py-[1em] px-[2em] font-semibold text-[0.625rem] text-center text-white rounded-lg max-w-max xl:text-[0.75rem] xl:p-[9px] cursor-pointer"
                    style={{ backgroundColor: "#FF0000" }}
                  >
                    Terminate
                  </div>
                </div>
              </div>
            ))}
          </div>
         </> 
        )}
        {showEmptyState && <SignatureBlock />}
        </div>
      </div>
      {/* MODAL */}
      <PerformanceReviewModal
        isOpen={showModal}
        loading={terminating}
        resetKey={modalResetKey} // ADDED
        onClose={() => {
          setModalResetKey(prev => prev + 1); // ADDED
          setShowModal(false);
        }}
        onConfirm={confirmTermination}
      />
    </section>
  );
};

export default TeamsTable;
