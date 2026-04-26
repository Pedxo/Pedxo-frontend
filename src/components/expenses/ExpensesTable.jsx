import expenseavatar from "../../assets/svg/expenseavatar.svg";
import {useState, useEffect} from "react";
import {getProfileImagesMapping, getEmployeeKey, profileImages} from "../../utility/profileImages";
import authFetch from "../../api";
import { useUser } from "../../context/UserContext";
import { formatCurrency } from "../../utility/helper";
import { getUserTransactions } from "../../api";
import { getPaymentStatus } from "../../utility/paymentStatus";


const ExpensesTable = () => {
  const {userId} = useUser();

  /* ================= STATE ================= */
  const [employees, setEmployees] = useState([]); // holds fetched employees
  const [loading, setLoading] = useState(true);
  const [profileMap, setProfileMap] = useState({});

  const [totalSpent, setTotalSpent] = useState(0);
  const [duePayment, setDuePayment] = useState(0);

  //Loader state
  const [showLoader, setShowLoader] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);


 /* ================= FETCH DATA ================= */
  const fetchEmployees = async() => {
      setLoading(true);


      try {
        const accountNumber = localStorage.getItem("accountNumber");
        let transactions = [];

        if(accountNumber) {
          try {
            const trxRes = await getUserTransactions(accountNumber);

            transactions =
              trxRes?.items ||
              trxRes?.data?.items ||
              [];
          } catch (err) {
            console.error("Transaction fetch failed:", err.message);
            transactions = [];
          }
        }

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
      
                  const employee = {
                    ...emp,
                    //attached contract info
                    contractId: contract.contractId,
                    //match correct assigned ID
                    talentAssignedId: ids[index] || null,
                  };
                  //Real Payment Check
                  const key = `${contract.contractId}_${ids[index]}`;

                  const isPaid = transactions.some((trx) =>
                    trx.type === "payout" &&
                    trx.status === "successful" &&
                    trx.ini_reference?.includes(`PAY-${key}`)
                  );
                  employee.status = isPaid ? "Paid" : "Payment Due";
                  assigned.push(employee);
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

      /* ================= FETCH TRANSACTIONS ================= */
      let spent = 0;
      let due = 0;
    

      transactions.forEach((trx) => {
        if (
          trx.type === "payout" &&
          trx.status === "successful"
        ) {
          const amount = Math.abs(Number(trx.amount || 0));
          spent += amount;
        }
      });
      
      console.log("TOTAL SPENT CALCULATED:", spent);
      console.log("TRANSACTION COUNT:", transactions.length);
      console.log("VALID PAYOUTS:",
        transactions.filter(trx => trx.type === "payout")
      );
      
      sorted.forEach((emp) => {
        const status = getPaymentStatus(emp, transactions);

        if (status === "due") {
          due += Number(emp.paymentRate) || 0;
        }
      });

      setTotalSpent(spent);
      setDuePayment(due);

      } catch (error) {
        console.error("Fetch expense error", error)
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
  };
  
  useEffect(() => {
    if(!userId) return;
    fetchEmployees();
    
  }, [userId]);

//Loader effect
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

// const shouldShowLoader = !hasMounted || showLoader || loading;
const shouldShowLoader = loading;

  return (
    
    <div className="xl:flex xl:flex-row-reverse xl:gap-5 xl:mt-[46px]">
      <div
        className="rounded-lg mt-[21px] p-5 font-semibold xl:py-[32px] xl:pl-[31px] xl:pr-[115px]"
        style={{
          backgroundColor: " rgba(0, 185, 203, 0.20)",
          border: "1px solid #00B9CB",
        }}
      >
        <div className="text-base xl:text-xl">Total Spent</div>
        {/*TOTAL SPENT*/}
        <div className="text-[1.875rem] xl:text-[2.5rem]">{formatCurrency(totalSpent)}</div>
        {/*PAYMENT DUE*/}
        <div
          className="text-[0.75rem] font-medium xl:text-base xl:mt-[23px] xl:mb-[7px]"
          style={{ color: "#F00" }}
        >
          Due Payment
        </div>
        <div
          className="text-xl font-semibold text-[1.625rem] "
          style={{ color: "#F00" }}
        >
          {formatCurrency(duePayment)}
        </div>
      </div>
      {shouldShowLoader && (
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <p className="text-[12px] text-gray-600">Loading page...</p>
      </div>
      )}
         {/* ================= MOBILE VIEW ================= */}
      <div className="flex flex-col gap-4 mt-[21px] xl:w-full xl:gap-[10px] lg:hidden">
        {employees.map((employee, index) => (
          <div
            key={index}
            className="flex justify-between gap-[13px] font-medium px-[18px] py-[22px] rounded-lg xl:flex-row xl:py-[20px] xl:pl-[40px] xl:pr-[70px] xl:items-center "
            style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
          >
            <div className="xl:flex xl:items-center ">
              <div className="flex gap-[10px] mb-[13px] xl:mb-0 xl:items-center">
                <img src={
                  profileMap[getEmployeeKey(employee)] || profileImages[0]
                } alt="profile photo" 
                className="w-9 h-9 rounded-full object-cover"/>
                <div className="xl:flex">
                  <div className="text-sm xl:text-sm">{employee.fullName}</div>
                  <div className="text-[0.75rem] xl:text-sm xl:ml-[73px]">
                    {employee.country}
                  </div>
                </div>
              </div>
              <div className="text-[0.75rem] xl:text-sm xl:ml-[124px]">
                {employee.roleTitle}
              </div>
            </div>
            {/*AMOUNT*/}
            <div className="text-sm ">{formatCurrency(employee.paymentRate)}</div>
          </div>
        ))}
      </div>
         {/* ================= DESKTOP VIEW ================= */}
      <div className="mt-[21px] hidden xl:w-full lg:block ">
        <div
          className="grid grid-cols-4 gap-5 font-medium mb-[15px] px-10 "
          style={{ color: "rgba(0, 0, 0, 0.60)" }}
        >
          <div>Name</div>
          <div>Country</div>
          <div>Position</div>
          <div>Amount</div>
        </div>
        <div>
          {employees.map((employee, index) => (
            <div key={index} className="flex flex-col gap-[10px]">
              <div
                className="grid grid-cols-4 items-center gap-5 px-10 py-5 rounded-lg text-sm font-medium"
                style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
              > {/*  NAME  */}
                <div className="flex items-center gap-[10px]">
                  <div
                    className="w-9 h-9 rounded-full"
                    //   style={{ backgroundColor: "#D9D9D9" }}
                  >
                    <img src={
                      profileMap[getEmployeeKey(employee)] || profileImages[0]
                    } alt="profile photo" />
                  </div>
                  <div>{employee.fullName}</div>
                </div>
                <div>{employee.country}</div>
                <div> {employee.roleTitle}</div>
                {/*<div>$5000</div>*/}
                <div>{formatCurrency(employee.paymentRate)}</div>
                <div style={{ color: "#008000" }}>{employee.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ExpensesTable;
