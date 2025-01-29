import { Option, Select } from "@material-tailwind/react";

function CustomSelect({ label, required, name, options }) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center text-sm font-semibold gap-1"
        htmlFor={name}
      >
        {label}

        {required && <span className="text-red-500">*</span>}
      </label>
      <Select>
        {options.map((el, i) => (
          <Option key={i} value={el.value}>
            {el.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default CustomSelect;
