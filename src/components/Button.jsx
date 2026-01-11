import { Link } from "react-router-dom";
import MiniLoader from "../ui/MiniLoader";

function Button({
  type,
  disabled,
  link = false,
  onClick,
  isLoading,
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
    large: "p-4 text-sm min-w-72",
    extraLarge: "text-sm",
    full: "text-sm p-4 w-full",
  };

  const base =
    sizes[size] +
    "  flex items-center disabled:opacity-50  diabled:cursor-not-allowed focus:outline-none  justify-center gap-3 transition-colors ease-in duration-150 shadow-md ";

  const styles = {
    primary:
      "bg-primary text-white hover:bg-primary/80 overview-expense font-semibold",
    secondary:
      "bg-white text-black hover:bg-gray-50 ring-1 ring-secondary overview-expense font-semibold",
    danger:
      "bg-red-500 text-white hover:bg-brandRed/80 overview-expense font-semibold",
    accent:
      "bg-white ring-1 ring-black font-medium hover:bg-gray-50 overview-expense",
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
      {isLoading ? (
        <MiniLoader />
      ) : (
        <>
          {iconLeft && <span>{iconLeft}</span>}
          {children}
          {iconRight && <span>{iconRight}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
