import {useState, useEffect} from "react";
import {getProfileImagesMapping, getEmployeeKey, profileImages} from "../../utility/profileImages";
import authFetch from "../../api";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import SearchingDoc from "../SearchingDoc";


const PaidTable = () => {
  const {userId} = useUser();

  const [employees, setEmployees] = useState([]); // holds fetched employees
  const [loading, setLoading] = useState(true);
  const [profileMap, setProfileMap] = useState({});

  
  /* ================= FETCH DATA ================= */
  const fetchEmployees = async() => {
      setLoading(true);


      try {
        /* ================= FETCH CONTRACTS ================= */
        const response = await authFetch.get(
          "/contracts/get-user-contracts",
          {params: {userId}}
        );

        console.log("Contracts fetched:", response.data);

        const rawContracts  = Array.isArray(response?.data?.data.contracts)
          ? response.data.data.contracts : []

           console.log("Total Contracts created:", rawContracts.length); 
        
          /* ================= NORMALIZE CONTRACTS ================= */
          const normalizedContracts = rawContracts
            .map((c) => ({
              contractId: c._id || c.contractId || null,

              //Remove duplicate + invalid values
              talentAssignedIds: Array.isArray(c.talentAssignedId)
                ? [...new Set(c.talentAssignedId)].filter(
                  (id) => typeof id === "string" && id.trim() !== ""
                ) : [],
            }))
            .filter((c) => c.contractId);

            if(!normalizedContracts.length) {
              setEmployees([]);
              return;
            }
             console.log("normalized Contract fetched:", normalizedContracts);

          /* ================= FETCH ASSIGNED TALENTS ================= */
          const assigned = [];

          for (const contract of normalizedContracts) {
            try {
              const res = await authFetch.get(
                "/hire/assigned-by-contract",
                {params: {contractId: contract.contractId}}
              );
              const assignData = res?.data;

              if(Array.isArray(assignData?.data)) {
                const ids = contract.talentAssignedIds;

                assignData.data.forEach((emp, index) => {
                  assigned.push({
                    ...emp,
                    //attched contract info
                    contractId: contract.contractId,

                    //match correct assigned ID
                    talentAssignedId: ids[index] || null,
                    status: "Paid"
                  })
                })

              }
            } catch (error) {
              console.error("Error fetching assigned talent", error)
            }
          }

           /* ================= SORT FETCH ASSIGNED TALENTS ================= */
           const sorted = assigned.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
           );

           console.log("Fetch Assigned Sorted", sorted);

           /* ================= FILTER PAID ================= */
            const lastPayments =
              JSON.parse(localStorage.getItem("lastPayments")) || {};

            const paidEmployees = sorted.filter((emp) => {

            const key = `${emp.contractId}_${emp.talentAssignedId}`;

            if (!lastPayments[key]) return false;

            const lastPaid = new Date(lastPayments[key]);
            const now = new Date();

            const diffDays =
              (now - lastPaid) / (1000 * 60 * 60 * 24);

            const freq = emp.paymentFrequency?.toLowerCase();

            if (freq.includes("weekly")) return diffDays < 7;
            if (freq.includes("bi")) return diffDays < 14;
            if (freq.includes("month")) return diffDays < 30;

            return false;

            });


           /* ================= SET STATE ================= */
           setEmployees(paidEmployees);
           setProfileMap(getProfileImagesMapping(paidEmployees));


      } catch (error) {
        console.error("Fetch expense error", error)
      } finally {
        setLoading(false);
      }
  };
  useEffect(() => {
    if(!userId) return;
    fetchEmployees();
  }, [userId]);

/* ---------------- EMPTY STATE COMPONENT ---------------- */
const EmptyPaidState = () => (
  <SearchingDoc
    noticeText="Completed payments will appear here."
    searchingdocTitle="No Payments Yet"
    searchingdocText="Once a developer is paid, their record will appear here."
    onBoarding={[
      {
        id: "1",
        title: "Fund your wallet",
        desp: "Deposit money into your wallet.",
      },
      {
        id: "2",
        title: "Pay a developer",
        desp: "Payments will appear in this tab.",
      },
    ]}
  />
);

const showEmptyState = !loading && employees.length === 0;

 /* ================= UI RENDERING ================= */
  
  return (
    <section>
      <div className="xl:mt-[46px] flex flex-col">
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="font-medium px-[18px] py-[22px] rounded-lg xl:flex-row xl:items-center xl:px-10  xl:py-[20px] "
              style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
            >
              <div className="flex justify-between">
                <div className="flex gap-[10px] xl:items-center">
                  <img src={
                    profileMap[getEmployeeKey(employee)] || profileImages[0]
                    } alt="profile photo" 
                    className="w-9 h-9 rounded-full object-cover"/>
                  <div className="xl:flex">
                    <div className="text-sm xl:text-sm">{employee.fullName}</div>
                    <div className="text-[0.75rem] xl:text-sm xl:ml-[110px]">
                      {employee.country}
                    </div>
                  </div>
                </div>
                <div
                  className="px-[10px] py-[3px] rounded-[4px] text-[0.5rem]  max-h-max xl:hidden"
                  style={{ backgroundColor: " rgba(0, 128, 0, 0.20)" }}
                >
                  {employee.status}
                </div>
                <div className="text-sm flex flex-col justify-between">
                  ₦{employee.paymentRate}
                </div>
              </div>

              <div className="flex items-center justify-between mt-[13px] xl:mt-0">
                <div className="text-[0.75rem] xl:text-sm ">
                  {employee.roleTitle}
                </div>
                <div className="py-[7px] px-[9px] font-semibold text-[0.625rem] text-center pr-bg-clr text-white rounded-lg max-w-max ">
                  <Link
                  // to="/dashboard/add-developer"
                  >
                    Receipt
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {/* EMPTY STATE (MOBILE) */}
          {showEmptyState && <EmptyPaidState />}
        </div>

        <div className="mt-[21px] hidden xl:w-full lg:block ">
          <div
            className="grid grid-cols-6 gap-5 font-medium mb-[15px] px-10 "
            style={{ color: "rgba(0, 0, 0, 0.60)" }}
          >
            <div>Name</div>
            <div>Country</div>
            <div>Position</div>
            <div>Monthly Pay</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          <div>
            {employees.map((employee, index) => (
              <div key={index} className="flex flex-col gap-[10px]">
                <div
                  className="grid grid-cols-6 items-center gap-5 px-10 py-5 rounded-lg text-sm font-medium"
                  style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="flex items-center gap-[10px]">
                    <div
                      className="w-9 h-9 rounded-full"
                      //   style={{ backgroundColor: "#D9D9D9" }}
                    >
                      <img src={
                        profileMap[getEmployeeKey(employee)] || profileImages[0]
                        } alt="profile photo" 
                        className="w-9 h-9 rounded-full object-cover"/>
                    </div>
                    <div>{employee.fullName}</div>
                  </div>
                  <div>{employee.country}</div>
                  <div> {employee.roleTitle}</div>
                  <div>₦{employee.paymentRate}</div>
                  <div style={{ color: "#008000" }}>{employee.status}</div>
                  <div className="py-[1em] px-[2em]  font-semibold text-[0.625rem] text-center pr-bg-clr text-white rounded-lg max-w-max xl:text-[0.75rem] xl:p-[9px]">
                    <Link
                    // to="/dashboard/add-developer"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              </div>
            ))}
           {/* EMPTY STATE (DESKTOP) */}
           {showEmptyState && <EmptyPaidState />}
          </div>
        </div>
      </div>
    </section>
  );
};
export default PaidTable;
