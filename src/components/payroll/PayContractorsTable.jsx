import {useState, useEffect, useMemo} from "react";
import {getProfileImagesMapping, getEmployeeKey, profileImages} from "../../utility/profileImages";
import authFetch, {getUserBalance, payoutFunds, initializePaymentAccount} from "../../api";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";



// import { Link } from "react-router-dom";
import PrimaryBtn from "../PrimaryBtn";
import DepositModal from "../DepositModal";
import SearchingDoc from "../SearchingDoc";
import { NavLink } from "react-router-dom";
import { formatCurrency } from "../../utility/helper";

const PayContractorsTable = () => {
  const {userId} = useUser();

  /* ================= STATE ================= */
  const [employees, setEmployees] = useState([]); // holds fetched employees
  const [loading, setLoading] = useState(true);
  const [profileMap, setProfileMap] = useState({});

  
  /* ================= BALANCE STATE ================= */
  const [balance, setBalance] = useState(0); // real backend balance

 
  /*  CHECKBOX STATES */
  const [allChecked, setAllChecked] = useState(false);
  const [employeeChecks, setEmployeeChecks] = useState({});

  /* MODAL STATE */
  const [showDepositModal, setShowDepositModal] = useState(false);


  /*Loader state*/
  const [showLoader, setShowLoader] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  /*Make Payment State*/
  const [paying, setPaying] = useState(false);


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

                    //Default Status
                    status: "Payment Due"
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

           /* ================= SET STATE ================= */
           setEmployees(sorted);
           setProfileMap(getProfileImagesMapping(sorted));

           /*INIT CHECKBOX STATE*/
           
          const savedChecks =
          JSON.parse(localStorage.getItem("selectedEmployees")) || {};

          const validChecks = {};

          sorted.forEach((emp) => {

            const key = `${emp.contractId}_${emp.talentAssignedId}`;

            if (savedChecks[key]) {
              validChecks[key] = savedChecks[key];
            }

          });

         console.log("Restored Checkbox State:", validChecks);

         setEmployeeChecks(validChecks);           
      } catch (error) {
        console.error("Fetch expense error", error)
      } finally {
        setLoading(false);
      }
  };

  /* ================= FETCH BALANCE ================= */
const fetchBalance = async () => {
  try {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser?.email) {
      console.warn("No user email found");
      return;
    }

    /* GET ACCOUNT USING EMAIL */

    const accountNumber = await initializePaymentAccount(storedUser);

    console.log("Using Account Number:", accountNumber);

    if (!accountNumber) {
      console.warn("Account number not found");
      return;
    }

    const res = await getUserBalance(accountNumber);

    console.log("Balance API Response:", res);

    const actualBalance =
      res?.balance ||
      res?.data?.balance ||
      0;

    console.log("Extracted Balance:", actualBalance);

    setBalance(Number(actualBalance));

    
  } catch (err) {

    console.error("Balance fetch failed:", err);

  }
};

// ================= GENERATE UNIQUE PAYMENT REFERENCE =================
const generateReference = () => {
  return "REF-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
};


/* ================= AUTOMATIC DEDUCTION ================= */
const handleAutoPayments = async () => {
  try {
    if (!employees.length) return;

    const accountNumber = localStorage.getItem("accountNumber");
    if (!accountNumber) return;

    const lastPayments =
      JSON.parse(localStorage.getItem("lastPayments")) || {};

    const now = new Date();
    let paymentMade = false;

    for (const emp of employees) {
      const key = `${emp.contractId}_${emp.talentAssignedId}`;
      if (!emp.paymentRate) continue;

      const lastPaid = lastPayments[key]
        ? new Date(lastPayments[key])
        : null;

      let due = false;
      const frequency = (emp.paymentFrequency || "").toLowerCase();

      if (!lastPaid) {
        due = true;
      } else {
        const diffDays =
          (now - lastPaid) / (1000 * 60 * 60 * 24);

        if (frequency.includes("weekly") && diffDays >= 7) due = true;
        if (frequency.includes("bi") && diffDays >= 14) due = true;
        if (frequency.includes("month") && diffDays >= 30) due = true;
      }

      if (due) {
        await payoutFunds({
          account_number: accountNumber,
          amount: Number(emp.paymentRate),
          narration: `Auto payment for ${emp.fullName}`,
          type: "debit",
          ini_reference: generateReference(),
        });

        // await authFetch.put("/hire/update-status", {
        //   contractId: emp.contractId,
        //   talentAssignedId: emp.talentAssignedId,
        //   status: "Paid",
        // });

        lastPayments[key] = now.toISOString();
        paymentMade = true;
      }
    }

    localStorage.setItem("lastPayments", JSON.stringify(lastPayments));

    if (paymentMade) {
      await fetchBalance(); // <-- Refresh balance after auto payments
    }

  } catch (err) {
    console.error("Auto payment failed:", err);
  }
};


