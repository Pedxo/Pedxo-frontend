// import { nanoid } from "nanoid";
// import SearchingDoc from "../components/SearchingDoc";
import DashboardHeading from "../components/DashboardHeading";
import ExpensesTable from "../components/expenses/ExpensesTable";

const Expenses = () => {
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthYear = `${monthNames[now.getMonth()]}/${now.getFullYear()}`;

  // const onBoarding = [
  //   {
  //     id: nanoid(),
  //     title: "Manage expense requests",
  //     desp: "Any payment history for your team will appear and be stored here for future reference",
  //   },
  //   {
  //     id: nanoid(),
  //     title: "Review expenses requests",
  //     desp: "Review pending and successful expense requests for your team. Ensure all pending requests are addressed and processed immediately",
  //   },
  // ];
  return (
    <section>
      <div className="mt-[62px] mx-5 xl:ml-[86px] xl:mr-[65px]">
        <DashboardHeading heading="Expenses" subHead={currentMonthYear} />
        <div>
          <div>
            <ExpensesTable />
          </div>
          {/* <div>
            <SearchingDoc
              noticeText="Add devs and pay them to see their records here."
              searchingdocTitle="No Payroll Yet"
              searchingdocText="They would be generated when you start
 making payment"
              onBoarding={onBoarding}
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};
export default Expenses;


