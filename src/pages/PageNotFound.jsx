import { NavLink } from "react-router-dom";
import NoDataImg from "../assets/png/no_data.png";


function PageNotFound() {
  return (
    <section className="w-full h-screen">
      <div className="flex flex-col items-center justify-center gap-5 h-screen text-center mx-[21px] xl:mx-[123px] xl:text-left">
      <div className="flex items-center justify-center w-full">
          <img src={NoDataImg} 
          alt="Page not found"
          className="
          w-[220px]
          sm:w-[280px]
          md:w-[340px]
          lg:w-[400px]
          xl:w-[460px]
          h-auto
          object-contain
          drop-shadow-lg
          animate-fadeIn
        "
          h-auto/>
        </div>
        <p className="text-2xl text-center xl:text-[40px] font-medium leading-normal max-w-[450px]">
          We can&apos;t find the page you are looking for
        </p>
        <div className="flex justify-center ">
          <NavLink
            to="/"
            className="flex items-center text-white px-3 py-[10px] xl:px-[49px] xl:py-[29px] pr-bg-clr rounded-full font-semibold xl:text-[22px]"
          >
            Go to Homepage
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default PageNotFound;
