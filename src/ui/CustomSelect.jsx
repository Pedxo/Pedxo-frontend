function CustomSelect({
  label,
  placeholder,
  name,
  disabled,
  onBlur,
  onChange,
  value,
  options,
}) {
  return (
    <div className="relative text-sm w-full">
      <label htmlFor={name} className="font-semibold leading-normal">
        {label}
      </label>

      <select
        name={name}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="appearance-none w-full disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-90 cursor-pointer overview-expense-bgs bg-transparent border border-[#00000033] outline-gray-400 rounded-lg p-4"
      >
        <option value="">{placeholder}</option>
        {options.map((el, i) => (
          <option key={i} value={el}>
            {el}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomSelect;
