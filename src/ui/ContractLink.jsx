import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ContractLink({ to, title, text, icon: Icon }) {
  return (
    <Link
      to={to}
      className="lg:h-28 h-24 gap-4  lg:gap-6 px-4 lg:px-5 w-full rounded-md bg-brandLightGrey border flex items-center justify-between border-[#0000004D]"
    >
      <span className="w-10 h-10 flex-shrink-0 rounded-full bg-secondary text-white flex items-center justify-center">
        <Icon size={21} />
      </span>
      <div className="w-full flex flex-col gap-1">
        <h1 className="font-semibold text-lg lg:text-xl">{title}</h1>
        <p className="font-medium lg:text-sm text-wrap text-xs text-black/60">{text}</p>
      </div>
      <FaChevronRight className="text-secondary flex-shrink-0" size={30} />
    </Link>
  );
}

export default ContractLink;
