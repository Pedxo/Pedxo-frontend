import { NavLink } from "react-router-dom";

function CustomNavLink({ icon: Icon, onClick, children, to }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center text-sm gap-3 transition-colors  duration-200  leading-normal ${isActive ? "text-primary" : "text-black/50"}`      }
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon color={isActive ? "#4195F1" : "#00000060"} />}
          {children}
        </>
      )}
    </NavLink>
  );
}

export default CustomNavLink;
