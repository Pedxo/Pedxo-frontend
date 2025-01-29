import { GoDotFill } from "react-icons/go";
import SubHeader from "../ui/SubHeader";
import TeamsTable from "../ui/TeamsTable";
import TeamList from "../ui/TeamList";

const teamList = [
    {
      id: 1,
      name: "Cameron Welling",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=cameron",
      country: "India",
      position: "Frontend Developer",
      pay: 3000,
      level: "Intermediate",
    },
    {
      id: 2,
      name: "Sophia Reynolds",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=sophia",
      country: "United States",
      position: "UI/UX Designer",
      pay: 3500,
      level: "Senior",
    },
    {
      id: 3,
      name: "Liam Johnson",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=liam",
      country: "Canada",
      position: "Backend Developer",
      pay: 4000,
      level: "Senior",
    },
    {
      id: 4,
      name: "Isabella Martinez",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=isabella",
      country: "Spain",
      position: "Project Manager",
      pay: 5000,
      level: "Expert",
    },
    {
      id: 5,
      name: "Noah Patel",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=noah",
      country: "India",
      position: "Full Stack Developer",
      pay: 4200,
      level: "Senior",
    },
    {
      id: 6,
      name: "Emma Wilson",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=emma",
      country: "United Kingdom",
      position: "Quality Assurance Engineer",
      pay: 3200,
      level: "Intermediate",
    },
    {
      id: 7,
      name: "Ethan Chen",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=ethan",
      country: "China",
      position: "DevOps Engineer",
      pay: 4500,
      level: "Senior",
    },
    {
      id: 8,
      name: "Olivia Becker",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=olivia",
      country: "Germany",
      position: "Data Scientist",
      pay: 4800,
      level: "Expert",
    },
    {
      id: 9,
      name: "Mason Lee",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=mason",
      country: "South Korea",
      position: "Cybersecurity Analyst",
      pay: 3800,
      level: "Intermediate",
    },
    {
      id: 10,
      name: "Ava Novak",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=ava",
      country: "Poland",
      position: "Product Manager",
      pay: 5300,
      level: "Expert",
    },
  ];
  

  

function Teams() {
  return (
    <section className="flex py-28 lg:py-20 flex-col gap-8">
      <SubHeader title="Teams" />
  

      <TeamsTable>
        {teamList.map((el) => <TeamList key={el.id} info={el} />)}
      </TeamsTable>
    </section>
  );
}

export default Teams;