useEffect(() => {
  if (!userId) return;

  const init = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return;

    try {
      await initializePaymentAccount(storedUser);
      await fetchEmployees();
      await fetchBalance();
    } catch (e) {
      console.error("Init payment failed", e);
    }
  };

  init();
}, [userId]);

/* RUN AUTO PAYMENT ONLY AFTER EMPLOYEES LOAD */
useEffect(() => {
  if (!employees.length) return;

  const alreadyRan = sessionStorage.getItem("auto_payment_ran");

  if (alreadyRan) return;

  handleAutoPayments();

  sessionStorage.setItem("auto_payment_ran", "true");

}, [employees]);

  
  /* ================= CHECKBOX LOGIC ================= */
  /*SELECT ALL*/
  
const handleAllCheckboxChange = () => {
  const newCheckedStatus = !allChecked;

  const updated = {};

  employees.forEach((emp) => {
    // const key = emp.talentAssignedId;
    const key = `${emp.contractId}_${emp.talentAssignedId}`;

    updated[key] = {
      checked: newCheckedStatus,
      amount: emp.paymentRate,
      name: emp.fullName,
    };
  });

  setAllChecked(newCheckedStatus);
  setEmployeeChecks(updated);
};

  

/* SELECT SINGLE */
const handleEmployeeCheckboxChange = (index) => {
  const emp = employees[index];
  const key = `${emp.contractId}_${emp.talentAssignedId}`;

  setEmployeeChecks((prev) => {
    const updated = { ...prev };

    if (updated[key]?.checked) {
      // UNCHECK → REMOVE completely
      delete updated[key];
    } else {
      // CHECK → ADD
      updated[key] = {
        checked: true,
        amount: emp.paymentRate,
        name: emp.fullName,
      };
    }

    return updated;
  });
};

 useEffect(() => {
  if (!employees.length) return;

  const allSelected = employees.every((emp) => {
    const key = `${emp.contractId}_${emp.talentAssignedId}`;
    return employeeChecks[key]?.checked;
  });

  setAllChecked(allSelected);
}, [employeeChecks, employees]);

 
  /* ================= TOTAL CALCULATION ================= */
  const totalAmount = useMemo(() => {
    return employees.reduce((sum, emp) => {
    const key = `${emp.contractId}_${emp.talentAssignedId}`;
      if(employeeChecks[key]?.checked) {
        return sum + Number(emp.paymentRate || 0)
      }
      return sum;
    }, 0);
  }, [employees, employeeChecks]);


  /* UI ADJUSTED BALANCE (REAL-TIME DEDUCTION) */
  const adjustedBalance = useMemo(() => {
    return balance - totalAmount;
  }, [balance, totalAmount]);


/* ================= TOTAL PAYMENT DUE SELECTED ================= */
useEffect(() => {
  if (!Object.keys(employeeChecks).length) return;

  // Save selected employees
  localStorage.setItem(
    "selectedEmployees",
    JSON.stringify(employeeChecks)
  );

  // Save total amount
  const total = Object.values(employeeChecks)
    .filter((item) => item?.checked)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  localStorage.setItem("selectedTotalAmount", total);

  console.log("Saved selections + total:", total);

}, [employeeChecks]);


/* ================= HANDLE MAKE PAYMENT ================= */
const handleMakePayment = async () => {
  console.log(" Make Payment clicked");

  if (paying) return;

  try {
    const savedSelections =
      JSON.parse(localStorage.getItem("selectedEmployees")) || {};

    const selected = Object.entries(savedSelections);

    if (!selected.length) {
      toast.error("No employee selected");
      return;
    }

    let accountNumber = localStorage.getItem("accountNumber");

    if (!accountNumber) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      accountNumber = await initializePaymentAccount(storedUser);
    }

    if (!accountNumber) {
      toast.error("Payment account not ready");
      return;
    }

    setPaying(true);
    toast.loading("Processing payment...", { id: "pay" });

    for (const [key, value] of selected) {
      const [contractId, talentAssignedId] = key.split("_");

      console.log("Paying:", {
        contractId,
        talentAssignedId,
        amount: value.amount,
      });

      await payoutFunds({
        account_number: accountNumber,
        amount: Number(value.amount),
        narration: `Payment for ${value.name}`,
        type: "debit",
        ini_reference: generateReference(),
      });

      console.log("Payment success for:", value.name);
    }

    /* CLEAR STORAGE AFTER SUCCESS */
    localStorage.removeItem("selectedEmployees");
    localStorage.removeItem("selectedTotalAmount");

    setEmployeeChecks({});
    setAllChecked(false);

    await fetchEmployees();
    await fetchBalance();

    toast.success("Payment successful", { id: "pay" });

  } catch (err) {
    console.error("Payment Error:", err?.response?.data || err.message);
    toast.error("Payment failed");
  } finally {
    setPaying(false);
  }
};


