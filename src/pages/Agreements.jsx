import { GoDotFill } from "react-icons/go";
import SubHeader from "../ui/SubHeader";
import AgreementsCard from "../ui/AgreementsCard";
import avatar from "../assets/svg/expenseavatar.svg"

const agreements = [
  {
    id: 1,
    name: "Mike santos",
    image: avatar,
  },
  {
    id: 2,
    name: "Mike santos",
    image: avatar,
  },
  {
    id: 3,
    name: "Mike santos",
    image: avatar,
  },
  {
    id: 4,
    name: "Mike santos",
    image: avatar,
  },
  {
    id: 5,
    name: "Mike santos",
    image: avatar,
  },
];

function Agreements() {
  return (
    <section className="flex py-20 flex-col gap-8">
      <SubHeader title="Agreements" />
    

      <ul className="flex flex-wrap px-4 gap-2">
        {agreements.map((item) => (
          <AgreementsCard info={item} key={item.id} />
        ))}
      </ul>
    </section>
  );
}

export default Agreements;
