import {useState, useEffect, useMemo} from "react";
import {getProfileImagesMapping, getEmployeeKey, profileImages} from "../../utility/profileImages";
import authFetch, {getUserBalance, payoutFunds, initializePaymentAccount} from "../../api";
import { useUser } from "../../context/UserContext";



// import { Link } from "react-router-dom";
import PrimaryBtn from "../PrimaryBtn";
import DepositModal from "../DepositModal";
import SearchingDoc from "../SearchingDoc";
import { NavLink } from "react-router-dom";

const PayContractorsTable = () => {
  const {userId} = useUser();

  /* ================= STATE ================= */
  const [employees, setEmployees] = useState([]); // holds fetched employees
  const [loading, setLoading] = useState(true);
  const [profileMap, setProfileMap] = useState({});

   /* BALANCE STATE */
  const [balance, setBalance] = useState(0);

 
  /*  CHECKBOX STATES */
  const [allChecked, setAllChecked] = useState(false);
  const [employeeChecks, setEmployeeChecks] = useState({});

  /* MODAL STATE */
  const [showDepositModal, setShowDepositModal] = useState(false);


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



/* ================= AUTOMATIC DEDUCTION ================= */
const handleAutoPayments = async () => {
  const lastPayments =
    JSON.parse(localStorage.getItem("lastPayments")) || {};

  const now = new Date();

  for (const emp of employees) {
    // const key = emp._id || emp.talentAssignedId;
    const key = `${emp.contractId}_${emp.talentAssignedId}`;

    const lastPaid = lastPayments[key]
      ? new Date(lastPayments[key])
      : null;

    let due = false;

    const frequency = emp.paymentFrequency?.toLowerCase();

    if (!lastPaid) {
      due = true;
    } else {
      const diffDays =
        (now - lastPaid) / (1000 * 60 * 60 * 24);

      if (frequency.includes("weekly") && diffDays >= 7) {
        due = true;
      }

      if (frequency.includes("bi") && diffDays >= 14) {
        due = true;
      }

      if (frequency.includes("month") && diffDays >= 30) {
        due = true;
      }
    }

    if (due) {
      try {
        const accountNumber =
          localStorage.getItem("accountNumber");

        await payoutFunds({
          account_number: accountNumber,
          amount: emp.paymentRate,
          narration: `Auto payment for ${emp.fullName}`,
        });

        lastPayments[key] = now.toISOString();

        console.log("Auto paid:", emp.fullName);
      } catch (err) {
        console.error("Auto payment failed:", emp.fullName);
      }
    }
  }

  localStorage.setItem(
    "lastPayments",
    JSON.stringify(lastPayments)
  );
};


  useEffect(() => {
  if (!userId) return;

  const init = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return;

    try {
      await initializePaymentAccount(storedUser);
    } catch (e) {
      console.error("Init payment failed", e);
    }

    await fetchEmployees();
    await fetchBalance();
    await handleAutoPayments();
  };

  init();
}, [userId]);

   
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

  setEmployeeChecks((prev) => ({
    ...prev,
    [key]: {
      checked: !prev[key]?.checked,
      amount: emp.paymentRate,
      name: emp.fullName,
    },
  }));
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


/* ================= TOTAL PAYMENT DUE SELECTED ================= */
useEffect(() => {

  if (!Object.keys(employeeChecks).length) return;

  console.log("Saving checkbox state:", employeeChecks);

  localStorage.setItem(
    "selectedEmployees",
    JSON.stringify(employeeChecks)
  );

  const total = Object.values(employeeChecks)
    .filter((item) => item?.checked)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  localStorage.setItem("selectedTotalAmount", total);

}, [employeeChecks]);


/* ================= DEDUCT BALANCE ================= */
const adjustedBalance = balance - totalAmount;


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

  const showEmptyState = !loading && employees.length === 0;

 /* ================= UI RENDERING ================= */
  
  return (
    <section>
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center px-6 mt-6">
        <div className="text-lg font-semibold">
          Available Balance: ₦{adjustedBalance}
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

        {/* ================= TABLE ================= */}
      <div className="xl:mt-[46px] flex flex-col max-h-[1024px]">
        <div className="flex flex-col gap-4 mt-[21px] xl:flex-col-reverse xl:gap-[10px] xl:w-full lg:hidden">
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

          {/* ================= EMPLOYEE LIST (MOBILE VIEW) ================= */}
          {employees.map((employee, index) => {
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
                ₦{employee.paymentRate}

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
                  <div>₦{employee.paymentRate}</div>
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
            {/* EMPTY STATE (DESKTOP) */}
          {showEmptyState && <EmptyTeamsState />}
          </div>
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

        {/* <div className="flex items-center justify-between gap-6 mt-[19px]">
          <div className="text-sm font-medium mt-[10px] xl:text-[22px]">
            Total Amount: ${totalAmount}
          </div>
          <div>
            <PrimaryBtn text="Make Payment" onClick={handleMakePayment}/>
          </div>
        </div> */}
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
