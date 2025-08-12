import { useState } from "react";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";

const FormInput = ({
  htmlFor,
  label,
  type,
  error,
  errorMessage,
  onBlur,
  name,
  id,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  if (type === "password")
    return (
      <div className="flex flex-col  w-full sm:gap-3 gap-2">
        <div className="flex items-center gap-3">
          <label htmlFor={htmlFor} className=" font-medium">
            {label}
          </label>
          {error && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
        <div className="flex focus-within:outline-gray-400 items-center border border-gray-400 sm:py-3 sm:px-4 py-2 px-3 rounded-lg">
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            id={id}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            required={required}
            className=" w-full focus:outline-0 placeholder:capitalize outline-gray-400"
          />
          <button
            type="button"
            className="flex-shrink-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoMdEye size={22} /> : <IoIosEyeOff size={22} />}
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor={htmlFor} className=" font-medium">
          {label}
        </label>
        {error && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        required={required}
        className="border border-gray-400  placeholder:capitalize outline-gray-400 rounded-lg sm:p-3 p-2"
      />
    </div>
  );
};
export default FormInput;
