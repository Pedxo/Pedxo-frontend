import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const DepositModal = ({ isOpen, onClose }) => {
  const [hideBank, setHideBank] = useState(false);

  if (!isOpen) return null;

  const data = [
    { label: "Account Name", value: "Victor Chukwuma" },
    { label: "Account Number", value: "210328641937" },
    { label: "Wire Routing", value: "101019644" },
    { label: "ACH Routing", value: "101019644" },
    { label: "Account Type", value: "Checking" },
    {
      label: "Bank Address",
      value: "1801 Main St., Kansas City, MO 64108",
    },
    {
      label: "Bank Name",
      value: hideBank ? "******" : "Lead Bank",
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/80 px-4">
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-sm rounded-xl p-3 shadow-lg ">

        {/* Title */}
        <h3 className="text-sm font-semibold mb-2">
          Copy and transfer into this Account to deposit
        </h3>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md p-2"
            >
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">
                  {item.label}
                </span>
                <span className="text-xs font-semibold">
                  {item.value}
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(item.value)}
                className="text-gray-500 hover:text-black"
              >
                <FaRegCopy size={14} />
              </button>
            </div>
          ))}

          {/* Toggle Bank Name */}
          <p
            onClick={() => setHideBank(!hideBank)}
            className="text-[11px] text-blue-600 cursor-pointer"
          >
            {hideBank ? "Show bank name" : "Hide bank name"}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full text-blue-600 text-xs py-2 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DepositModal;