import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import { useNavBar } from "../context/SideBarContext";
import MobileSideBar from "./MobileSidebar";

function AppLayout() {
  // const { navOpen } = useNavBar();

  return (
    <div className="font-poppins relative w-full h-svh flex">
      {/* <span className="absolute md:hidden z-30  p-2 left-4 top-16">
        <RiMenu2Fill onClick={() => setNavOpen(true)} size={24} />
      </span> */}
      <MobileSideBar />
      <Navbar />
      {/* <main className="flex-1 min-h-[844px] 2xl:max-w-[1512px] 2xl:max-h-[1024px]"> */}
      <div className=" md:ml-[13em] mt-20 md:mt-0  w-full relative h-screen">
        <Outlet />
      </div>
    </div>
  );
} 

export default AppLayout;
