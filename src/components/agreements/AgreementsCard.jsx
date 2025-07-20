import { Link } from "react-router-dom";
import rightarrow from "../../assets/svg/rightarrow.svg";

const AgreementsCard = ({ card }) => {
  return (
    <div
      className="flex flex-col items-center rounded-lg  py-[30px]"
      style={{ border: "0.5px solid rgba(0, 0, 0, 0.20)" }}
    >
      {/* <div className="w-[60px] h-[60px] bg-gray-500 rounded-full mb-[18px]">
            user profile picture comes here
          </div> */}
      <img
        src={card.avatar}
        alt="profile photo"
        className="mb-[18px] w-[60px] h-[60px]"
      />
      <div className="font-medium text-center lg:text-[1.4rem]">
        {card.name}
      </div>
      <Link to={`/dashboard/agreements/${card.id}`} className="flex gap-[6px]">
        <span className="font-medium text-[0.625rem] pr-text-clr md:text-[0.75rem] lg:text-base">
          {card.link}
        </span>
        <img src={rightarrow} alt="" className="w-[6px]" />
      </Link>
    </div>
  );
};
export default AgreementsCard;
