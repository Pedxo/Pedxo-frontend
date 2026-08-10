import { useEffect, useState, useMemo } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import SearchInput from "../../components/SearchInput";
import { GoDotFill } from "react-icons/go";
import {
  getProfileImagesMapping,
  getEmployeeKey,
  profileImages,
} from "../../utility/profileImages";
import PerformanceReviewModal from "../PerformanceReviewModal";
import SearchingDoc from "../../components/SearchingDoc"; 
import { useUser } from "../../context/UserContext";
import authFetch from "../../api"; 
import toast from "react-hot-toast";
import { formatCurrency } from "../../utility/helper";
import SocialProfileModal from "../SocialProfileModal";
import {FaUser, FaEnvelope, FaGithub, FaGlobe, FaPhoneAlt} from "react-icons/fa";
import PhoneContactModal from "../PhoneContactModal";
import RiderAddressCard from "../../components/RiderAddressCard.jsx";


const TeamsTable = () => {
  const { userId } = useUser();

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

  /* ---------------- SOCIAL PROFILE MODAL ---------------- */
const [showSocialModal, setShowSocialModal] = useState(false);
const [selectedSocialEmployee, setSelectedSocialEmployee] = useState(null);

// Rider Address Component
const [selectedRider, setSelectedRider] = useState(null);

/* ----------------------------------------------------
   PHONE CONTACT MODAL
----------------------------------------------------- */

const [showPhoneModal, setShowPhoneModal] = useState(false);

const [selectedPhoneEmployee, setSelectedPhoneEmployee] = useState(null);

  /* ---------------- FETCH EMPLOYEES ---------------- */
const fetchEmployees = async () => {
  setLoading(true);
  setError("");

  try {
    //const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token =
        localStorage.getItem("token") ||
        storedUser?.accessToken;

    console.log("User loggedIn token:", storedUser?.accessToken);
    console.log("User ID:", userId);

  

    /* FETCH USER CONTRACTS */
    
    const response = await authFetch.get(
        "/contracts/get-user-contracts",
        { params: { userId } }
      );

    //const json = response.data;


    console.log("Contracts fetched:", response.data);
    const rawContracts = Array.isArray(response?.data?.data?.contracts)
      ? response.data.data.contracts
      : [];

    console.log("Total Contracts created:", rawContracts.length); 
 
    /*  NORMALIZE CONTRACT IDS  */
    const normalizedContracts = rawContracts
      .map((c) => ({
        contractId: c._id || c.contractId || null,
        talentAssignedIds: Array.isArray(c.talentAssignedId)
          ? [...new Set(c.talentAssignedId)].filter(
              (id) => typeof id === "string" && id.trim() !== ""
            )
          : [],
      }))
      .filter((c) => c.contractId);

    if (!normalizedContracts.length) {
      setEmployees([]);
      return;
    }

    console.log("normalized Contract fetched:", normalizedContracts); //This should display on console

    /* FETCH ASSIGNED TALENTS */
    const assignedResults = await Promise.all(
      normalizedContracts.map(async (contract) => {
        try {
          const assignedRes = await authFetch.get(
            "/hire/assigned-by-contract",
            {
              params: { contractId: contract.contractId },
            }
          );

          console.log(
            "Assigned developers for contract",
            contract.contractId,
            assignedRes.data
          );
    
          const assignedJson = assignedRes.data;
    
          if (!Array.isArray(assignedJson?.data)) return [];
    
          const ids = contract.talentAssignedIds || [];
    
          return assignedJson.data.map((emp, index) => ({
            ...emp,
            contractId: contract.contractId,
            talentAssignedId: ids[index] || null,
          }));
        } catch (err) {
          console.error(
            "Failed fetching assigned devs for contract:",
            contract.contractId,
            err
          );
    
          return [];
        }
      })
    );
    
    const assigned = assignedResults.flat();

      const sorted = assigned.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
  if (!userId) {
      console.warn("UserId not ready yet");
      return;
    }

  fetchEmployees();
}, [userId]);

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.fullName?.toLowerCase().includes(lower) ||
        emp.roleTitle?.toLowerCase().includes(lower) ||
        emp.country?.toLowerCase().includes(lower) ||
        String(emp.paymentRate).toLowerCase().includes(lower),
    );
  }, [searchTerm, employees]);

  /* ---------------- STATE FLAGS ---------------- */
  const showEmptyState = !loading && filteredEmployees.length === 0;
  const showTable = !loading && filteredEmployees.length > 0;


  /* ---------------- OPEN SOCIAL PROFILE MODAL ---------------- */
