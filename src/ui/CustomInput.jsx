import { useState } from "react";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";

function CustomInput({
  label,
  name,
  placeholder,
  type = "text",
  onChange,
  onBlur,
  disabled,
  error = false,
  errorMessage,
  required,
  value,
}) {
  const [showPassword, setShowPassword] = useState(false);
  if (type === "password")
    return (
      <div className="flex flex-col  w-full gap-3">
        <div className="flex items-center justify-between">
          <label htmlFor={name} className=" text-sm font-medium">
            {label}
          </label>
          {error && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
        <div
          className={`flex focus-within:outline-gray-400 items-center border ${
            error ? "border-red-500" : " border-gray-400"
          } p-3 rounded-lg`}
        >
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={onChange}
            required={required}
            className=" w-full text-sm focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="button"
            className="flex-shrink-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoMdEye size={18} /> : <IoIosEyeOff size={18} />}
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label
          className="flex items-center text-sm font-semibold gap-1"
          htmlFor={name}
        >
          {label}

          {required && <span className="text-red-500">*</span>}
        </label>
        {error && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
      <input
        className={`p-3 rounded-md bg-transparent disabled:cursor-not-allowed disabled:border-brandLightGrey focus:outline-none transition-all ease-in duration-200 focus:ring-1 focus:ring-primary text-sm border w-full ${
          error ? "border-red-500" : "border-[#0000004D]"
        }`}
        type={type}
        value={value}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}

export default CustomInput;
