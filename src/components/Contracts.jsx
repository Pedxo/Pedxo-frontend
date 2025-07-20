import rightarrowicon from "../assets/svg/rightarrow.svg";
import fulltimeicon from "../assets/svg/fulltime.svg";
import gigbased from "../assets/svg/gigbased.svg";
import { Link } from "react-router-dom";

const Contracts = () => {
  return (
    <section className=" flex items-center justify-center flex-col h-screen">
        <div className="text-center">
          <div className="text-[20px] font-bold xl:text-[31px] xl:mb-6">
            Creating a Contract
          </div>
          <p className="text-sm font-medium xl:text-2xl">
            Choose Contract Type
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-[31px] mx-[21px] xl:mt-10">
          <Link to="/dashboard/full-time-form?contractType=full-time">
            <div className="flex items-center justify-between gap-4 user-bg-clr rounded-lg px-4 py-[19px] xl:px-10 xl:py-9">
              <div className="flex items-center gap-[13px]">
                <img src={fulltimeicon} alt="target icon" />
                <div>
                  <div className="text-sm font-semibold md:text-xl xl:text-2xl">
                    Full-Time
                  </div>
                  <p
                    className="text-[10px] font-normal md:text-[16px] xl:text-xl"
                    style={{ color: "rgba(0, 0, 0, 0.50)" }}
                  >
                    For client that has a fixed rate each payment
                  </p>
                </div>
              </div>
              <img src={rightarrowicon} alt="arrow icon" />
            </div>
          </Link>

          <Link to="/dashboard/gig-based-form?contractType=gig-based">
            <div className="flex items-center justify-between user-bg-clr rounded-lg px-4 py-[19px] xl:px-10 xl:py-9">
              <div className="flex gap-[13px]">
                <img src={gigbased} alt="target icon" />
                <div>
                  <div className="text-sm font-semibold md:text-xl xl:text-2xl">
                    Gig Based
                  </div>
                  <p
                    className="text-[10px] font-normal md:text-[16px]  xl:text-xl"
                    style={{ color: "rgba(0, 0, 0, 0.50)" }}
                  >
                    Suitable for temporal or milestone contracts
                  </p>
                </div>
              </div>
              <img src={rightarrowicon} alt="arrow icon" />
            </div>
          </Link>
        </div>
    </section>
  );
};
export default Contracts;

{
  /* <section>
      <div className=" mt-[190px] absolute w-full max-w-[1155px] xl:ml-[101px] xl:px-[157px]">
        <div className="text-center">
          <div className="text-[20px] font-bold xl:text-[31px] xl:mb-6">
            Creating a Contract
          </div>
          <p className="text-sm font-medium xl:text-2xl">
            Choose Contract Type
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-[31px] mx-[21px] xl:mt-10">
          <NavLink to="/full-time-form">

            <div className="flex items-center justify-between user-bg-clr rounded-lg px-4 py-[19px] xl:px-10 xl:py-9">
              <div className="flex gap-[13px]">
                <img src={fulltimeicon} alt="target icon" />
                <div>
                  <div className="text-sm font-semibold md:text-xl xl:text-2xl">
                    Full-Time
                  </div>
                  <p
                    className="text-[10px] font-normal md:text-[16px] xl:text-xl"
                    style={{ color: "rgba(0, 0, 0, 0.50)" }}
                  >
                    For client that has a fixed rate each payment
                  </p>
                </div>
              </div>
              <img src={rightarrowicon} alt="arrow icon" />
            </div>
          </NavLink>

          <NavLink to="/gig-based-form">
            <div className="flex items-center justify-between user-bg-clr rounded-lg px-4 py-[19px] xl:px-10 xl:py-9">
              <div className="flex gap-[13px]">
                <img src={gigbased} alt="target icon" />
                <div>
                  <div className="text-sm font-semibold md:text-xl xl:text-2xl">
                    Gig Based
                  </div>
                  <p
                    className="text-[10px] font-normal md:text-[16px]  xl:text-xl"
                    style={{ color: "rgba(0, 0, 0, 0.50)" }}
                  >
                    Suitable for temporal or milestone contracts
                  </p>
                </div>
              </div>
              <img src={rightarrowicon} alt="arrow icon" />
            </div>
          </NavLink>
        </div>
      </div>
    </section> */
}
