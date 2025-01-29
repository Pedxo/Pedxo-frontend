import { RiMenu2Fill } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { useNavBar } from "../context/SideBarContext";
import SideBar from "./SideBar";
import MobileSidebar from "../ui/MobileSidebar";

function AppLayout() {
  const { navOpen, setNavOpen } = useNavBar();


  return (
    <div className="font-poppins relative w-full  flex ">
      <span className="absolute lg:hidden z-30  p-2 left-4 top-16">
        <RiMenu2Fill onClick={() => setNavOpen(true)} size={24} />
      </span>
      <SideBar />
      {navOpen && <MobileSidebar />}
      <div className=" lg:ml-[15em] mt-0 px-5 lg:px-10  h-full w-full relative">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
