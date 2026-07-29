import {
    FaPhoneAlt,
    FaWhatsapp,
  } from "react-icons/fa";
  
  const PhoneContactModal = ({
    isOpen,
    employee,
    onClose,
  }) => {
  
    if (!isOpen) return null;
  
    /* ----------------------------------------------------
       Remove spaces, +, -, (), etc.
       so WhatsApp receives only digits.
    ---------------------------------------------------- */
  
    const phone =
      employee?.phoneNumber || "";
  
    const cleanPhone =
      phone.replace(/\D/g, "");
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
  
        {/* Small Card */}
  
        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
  
          {/* Header */}
  
          <h2 className="text-lg font-semibold text-center">
            Contact Talent
          </h2>
  
          {/* Phone */}
  
          <div className="mt-6 text-center">
  
            <p className="text-gray-500 text-sm">
              Phone Number
            </p>
  
            <p className="font-semibold mt-1 break-all">
              {phone}
            </p>
  
          </div>
  
          {/* Buttons */}
  
          <div className="mt-6 flex flex-col gap-3">
  
            {/* ------------------------
                CALL BUTTON
            ------------------------- */}
  
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
            >
              <FaPhoneAlt />
  
              Call
  
            </a>
  
            {/* ------------------------
                WHATSAPP BUTTON
            ------------------------- */}
  
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 transition"
            >
              <FaWhatsapp />
  
              WhatsApp
  
            </a>
  
          </div>
  
          {/* Close */}
  
          <button
            onClick={onClose}
            className="w-full mt-5 border rounded-lg py-2 hover:bg-gray-100"
          >
            Close
          </button>
  
        </div>
  
      </div>
    );
  };
  
  export default PhoneContactModal;