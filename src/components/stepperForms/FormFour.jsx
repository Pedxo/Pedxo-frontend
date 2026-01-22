import sign from "../../assets/svg/sign.svg";
import sendContract from "../../assets/svg/sendcontract.svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utility/helper";
import useFinalizeContract from "../../features/contracts/useFinalizeContract";
import Button from "../Button";
import { useState, useEffect } from "react";
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

  // Load signature from localStorage on mount
  useEffect(() => {
    const savedSignature = localStorage.getItem(`${userId}_signature`);
    if (savedSignature && !signatureFile) {
      // Convert data URL back to File
      fetch(savedSignature)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "signature.png", {
            type: "image/png",
          });
          setSignatureFile(file);
        })
        .catch((err) => console.error("Failed to load signature:", err));
    }
  }, [userId]);
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

      data: savedState?.startDate ? formatDate(savedState?.startDate) : "-",
    },
    {
      title: "End Date",
      data: savedState?.endDate ? formatDate(savedState?.endDate) : "-",
    },
    {
      title: "Job Title",
      data: savedState?.roleTitle ?? "-",
    },
    {
      title: "Seniority Level",
      data: savedState?.seniorityLevel ?? "-",
    },
    {
      title: "Scope of Work",
      data: savedState?.scopeOfWork ?? "-",
    },
    { title: "Job Title", data: safeState.roleTitle ?? "-" },
    { title: "Seniority Level", data: safeState.seniorityLevel ?? "-" },
    { title: "Scope of Work", data: safeState.scopeOfWork ?? "-" },
    {
      title: "Payment Rate",
      data:
        formatCurrency(
          savedState?.paymentRate,
          savedState?.country === "Nigeria" ? "NGN" : "USD",
          savedState?.country === "Nigeria" ? "en-NG" : "en-US",
        ) ?? null,
    },
    {
      title: "Payment Frequency",
      data: savedState?.paymentFrequency ?? null,
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
        // Reset step to 1 for next contract
        sessionStorage.removeItem(`${username}_currentStep`);

        // Clear only FormTwo and FormThree fields while preserving FormOne data
        const savedInfo =
          JSON.parse(localStorage.getItem(`${username}_personalInfo`)) || {};
        const formTwoAndThreeFields = [
          "roleTitle",
          "seniorityLevel",
          "scopeOfWork",
          "startDate",
          "endDate",
          "explanationOfScopeOfWork",
          "paymentRate",
          "paymentFrequency",
        ];
        formTwoAndThreeFields.forEach((field) => delete savedInfo[field]);
        localStorage.setItem(
          `${username}_personalInfo`,
          JSON.stringify(savedInfo),
        );

        const newCount = completionCount + 1;
        setCompletionCount(newCount);
        sessionStorage.setItem("contractCompletionCount", newCount.toString());
      },
      onError: () => {
        toast.error("Failed to send contract.");
      },
    });
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="text-lg font-semibold leading-normal xl:text-2xl xl:mb-[18px]">
        {heading}
      </div>

      <div className="bg-white rounded-lg border border-solid border-[#00000033] px-10 pt-[53px] text-[0.625rem] xl:text-[1.125rem]">
        {userInfo.map((item, index) => (
          <div className="flex justify-between mb-[45px]" key={index}>
            <p className="text-[#00000080]">{item?.title}</p>
            <p className="text-right capitalize">{item?.data}</p>
          </div>
        ))}

        {signatureFile && (
          <div className="mb-[39px]">
            <div className="w-full h-[0.5px] bg-[#0000004d]"></div>
            <div className="mt-[39px] max-w-[100px] mx-auto">
              <img
                src={URL.createObjectURL(signatureFile)}
                alt="user signature"
              />
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

      {signatureFile && (
        <div className="flex items-center justify-center w-full">
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

      {/* Signature Form Modal */}
      {showSignatureForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg">
            <button
              type="button"
              onClick={() => setShowSignatureForm(false)}
              className="absolute text-xl text-gray-500 cursor-pointer top-4 right-4 hover:text-gray-700"
            >
              ✕
            </button>
            <FormFive
              setSignatureFile={(file) => {
                setSignatureFile(file);
                setShowSignatureForm(false);
              }}
              nextStep={() => setShowSignatureForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormFour;
