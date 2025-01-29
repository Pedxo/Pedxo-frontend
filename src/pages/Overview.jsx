import { AiOutlineTeam } from "react-icons/ai";
import { FaPaperPlane, FaSackDollar } from "react-icons/fa6";
import Button from "../ui/Button";
import HeadBanner from "../ui/HeadBanner";
import { useUser } from "../context/UserContext";

function Overview() {
  const { username } = useUser();
  return (
    <section className="flex py-28 lg:py-20 bg-white flex-col gap-8">
      <HeadBanner />
      <div className="space-y-2">
        <h1 className="heading-1">Welcome, {username}</h1>
        <p className="paragraph-1">We hope you&apos;re having a good day</p>
      </div>

      <div className="w-full md:rounded-2xl bg-brandGrey/40 flex flex-col p-4 gap-8 md:px-12 py-10">
        <div className="space-y-2 w-full">
          <h2 className="font-bold text-xl text-black/70">Total Expenses</h2>
          <p className="paragraph-1">
            Total amount you&apos;ve spent on your contractors
          </p>
          <div className="w-full bg-white py-4 px-4 h-16 md:h-24 md:px-16 rounded-md flex items-center">
            <h1 className="flex font-bold text-3xl text-black/80 items-center gap-5">
              <FaSackDollar />
              $1000
            </h1>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <h2 className="font-bold text-xl text-black/70">
            Active Contractors
          </h2>
          <p className="paragraph-1">Current contractors on your team</p>
          <div className="w-full bg-white py-4 h-16 px-4 md:h-24  justify-between md:px-16 rounded-md flex items-center">
            <h1 className="flex font-bold text-3xl  text-black/80 items-center gap-1 md:gap-6">
              <AiOutlineTeam className="text-4xl" />7
            </h1>
            <Button link linkTo={"/create-contract"} type="primary">
              Create contract
            </Button>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <h2 className="font-bold text-xl text-black/70">Onboarding</h2>
          <p className="paragraph-1">Pending contracts on their way</p>
          <div className="w-full bg-white justify-between py-4 h-16 md:h-24 p-4 md:px-16 rounded-md flex items-center">
            <h1 className="flex font-bold text-3xl text-black/80 items-center gap-7">
              <FaPaperPlane className="text-primary" />1
            </h1>
            <span className="text-yellow-400">Pending</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
