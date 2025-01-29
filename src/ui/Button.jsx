import { Link } from "react-router-dom";

function Button({
  type,
  disabled,
  link = false,
  onClick,
  iconRight,
  iconLeft,
  linkTo,
  children,
  size = "regular",
  buttonType = "button",
}) {
  const sizes = {
    tiny: "p-2 lg:w-full w-fit  text-xs",
    small: "text-sm p-1",
    regular: "w-40 p-4 text-xs",
    medium: "w-52 p-4 text-xs",
    large: "p-4 text-sm",
    extraLarge: "text-sm",
  };

  const base =
    sizes[size] +
    "  flex items-center disabled:opacity-50  diabled:cursor-not-allowed focus:outline-none  justify-center gap-3 transition-colors ease-in duration-150 shadow-md ";

  const styles = {
    primary: "bg-primary text-white hover:bg-primary/80 rounded-md font-semibold",
    secondary: "bg-white text-black hover:bg-gray-50 ring-1 ring-secondary rounded-md font-semibold",
    danger: "bg-red-500 text-white hover:bg-brandRed/80 rounded-md font-semibold",
    accent: "bg-white ring-1 ring-black font-medium hover:bg-gray-50 rounded-md",
  };

  if (link)
    return (
      <Link to={linkTo} className={base + styles[type]}>
        {iconLeft && <span>{iconLeft}</span>}
        {children}
        {iconRight && <span>{iconRight}</span>}
      </Link>
    );

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={buttonType}
      className={base + styles[type]}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {children}
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
}

export default Button;
