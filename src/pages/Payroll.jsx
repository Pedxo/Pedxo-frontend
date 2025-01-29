import SubHeader from "../ui/SubHeader";
import { useMemo, useState } from "react";
import PayrollList from "../ui/PayrollList";
import PayRollTable from "../ui/PayRollTable";
import { useSearchParams } from "react-router-dom";
import avatar from "../assets/svg/expenseavatar.svg"


function Payroll() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterFromParams = searchParams.get("filterBy") || "all";
  const [filter, setFilter] = useState(filterFromParams);
  

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "all") {
      searchParams.delete("filterBy");
    } else {
      searchParams.set("filterBy", newFilter.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const payrollList = useMemo(() => {
    return [
      {
        id: 1,
        name: "Mike santos",
        image: avatar,
        country: "United Kingdom",
        position: "Backend Developer",
        pay: 5000,
        status: "paid",
      },
      {
        id: 2,
        name: "June baker",
        image: avatar,
        country: "United States",
        position: "Frontend Developer",
        pay: 5000,
        status: "due",
      },
    ];
  }, []);

  const filteredPayroll = useMemo(() => {
    if (filter === "all") return payrollList;
    return payrollList.filter((el) =>
      filter === "due"
        ? el.status === "due"
        : el.status === filter.toLowerCase()
    );
  }, [payrollList, filter]);

  const filterOptions = ["all", "Paid", "Due"];

  return (
    <section className="flex py-28 lg:py-20 flex-col gap-8">
      <SubHeader title="Payroll" active={false} hasSearch={false} />
      <div className="flex items-center w-fit p-1 bg-brandGrey rounded-md">
        {filterOptions.map((item, i) => (
          <button
            className={`py-2 px-4 text-xs capitalize rounded-md transition-all ease-in duration-150 font-semibold ${
              filter.toLowerCase() === item.toLowerCase()
                ? "bg-primary text-white"
                : "text/black/60"
            }`}
            onClick={() => handleFilterChange(item)}
            key={i}
          >
            {item}
          </button>
        ))}
      </div>
      <PayRollTable>
        {filteredPayroll.map((el) => (
          <PayrollList key={el.id} info={el} />
        ))}
      </PayRollTable>
    </section>
  );
}

export default Payroll;
