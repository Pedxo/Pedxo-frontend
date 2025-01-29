function CustomTable({ children }) {
  return (
    <div className="flex ring-1 ring-gray-200 pb-4 rounded-md  p-1 flex-col gap-4">
      <ul className="flex text-sm justify-between font-semibold text-black/60 items-center p-2">
        <li className="w-48">Name</li>
        <li className="w-48">Country</li>
        <li className="w-48">Position</li>
        <li className="w-32">Monthly Pay</li>
        <li className="w-48">Seniority Level</li>
        <li className="w-24">Action</li>
      </ul>
      {children}
    </div>
  );
}

export default CustomTable;