const handleOpenSocialProfiles = (employee) => {
  setSelectedSocialEmployee(employee);
  setShowSocialModal(true);
};

/* -----------------------------------------
   OPEN PHONE CONTACT MODAL
   Opens the mini popup that allows user
   to Call or WhatsApp the talent.
------------------------------------------- */

const handleOpenPhoneModal = (employee) => {
  setSelectedPhoneEmployee(employee);
  setShowPhoneModal(true);
};

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
    !selectedEmployee?.talentAssignedId ||
    String(selectedEmployee.talentAssignedId).trim() === ""
    ) {
      console.error("Missing termination identifiers", selectedEmployee);
      toast.error("Missing termination identifiers");
      return;
    }

    setTerminating(true);

    try {
            
      const res = await authFetch.patch(
        `/contracts/${selectedEmployee.contractId}`,
        {
          performanceRating: rating,
          terminationReason: note,
          removeTalentIds: [selectedEmployee.talentAssignedId],

          emailNotification: {
            to: "victor@pedxo.com",
            employeeName: selectedEmployee.fullName,
            roleTitle: selectedEmployee.roleTitle,
            paymentRate: selectedEmployee.paymentRate,
            paymentFrequency: selectedEmployee.paymentFrequency,
            performanceRating: rating,
            terminationReason: note,
          }
        },
      );

      const data = await res.data;

      console.log("PATCH status:", res.status);
      console.log("PATCH response:", data);

      // Correct success check
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res?.data?.message || "Termination failed");
      }

     // SUCCESS TOAST
     toast.success("Contract terminated successfully");

      // ADDED: reset modal state after confirm
      setModalResetKey((prev) => prev + 1);

    /* ---------------- OPTIMISTIC UI UPDATE ---------------- */
    setEmployees(prevEmployees =>
    prevEmployees.filter(
      emp =>
        !(
          emp.talentAssignedId === selectedEmployee.talentAssignedId &&
          emp.contractId === selectedEmployee.contractId 
        )
      )
    );

     /* ---------------- CLOSE MODAL ---------------- */
      setShowModal(false);
      setSelectedEmployee(null);

      // ADDED: reset modal state after confirm
      setModalResetKey(prev => prev + 1);

      /* ---------------- OPTIONAL BACKGROUND REFRESH ---------------- */
      await fetchEmployees();

    } catch (err) {
      console.error("Termination failed:", err);
    } finally {
      setTerminating(false);
    }
  };

  /* ---------------- EMPTY STATE COMPONENT ---------------- */
  const EmptyTeamsState = () => (
    <SearchingDoc
      noticeText="Add devs and pay them to see their records here."
      searchingdocTitle="No Active Developer yet"
      searchingdocText="They would appear here once a developer has been assigned to a contract"
      onBoarding={[
        {
          id: "1",
          title: "Create a contract",
          desp: "Start by creating a contract for your developer.",
        },
        {
          id: "2",
          title: "Assign a developer",
          desp: "Once assigned, they will appear in this Active Developers tab.",
        },
      ]}
    >
      <div className="mt-[33px]">
        <NavLink
          to="/dashboard/create-contract"
          className="flex items-center text-[0.8rem] text-white px-3 py-[10px] sm:px-5 sm:py-[14px] pr-bg-clr rounded-lg font-semibold xl:text-[16px]"
        >
          <img src={""} alt="" className="w-4 mr-1" /> Create new contract
        </NavLink>
      </div>
    </SearchingDoc>
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



  
   // Opens Rider Address component.
   // Only Riders are allowed.

const handleOpenRiderAddress = (employee) => {

  if (
    employee.roleTitle?.trim().toLowerCase() !== "rider"
  ) {
    return;
  }

  setSelectedRider(employee);
};

  // SINGLE SOURCE OF TRUTH
  const shouldShowLoader = !hasMounted || showLoader || loading;

  // if (selectedRider) {
  //   return (
  //     <RiderAddressCard
  //       employee={selectedRider}
  //       onBack={() => setSelectedRider(null)}
  //       profileImage={
  //         profileMap[getEmployeeKey(selectedRider)] ||
  //         profileImages[0]
  //       }
  //     />
  //   );
  // }

  return (
    <section>
      <div>
        {/* Header section*/}
        <div className="flex items-center px-4 justify-between font-medium gap-10 lg:justify-self-start xl:text-xl">
          <span  className="space-y-1">
            <h2 className="flex items-center gap-1 ">
              Active Developers
              <GoDotFill className="text-[#008000]" />
            </h2>
            <p className="mb-2 text-sm grey-text xl:text-[14px]">
              Agent onboarded developers
            </p>
          </span>
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

         {/* =====================================================
          RIDER ADDRESS PAGE
          Appears BELOW the header/search input
        ====================================================== */}
        {!shouldShowLoader && selectedRider && (
          <div className="mt-[21px]">
            <RiderAddressCard
              employee={selectedRider}
              onBack={() => setSelectedRider(null)}
              profileImage={
                profileMap[getEmployeeKey(selectedRider)] ||
                profileImages[0]
              }
            />
          </div>
        )}

        {/* -------- MOBILE VIEW -------- */}
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col font-medium px-[18px] py-[22px] rounded-lg"
                style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
              >
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
              </div>
            ))}
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
                    src={
                      profileMap[getEmployeeKey(employee)] || profileImages[0]
                    }
                    alt="profile"
                    onClick={() => handleOpenRiderAddress(employee)}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer"
                  />

                  <div className="flex flex-col" onClick={() => handleOpenRiderAddress(employee)}>
                    <div className="text-sm hover:text-blue-600 cursor-pointer">{employee?.fullName}</div>
                    <a
                      href={`mailto:${employee?.email}`}
                      className="flex items-center gap-1 mt-1 text-sm text-black hover:underline"
                    >
                      {/* Email Icon */}
                      <FaEnvelope className="text-black text-[12px]" />
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
                <div className="text-[0.8rem] mt-2">
                  {formatCurrency(employee.paymentRate, employee.currency)}
                </div>
                <div className="text-[0.8rem] mt-2">
                  {employee?.paymentFrequency}
                </div>

                <div className="flex flex-col">
                  {employee?.githubAccount && (
                    <a
                    href={employee.githubAccount}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 underline text-[0.8rem] mt-2"
                  >
                    {/* Github Icon */}
                    <FaGithub className="text-black text-[13px]" />
                    Github 
                  </a>
                  )}
                  {employee?.portfolio && (
                    <a
                      href={employee.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 underline text-[0.8rem] mt-2"
                    >
                      {/* Website Icon */}
                    <FaGlobe className="text-black text-[13px]" />
                      Portfolio 
                    </a>
                  )}
                  <button
                   type="button"
                   onClick={()=> handleOpenSocialProfiles(employee)}
                   className="flex items-center gap-1 text-blue-600 underline text-left text-[0.8rem] mt-2"
                   >
                    {/* User Icon */}
                    <FaUser className="text-black text-[13px]" />
                    Social Profiles 
                  </button>

                  {employee?.phoneNumber && (

                    <button
                        type="button"
                        onClick={() => handleOpenPhoneModal(employee)}
                        className="flex items-center gap-1 text-blue-600 underline text-left text-[0.8rem] mt-2"
                    >
                       <span className="flex items-center justify-center mt-1 w-4 h-4 bg-blue-800 rounded-full flex-shrink-0">
                         <FaPhoneAlt className="text-white text-[8px] " />
                        </span>

                        {/* {employee.phoneNumber} */}
                        Phone Number

                    </button>

                    )}
                </div>

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
          {/* EMPTY STATE (MOBILE) */}
          {showEmptyState && <EmptyTeamsState />}
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
                            src={
                              profileMap[getEmployeeKey(employee)] ||
                              profileImages[0]
                            }
                            alt="profile"
                            onClick={() => handleOpenRiderAddress(employee)}
                            className="w-9 h-9 rounded-full object-cover cursor-pointer"
                          />
                        </div>
                        <div 
                        onClick={() => handleOpenRiderAddress(employee)} 
                        className="text-[12px] cursor-pointer">
                          {employee?.fullName}
                        </div>
                      </div>

                      <a
                        href={`mailto:${employee?.email}`}
                        className="flex items-start gap-1 text-black hover:underline mt-1 min-w-0"
                      >
                        {/* Prevent icon from shrinking */}
                        <FaEnvelope className="text-black text-[12px] flex-shrink-0 mt-[4px]" />

                        {/* Allow email text to shrink and wrap */}
                        <span className="min-w-0 break-all text-[12px]">
                          {employee?.email}
                        </span>
                      </a>

                      <div className="text-[12px]">{employee?.roleTitle}</div>
                      <div className="text-[12px]">{employee?.country}</div>
                      <div className="text-[12px]">{formatCurrency(employee.paymentRate, employee.currency)}</div>
                      <div className="text-[12px]">{employee?.seniorityLevel}</div>
                      <div className="text-[12px]">{employee?.paymentFrequency}</div>

                      <div className="flex flex-col text-blue-600 underline">
                        {employee?.githubAccount &&  (
                            <a
                              href={employee?.githubAccount}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[12px]"
                            >
                              <FaGithub className="text-black text-[14px]" />
                              Github
                            </a>
                          )}
                          {employee?.portfolio && (
                            <a
                              href={employee.portfolio}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[12px]"
                            >
                              <FaGlobe className="text-black text-[14px]" />
                              Portfolio
                            </a>
                          )}
                          {/*New button for social modal display*/}
                          <button
                            type="button"
                            onClick={() => handleOpenSocialProfiles(employee)}
                            className="flex items-start gap-1 text-left underline mt-1 text-[12px]"
                              >
                            <FaUser className="text-black text-[14px] mt-[4px]" />
                            Social Profiles
                        </button>

                        {employee?.phoneNumber && (

                          <button
                              type="button"
                              onClick={() => handleOpenPhoneModal(employee)}
                              className="flex items-start gap-1 text-left underline mt-1 text-[12px]"
                          >

                              <span className="flex items-center justify-center mt-1 w-4 h-4 bg-blue-800 rounded-full flex-shrink-0">
                              <FaPhoneAlt className="text-white text-[8px] " />
                              </span>

                              Phone Number

                          </button>

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
        {/* EMPTY STATE (DESKTOP) */}
        {showEmptyState && <EmptyTeamsState />}
        </div>
      </div>
      {/* MODAL */}
      <PerformanceReviewModal
        isOpen={showModal}
        loading={terminating}
        resetKey={modalResetKey} // ADDED
        onClose={() => {
          setModalResetKey((prev) => prev + 1); // ADDED
          setShowModal(false);
        }}
        onConfirm={confirmTermination}
      />

      <SocialProfileModal
        isOpen={showSocialModal}
        employee={selectedSocialEmployee}
        onClose={() => {
          setShowSocialModal(false);
          setSelectedSocialEmployee(null);
        }}
      />
      {/* ----------------------------------------------------
          PHONE CONTACT MODAL
      ----------------------------------------------------- */}

      <PhoneContactModal
          isOpen={showPhoneModal}
          employee={selectedPhoneEmployee}
          onClose={() => {
              setShowPhoneModal(false);
              setSelectedPhoneEmployee(null);
          }}
      />
    </section>
  );
};

export default TeamsTable;
