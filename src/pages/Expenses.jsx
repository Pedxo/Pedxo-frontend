import { FiUserPlus } from "react-icons/fi";
import EmptyPage from "../ui/EmptyPage";
import SubHeader from "../ui/SubHeader";

const expenseArray = [];

function Expenses() {
  return (
    <section className="flex py-28 lg:py-20 flex-col gap-8">
      <SubHeader title="Expenses" />
      {expenseArray.length === 0 ? (
        <EmptyPage
          title="No Expenses yet"
          text="They would be generated when you start making payments"
          icon={<FiUserPlus size={18} />}
          btnText="Add Developer"
          to="/add-developer"
        />
      ) : (
        ""
      )}
    </section>
  );
}

export default Expenses;
