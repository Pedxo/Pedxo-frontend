import { nanoid } from "nanoid";
// import SearchingDoc from "../components/SearchingDoc";
import AddDeveloperBtn from "../components/AddDeveloperBtn";
import CreateContractBtn from "../components/CreateContractBtn";
import TeamsTable from "../components/teams/TeamsTable";
import Button from "../components/Button";
import { FaUserPlus } from "react-icons/fa";
import CreateContractIcon from "../assets/icons/CreateContractIcon";
import Table from "../components/Table";
const Teams = () => {
  const onBoarding = [
    {
      id: nanoid(),
      title: "Create and send contract",
      desp: "You will create contract by filling information like personal details, role details, compensation and budget",
    },
    {
      id: nanoid(),
      title: "Our Team Review ",
      desp: "Pedxo will review and recommend a good fit according to your requirement via email.",
    },
    {
      id: nanoid(),
      title: "Notification",
      desp: "You will receive a notification, once your developer has signed the contract and will be automatically added to your team",
    },
  ];

  return (
    <section className=" flex flex-col w-full mt-10 p-4 gap-10 ">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-medium lg:text-[30px] lg:font-semibold">
          Teams
        </h1>

        <div className=" hidden lg:flex items-center gap-4">
          <Button
            link
            linkTo={"/dashboard/add-developer"}
            type={"primary"}
            iconLeft={<FaUserPlus size={18} />}
          >
            Add Developer
          </Button>
          <Button
            link
            linkTo={"/dashboard/add-developer"}
            size="large"
            type={"secondary"}
            iconLeft={<CreateContractIcon />}
          >
            Create Contract
          </Button>
        </div>
      </div>

      <div>
        <TeamsTable />
        {/* <Table columns="1.2fr 1fr 1fr 1fr 1fr 0.5fr">
          <Table.Header>
            <div>Name</div>
            <div>Country</div>
            <div>Position</div>
            <div>Pay</div>
            <div>Seniority Level</div>
            <div></div>
          </Table.Header>
        </Table> */}

        {/* <div>
            <SearchingDoc
              noticeText="How onboarding works?"
              searchingdocTitle="Create Contract"
              searchingdocText=" Start creating contract will refer you to your team members. Once
            they are added, you'll see them here"
              onBoarding={onBoarding}
            />
          </div> */}
      </div>
    </section>
  );
};
export default Teams;
