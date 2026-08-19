import {
    FaArrowLeft,
    FaHome,
    FaCity,
    FaMapMarkerAlt,
    FaGlobeAfrica,
    FaMotorcycle,
  } from "react-icons/fa";
  
  const RiderAddressCard = ({
    employee,
    profileImage,
    onBack,
  }) => {
  
    if (!employee) return null;
  
    if (employee.isRider !== true) {
      return null;
    }
  
    return (
  
        <section className="w-full p-8">
  
            {/* Back */}
  
            <button
                onClick={onBack}
                className="flex items-center md:text-md text-sm gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
                <FaArrowLeft />
  
                Back to Teams
            </button>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 mt-6 text-white">
                <div className="flex flex-col items-center">
                    <img
                        src={profileImage}
                        alt="profile"
                        className="md:w-36 md:h-36 w-24 h-24 rounded-full border-4 border-white object-cover shadow-xl"
                    />
                    <h2 className="mt-5 md:text-3xl text-lg font-bold">
                        {employee.fullName}
                    </h2>
                    <div className="mt-3 flex md:text-md text-sm items-center gap-2 bg-white/20 px-5 py-2 rounded-full">
                        <FaMotorcycle />
                        Rider
                    </div>
                </div>
            </div>
            {/* Address - information */}
            <div className="bg-white mt-8 p-10">
                <h3 className="md:text-2xl text-md font-semibold mb-8">
                    Rider Address Information
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex gap-4 shadow-lg py-4 px-4 rounded-3xl">
                        <div className="md:w-14 md:h-14 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaHome className="text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-gray-500 md:text-sm text-[11px]">
                                Home Address
                            </p>
                            <p className="font-semibold md:text-lg text-sm">
                                {employee.homeAddress || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 shadow-lg py-4 px-4 rounded-3xl">
                        <div className="md:w-14 md:h-14 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <FaCity className="text-green-600"/>
                        </div>
                        <div>
                            <p className="text-gray-500 md:text-sm text-[11px]">
                                City
                            </p>
                            <p className="font-semibold md:text-lg text-sm">
                                {employee.city || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 shadow-lg py-4 px-4 rounded-3xl">
                        <div className="md:w-14 md:h-14 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <FaMapMarkerAlt className="text-orange-600"/>
                        </div>
                        <div>
                            <p className="text-gray-500 md:text-sm text-[11px]">
                                State
                            </p>
                            <p className="font-semibold md:text-lg text-sm">
                                {employee.state || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 shadow-lg py-4 px-4 rounded-3xl">
                        <div className="md:w-14 md:h-14 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaGlobeAfrica className="text-purple-600"/>
                        </div>
                        <div>
                            <p className="text-gray-500 md:text-sm text-[11px]">
                                Country
                            </p>
                            <p className="font-semibold md:text-lg text-sm">
                                {employee.country || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
  
  };
  
  export default RiderAddressCard;