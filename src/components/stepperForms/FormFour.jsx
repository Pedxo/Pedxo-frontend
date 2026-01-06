import sign from "../../assets/svg/sign.svg";
import sendContract from "../../assets/svg/sendcontract.svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utility/helper";
import useFinalizeContract from "../../features/contracts/useFinalizeContract";
import Button from "../Button";
import { useState } from "react";
import FormFive from "./FormFive";
import toast from "react-hot-toast";

const FormFour = ({
  savedState,
  heading,
  nextStep,
  setCurrentStep,
  username,
  userId,
}) => {
  const [searchParams] = useSearchParams();
  const contractType = searchParams.get("contractType") ?? "";
  const { finalize, sendingForm } = useFinalizeContract();
  const [signatureFile, setSignatureFile] = useState(null);
  const [showSignatureForm, setShowSignatureForm] = useState(false);

  const getCompletionCount = () => {
    const count = sessionStorage.getItem("contractCompletionCount");
    return count ? parseInt(count) : 0;
  };
  const [completionCount, setCompletionCount] = useState(getCompletionCount());

  const safeState = savedState || {};

  const userInfo = [
    { title: "Contract Type", data: contractType.split("-").join(" ") },
    {
      title: "Start Date",
      data: safeState.startDate ? formatDate(safeState.startDate) : "-",
    },
    {
      title: "End Date",
      data: safeState.endDate ? formatDate(safeState.endDate) : "-",
    },
    { title: "Job Title", data: safeState.roleTitle ?? "-" },
    { title: "Seniority Level", data: safeState.seniorityLevel ?? "-" },
    { title: "Scope of Work", data: safeState.scopeOfWork ?? "-" },
    {
      title: "Payment Rate",
      data:
        formatCurrency(
          safeState.paymentRate,
          safeState.country === "Nigeria" ? "NGN" : "USD",
          safeState.country === "Nigeria" ? "en-NG" : "en-US"
        ) ?? "-",
    },
    { title: "Payment Frequency", data: safeState.paymentFrequency ?? "-" },
  ];

  const sendFinalForm = () => {
    if (!signatureFile) {
      toast.error("Please sign the contract before sending.");
      return;
    }

    const formData = new FormData();
    for (const key in safeState) {
      formData.append(key, safeState[key]);
    }
    formData.append("userId", userId);
    formData.append("signature", signatureFile);

    finalize(formData, {
      onSuccess: () => {
        toast.success("Contract sent successfully!");
        sessionStorage.removeItem("currentStep");
        const newCount = completionCount + 1;
        setCompletionCount(newCount);
        sessionStorage.setItem("contractCompletionCount", newCount.toString());
      },
      onError: () => {
        toast.error("Failed to send contract.");
      },
    });
    sessionStorage.removeItem("currentStep");
    // Increment the completion count
    const newCount = completionCount + 1;
    setCompletionCount(newCount);
    sessionStorage.setItem("contractCompletionCount", newCount.toString());
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="text-lg font-semibold leading-normal xl:text-2xl xl:mb-[18px]">
        {heading}
      </div>

      <div className="bg-white rounded-lg border border-solid border-[#00000033] px-10 pt-[53px] text-[0.625rem] xl:text-[1.125rem]">
        {userInfo.map((item, index) => (
          <div className="flex justify-between mb-[45px]" key={index}>
            <p className="text-[#00000080]">{item.title}</p>
            <p className="text-right capitalize">{item.data}</p>
          </div>
        ))}

        {signatureFile && (
          <div className="mb-[39px]">
            <div className="w-full h-[0.5px] bg-[#0000004d]"></div>
            <div className="mt-[39px] max-w-[100px] mx-auto">
              <img src={URL.createObjectURL(signatureFile)} alt="user signature" />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowSignatureForm(true)}
        className="flex items-center justify-between border border-solid border-[#00000033] px-[15px] py-[10px] bg-[#d9d9d980] rounded-lg xl:px-[30px] xl:py-[19px] cursor-pointer"
      >
        <div className="font-medium text-[0.6875rem] text-[#00000099] xl:text-[1.125rem]">
          {signatureFile ? "Re-Sign Contract" : "Sign Contract"}
        </div>
        <img src={sign} alt="sign icon" />
      </button>

      {hasSignature && (
        <div className="w-full flex items-center justify-center">
          <Button
            type="primary"
            onClick={sendFinalForm}
            isLoading={sendingForm}
            disabled={sendingForm}
            size="full"
            iconRight={<img src={sendContract} alt="send icon" />}
          >
            Send Contract
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormFour;