import searchicon from "../assets/svg/searchicon.svg";

const SearchInput = ({ value, onChange }) => {
  return (
    <div className="relative" style={{ color: "rgba(0, 0, 0, 0.40)" }}>
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-gray-500 text-[0.625rem] py-[10px] px-[13px] border rounded-lg w-[157px] md:w-auto md:text-[0.75rem] xl:py-[9px] xl:px-[20px]"
        style={{ backgroundColor: "#F3F3F3" }}
      />
      <img
        src={searchicon}
        alt="search icon"
        className="absolute top-[30%] right-[13px] xl:right-[16px]"
      />
    </div>
  );
};

export default SearchInput;
