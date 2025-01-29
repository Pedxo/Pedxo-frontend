import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParms] = useSearchParams();

  const handleSearch = (e) => {
    e.preventDefault()
    if(!query) return
    const trimmed = query.trim()
    searchParams.set("query", trimmed)
    setSearchParms(searchParams)

  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex ring-1 p-3 w-40 lg:w-60 rounded-md bg-brandLightGrey focus-within:ring-primary text-xs font-medium text-black/60  ring-black/40"
    >
      <input
        className="focus:outline-none w-full bg-transparent border-0 "
        type="search"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <FiSearch className="flex-shrink-0" size={18} />
    </form>
  );
}

export default SearchBox;
