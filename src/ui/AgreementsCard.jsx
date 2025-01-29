import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

function AgreementsCard({ info }) {
  return (
    <div className="w-44 h-44 flex items-center justify-center flex-col p-2 gap-1 border rounded-md">
      <figure
        className="w-24 bg-white flex-shrink-0 h-24 rounded-full"
        style={{
          backgroundImage: `url(${info.image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></figure>

      <h4>{info.name}</h4>
      <Link
        className="flex items-center gap-2 text-primary text-xs"
        to={`${info.id}`}
      >
        View Contract
        <span>
          <FaChevronRight />
        </span>
      </Link>
    </div>
  );
}

export default AgreementsCard;
