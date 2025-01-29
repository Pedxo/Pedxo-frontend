function TeamsTable({ children }) {
  return (
    <div className="flex ring-1 ring-gray-200 pb-4 rounded-md  p-1 flex-col gap-4">
      <ul className="flex text-sm justify-between font-semibold text-black/60 items-center p-2">
        <li className="w-48 text-center">Name</li>
        <li className="w-48 text-center ">Country</li>
        <li className="w-48 text-center ">Position</li>
        <li className="w-32 text-center ">Monthly Pay</li>
        <li className="w-48 text-center ">Seniority Level</li>
        <li className="w-24 text-center ">Action</li>
      </ul>
      {children}
    </div>
  );
}

export default TeamsTable;