/*----------Loader effect------------*/
useEffect(() => {
  setHasMounted(true);

  const shown = sessionStorage.getItem("table_loader");

  if (shown) {
    setShowLoader(false);
    return;
  }

  const timer = setTimeout(() => {
    setShowLoader(false);
    sessionStorage.setItem("table_loader", "true");
  }, 5000);

  return () => clearTimeout(timer);
}, []);


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

  const shouldShowLoader = !hasMounted || showLoader || loading;

  const showEmptyState = !loading && employees.length === 0;
  const showTable = !loading && employees.length > 0;

 /* ================= UI RENDERING ================= */
  
  return (
    <section>
    
      {/* ================= HEADER ================= */}
      {/* ADDED: inline loader (header stays visible) */}
        {shouldShowLoader && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-[12px] text-gray-600">Loading page...</p>
          </div>
        )}
      {showTable && (
      <div className="flex justify-between items-center px-6 mt-6">
        <div className="text-lg font-semibold">
          Available Balance: {formatCurrency(adjustedBalance)}
        </div>

        <button
          onClick={() => {setShowDepositModal(true)
            console.log("Deposit clicked!")
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Deposit
        </button>
        </div>
        )}

      {/* ================= TABLE ================= */}
      <div className="xl:mt-[46px] flex flex-col max-h-[1024px]">
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
          {/*SELECT ALL*/}
          {showTable && (
          <div
            className="flex justify-between items-center px-[13px] py-[11px] rounded-lg user-bg-clr xl:px-10 xl:py-5"
            style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
          >
            <div className="text-[0.625rem] font-semibold xl:text-xl">
              Select to pay all at once
            </div>

            <input
              type="checkbox"
              name=""
              id=""
              className="xl:w-6 xl:h-6"
              checked={allChecked}
              onChange={handleAllCheckboxChange}
            />
          </div>
          )}
          {/*SKELETON LOADER*/}
          {loading && Array.from({length: 3}).map((_, index) => (
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
          {/* ================= EMPLOYEE LIST (MOBILE VIEW) ================= */}
          {/*DATA*/}
          {showTable &&
           employees.map((employee, index) => {
             const key = `${employee.contractId}_${employee.talentAssignedId}`;
            return (
            <div
              key={index}
              className="flex justify-between font-medium px-[18px] py-[22px] rounded-lg xl:flex-row xl:items-center xl:px-10  xl:py-[20px] "
              style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
            >
              <div className="xl:flex xl:items-center">
                <div className="flex gap-[10px] xl:items-center">
                  <img src={
                    profileMap[getEmployeeKey(employee)] ||
                    profileImages[0]
                  } alt="profile photo" 
                  className="w-10 h-10 rounded-full object-cover"/>
                  <div className="xl:flex">
                    {/*Name*/}
                    <div className="text-sm xl:text-sm">{employee.fullName}</div>
                    <div className="text-[0.75rem] xl:text-sm xl:ml-[110px]">
                      {employee.country}
                    </div>
                  </div>
                </div>
                  {/*ROLE*/}
                <div className="text-[0.75rem] xl:text-sm mt-[13px] xl:mt-0">
                  {employee.roleTitle}
                </div>
              </div>
              <div
                className="px-[10px] py-[3px] rounded-[4px] text-[0.5rem]  max-h-max xl:hidden"
                style={{ backgroundColor: "rgba(255, 0, 0, 0.20)" }}
              >
                {employee.status}
              </div>
                  {/*PAY*/}
              <div className="text-sm flex flex-col justify-between">
                {formatCurrency(employee.paymentRate, employee.currency)}

                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="w-4 h-4 ml-auto xl:hidden"
                  checked={!!employeeChecks[key]?.checked}
                  onChange={() => handleEmployeeCheckboxChange(index)}
                />
              </div>
            </div>
            );
          })}
          {/* EMPTY STATE (MOBILE) */}
          {showEmptyState && <EmptyTeamsState />}
        </div>

        <div className="mt-[21px] hidden xl:w-full lg:block ">
          {/* EMPTY STATE (DESKTOP) */}
          {showTable && (
          <>
          {/*TABLE HEADER SHOWS ONLY DATA EXIST*/}
          <div
            className="grid grid-cols-6 gap-5 font-medium mb-[15px] px-10 "
            style={{ color: "rgba(0, 0, 0, 0.60)" }}
          >
            <div>Name</div>
            <div>Country</div>
            <div>Position</div>
            <div>Monthly Pay</div>
            <div>Status</div>
          </div>
          <div>
            {/* ================= EMPLOYEE LIST (DESKTOP VIEW) ================= */}
            {employees.map((employee, index) => {
              const key = `${employee.contractId}_${employee.talentAssignedId}`;
              return (
              <div key={index} className="flex flex-col gap-[10px]">
                <div
                  className="grid grid-cols-6 items-center gap-5 px-10 py-5 rounded-lg text-sm font-medium"
                  style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="flex items-center gap-[10px]">
                    <div
                      className="w-9 h-9 rounded-full"
                      // style={{ backgroundColor: "#D9D9D9" }}
                    >
                      <img src={
                        profileMap[getEmployeeKey(employee)] ||
                        profileImages[0] }
                        alt="profile photo" 
                        className="w-10 h-10 rounded-full object-cover"/>
                    </div>
                    <div>{employee.fullName}</div>
                  </div>
                  <div>{employee.country}</div>
                  <div> {employee.roleTitle}</div>
                  <div>{formatCurrency(employee.paymentRate, employee.currency)}</div>
                  <div style={{ color: "#F00" }}>{employee.status}</div>

                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="w-6 h-6 ml-auto "
                    checked={!!employeeChecks[key]?.checked}
                    onChange={() => handleEmployeeCheckboxChange(index)}
                  />
                </div>
              </div>
              );
            })}
           </div>
          </>
          )}
          {/* EMPTY STATE (DESKTOP) */}
          {showEmptyState && <EmptyTeamsState />}
        </div>
      </div>

      <div className="mb-[22px] md:mb-[34px] absolute bottom-0 left-0 mx-5 md:left-[228px] right-0 xl:ml-[85px]  xl:mr-[65px] md:bottom-[600px]">
        <div
          className="hidden mt-[10px] rounded-lg user-bg-clr lg:flex lg:justify-between lg:items-center lg:px-10 lg:py-5"
          style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          <div className="xl:text-xl font-semibold ">
            Select to pay all at once
          </div>
          <div>
            <input
              type="checkbox"
              name=""
              id=""
              className="w-6 h-6"
              checked={allChecked}
              onChange={handleAllCheckboxChange}
            />
          </div>
        </div>
        {/* ================= FLOATING PAYMENT BAR ================= */}


        {/* ===== MOBILE VIEW (FIXED, FULL WIDTH, TRANSPARENT) ===== */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white flex items-center justify-between lg:hidden z-50 bg-transparent">
          
          <div className="text-sm font-semibold">
            Total: {formatCurrency(totalAmount)}
          </div>

          <PrimaryBtn
            text={paying ? "Processing..." : "Make Payment"}
            onClick={() => {
              console.log("Button clicked (UI layer)");
              handleMakePayment();
            }}
            disabled={totalAmount === 0 || paying}
          />
        </div>


        {/* ===== DESKTOP VIEW (FLOATING, SMALL, DOES NOT BLOCK) ===== */}
        <div className="hidden lg:flex fixed bottom-4 left-[260px] right-[100px] z-50 pointer-events-none">
          
          <div className="w-full max-w-[900px] mx-auto flex justify-end pr-6 pointer-events-auto">
            
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm">
              
              <div className="text-sm font-medium">
                Total: {formatCurrency(totalAmount)}
              </div>

              <PrimaryBtn
                text={paying ? "Processing..." : "Make Payment"}
                onClick={() => {
                  console.log("Button clicked (UI layer)");
                  handleMakePayment();
                }}
                disabled={totalAmount === 0 || paying}
              />
            </div>

          </div>
        </div>
      </div>
      {/* ================= MODAL ================= */}
      <DepositModal
      isOpen={showDepositModal}
      onClose={() => setShowDepositModal(false)}
     />
    </section>
  );
};
export default PayContractorsTable;
