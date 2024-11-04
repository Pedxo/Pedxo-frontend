import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const SideBarMenuItems = ({ icon, title, to }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const navRef = useRef(null);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleClickOutside = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setToggleMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <NavLink
        to={to}
        onClick={handleToggleMenu}
        className={({ isActive }) =>
          `flex items-center gap-3 group transition-colors duration-300 ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 hover:bg-primary/10 hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={icon}
              alt={`${title} icon`}
              className={`w-5 h-5 hover:pr-text-clr navbar-svg-clr hover:stroke-red-500 ${
                isActive ? "filter-primary-color" : "black"
              } transition-all duration-500`}
            />
            <div
              className={`font-semibold leading-normal hover:pr-text-clr ${
                isActive ? "pr-text-clr" : "black"
              } transition-colors duration-500`}
            >
              {title}
            </div>
          </>
        )}
      </NavLink>
    </>
  );
};
export default SideBarMenuItems;

{
  /*
  <SvgSprite />
  <NavLink
        to={to}
        onClick={handleToggleMenu}
        className="flex items-center gap-3 group"
      >
        <svg className="icon w-4 h-4 fill-current group-hover:pr-text-clr transition-colors duration-300">
          <use xlinkHref={`#${iconId}`}></use>
        </svg>
       
        <div className="font-semibold leading-normal group-hover:pr-text-clr transition-colors duration-300">
          {title}
        </div>
      </NavLink> */
}
