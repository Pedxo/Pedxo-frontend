import { useGlobalContext } from "../../Context";


const UpdateContract = ({ heading, currentStep, value, onChange }) => {
  const { signature} = useGlobalContext();
  const { formStepperData } = useGlobalContext();
  if (!value) return null;

   // keep local state in sync when contract loads/changes
  const userInfo = [
    { label: "Contract Type", key: "contractType" },
    { label: "Start Date", key: "startDate", type: "date" },
    { label: "End Date", key: "endDate", type: "date" },
    { label: "Role Title", key: "roleTitle" },
    { label: "Seniority Level", key: "seniorityLevel" },
    { label: "Scope of Work", key: "scopeOfWork" },
    { label: "Payment Rate", key: "paymentRate" },
    { label: "Payment Frequency", key: "paymentFrequency" },
  ];


 const handleChange = (key, val) => {
    const updated = {
      ...value,
      [key]:
        key === "paymentRate"
          ? Number(val)
          : key.includes("Date")
          ? new Date(val).toISOString()
          : val,
    };

    onChange(updated);
  };


  const formatDate = (d) =>
    d ? new Date(d).toISOString().split("T")[0] : "";


  console.log(formStepperData);

  return (
    <div>
      <div className="flex flex-col gap-[18px]">
        <div className="text-lg font-semibold leading-normal xl:text-2xl xl:mb-[18px]">
          {heading}
        </div>

        <div className="bg-white rounded-lg border border-solid border-[#00000033] px-10 pt-[53px] text-[0.625rem] xl:text-[1.125rem]">
          {userInfo.map(({ label, key, type }) => (
            <div key={key} className="flex justify-between mb-[45px]">
              <p className="text-[#00000080]">{label}</p>
              {currentStep === 2 ? (
                <input
                type={type || "text"}
                value={type === "date" ? formatDate(value?.[key]) : value?.[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="border border-solid border-[#00000066] px-4 py-1 rounded-lg"
                />
              ) : (
                
                <p className="text-right">
                  {value?.[key]
                  ? key.includes("Date")
                  ? new Date(value[key]).toDateString()
                  : value[key]
                  : "N/A"}
                </p>
              )}
            </div>
          ))}

          <div className={`mb-[39px] ${signature ? "block" : "hidden"} `}>
            <div className="w-full h-[0.5px] bg-[#0000004d]"></div>
            <div className="mt-[39px] max-w-[100px] mx-auto">
              {signature && <img src={signature} alt="user signature" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateContract;

// {
//   title: "Contract Type",
//   data: "Contract type",
// },
// {
//   title: "Start Date",
//   data: formStepperData.contractStartDate,
// },
// {
//   title: "End Date",
//   data: formStepperData.contractEndDate,
// },
// {
//   title: "Role Title",
//   data: formStepperData.roleTitle,
// },
// {
//   title: "Seniority Level",
//   data: formStepperData.seniorityLevel,
// },
// {
//   title: "Scope of work",
//   data: formStepperData.responsibility,
// },
// {
//   title: "Payment Rate",
//   data: "Contract type",
// },
// {
//   title: "Payment Frequency",
//   data: "Contract type",
// },
