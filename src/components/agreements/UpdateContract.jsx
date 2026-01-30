import { useGlobalContext } from "../../Context";

const UpdateContract = ({ heading, currentStep, contract }) => {
  const { signature } = useGlobalContext();
  const { formStepperData } = useGlobalContext();

  const userInfo = [
    { title: "Contract Type", data: contract.contractType || "N/A" },
    {
      title: "Start Date",
      data: contract.startDate
        ? new Date(contract.startDate).toDateString()
        : "N/A",
    },
    {
      title: "End Date",
      data: contract.endDate
        ? new Date(contract.endDate).toDateString()
        : "N/A",
    },
    { title: "Role Title", data: contract.roleTitle || "N/A" },
    { title: "Seniority Level", data: contract.seniorityLevel || "N/A" },
    { title: "Scope of Work", data: contract.scopeOfWork || "N/A" },
    { title: "Payment Rate", data: contract.paymentRate ? `$${contract.paymentRate}` : "N/A" },
    { title: "Payment Frequency", data: contract.paymentFrequency || "N/A" },
  ];

  

  console.log(formStepperData);

  return (
    <div>
      <div className="flex flex-col gap-[18px]">
        <div className="text-lg font-semibold leading-normal xl:text-2xl xl:mb-[18px]">
          {heading}
        </div>

        <div className="bg-white rounded-lg border border-solid border-[#00000033] px-10 pt-[53px] text-[0.625rem] xl:text-[1.125rem]">
          {userInfo.map((item, index) => (
            <div className="flex justify-between mb-[45px]" key={index}>
              <p className="text-[#00000080]">{item.title}</p>
              {currentStep === 2 ? (
                <input
                  type="text"
                  defaultValue={item.data}
                  className="border border-solid border-[#00000066] px-4 py-1 rounded-lg"
                />
              ) : (
                <p className="text-right">{item.data}</p>
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
