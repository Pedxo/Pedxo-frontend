import sign from "../../assets/svg/sign.svg";
import sendContract from "../../assets/svg/sendcontract.svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const clearDraftData = () => {
    if (!username) return;
    localStorage.removeItem(`${username}_personalInfo`);
    localStorage.removeItem(`${username}_countryLocked`);
    localStorage.removeItem(`${username}_stateLocked`);
    sessionStorage.removeItem(`${username}_currentStep`);
  };

  const sendFinalForm = () => {
    console.log("[FORM] sendFinalForm() called!");
    console.log("signatureFile:", signatureFile);
    console.log("safeState:", safeState);
    console.log("userId:", userId);
    
    if (!signatureFile) {
      console.warn("[WARN] No signature file, aborting");
      toast.error("Please sign the contract before sending.");
      return;
    }
    
    console.log("[FORM] Signature file exists, proceeding with form submission");

    // Ensure we have the latest data from localStorage
    // Read fresh from localStorage to get the most up-to-date data
    const latestData = JSON.parse(localStorage.getItem(`${username}_personalInfo`)) || {};
    const mergedData = { ...latestData, ...safeState };
    
    // Ensure all required fields are present
    const requiredFields = {
      clientName: mergedData.clientName || '',
      email: mergedData.email || '',
      country: mergedData.country || '',
      companyName: mergedData.companyName || '',
      roleTitle: mergedData.roleTitle || '',
      seniorityLevel: mergedData.seniorityLevel || '',
      scopeOfWork: mergedData.scopeOfWork || '',
      startDate: mergedData.startDate || '',
      endDate: mergedData.endDate || '',
      paymentRate: mergedData.paymentRate || '',
      paymentFrequency: mergedData.paymentFrequency || '',
      description: mergedData.description || mergedData.explanationOfScopeOfWork || '',
      contractType: contractType || mergedData.contractType || '',
      userId: userId || mergedData.userId || '',
    };
    
    // Merge required fields with mergedData (required fields take precedence)
    const finalData = { ...mergedData, ...requiredFields };
    
    console.log("[FORM] Latest data from localStorage:", latestData);
    console.log("[FORM] Merged data (latest + safeState):", mergedData);
    console.log("[FORM] Final data being sent (with required fields):", finalData);
    
    const formData = new FormData();
    const formDataLog = {}; // For logging purposes
    
    // Map field names to match backend expectations
    // FormTwo uses 'explanationOfScopeOfWork' but backend expects 'description'
    const fieldMapping = {
      explanationOfScopeOfWork: "description",
    };
    
    // Also ensure description field exists if explanationOfScopeOfWork is present
    if (finalData.explanationOfScopeOfWork && !finalData.description) {
      finalData.description = finalData.explanationOfScopeOfWork;
    }
    
    // Add all fields from final data in a specific order to ensure consistency
    const fieldOrder = [
      'clientName', 'email', 'country', 'state', 'region', 'companyName',
      'contractType', 'roleTitle', 'seniorityLevel', 'scopeOfWork',
      'startDate', 'endDate', 'paymentRate', 'paymentFrequency',
      'description', 'explanationOfScopeOfWork', 'userId'
    ];
    
    // First, add fields in the specified order
    fieldOrder.forEach(key => {
      if (finalData.hasOwnProperty(key)) {
        const value = finalData[key];
        if (value !== null && value !== undefined && value !== '') {
          const backendKey = fieldMapping[key] || key;
          // Skip if we already added the mapped version
          if (key === 'explanationOfScopeOfWork' && finalData.description) {
            return; // Skip explanationOfScopeOfWork if description exists
          }
          
          if (typeof value === "object" && !(value instanceof File) && !(value instanceof Blob) && !Array.isArray(value)) {
            formData.append(backendKey, JSON.stringify(value));
            formDataLog[backendKey] = JSON.stringify(value);
          } else {
            formData.append(backendKey, value);
            formDataLog[backendKey] = value instanceof File ? `[File: ${value.name}, size: ${value.size} bytes]` : value;
          }
        }
      }
    });
    
    // Then add any remaining fields not in the order list
    for (const key in finalData) {
      if (!fieldOrder.includes(key) && finalData[key] !== null && finalData[key] !== undefined && finalData[key] !== '') {
        const backendKey = fieldMapping[key] || key;
        const value = finalData[key];
        
        if (typeof value === "object" && !(value instanceof File) && !(value instanceof Blob) && !Array.isArray(value)) {
          formData.append(backendKey, JSON.stringify(value));
          formDataLog[backendKey] = JSON.stringify(value);
        } else {
          formData.append(backendKey, value);
          formDataLog[backendKey] = value instanceof File ? `[File: ${value.name}, size: ${value.size} bytes]` : value;
        }
      }
    }
    
    // Ensure required fields are included (override if already added)
    if (userId) {
      formData.set("userId", userId); // Use set to override if exists
      formDataLog["userId"] = userId;
    }
    formData.append("signature", signatureFile);
    formDataLog["signature"] = `[File: ${signatureFile.name}, size: ${signatureFile.size} bytes, type: ${signatureFile.type}]`;
    
    if (contractType) {
      formData.set("contractType", contractType); // Use set to override if exists
      formDataLog["contractType"] = contractType;
    }
    
    // Log the complete payload being sent
    console.log("[FORM] Complete FormData payload being sent:", formDataLog);
    console.log("[FORM] Total fields in FormData:", Array.from(formData.keys()).length);

    // Log what's being sent to backend
    console.log("[FORM] Sending contract form data to backend:");
    console.log("FormData contents:", formDataLog);
    console.log("Full safeState:", safeState);
    console.log("Contract Type:", contractType);
    console.log("[FORM] About to call finalize() function...");
    console.log("finalize function type:", typeof finalize);
    console.log("sendingForm status:", sendingForm);

    // Call the mutation - React Query mutate supports callbacks as second param
    console.log("[FORM] Calling finalize mutation...");
    console.log("[FORM] FormData ready, mutation should execute now");
    console.log("[FORM] finalize function:", finalize);
    console.log("[FORM] finalize type:", typeof finalize);
    
    // Verify finalize is a function
    if (typeof finalize !== 'function') {
      console.error("[CRITICAL] finalize is not a function! It is:", typeof finalize, finalize);
      toast.error("Form submission error. Please refresh the page.");
      return;
    }
    
    // Call mutate with callbacks
    const mutationPromise = finalize(formData, {
      onSuccess: (data) => {
        console.log("[SUCCESS] FormFour onSuccess callback triggered");
        console.log("[SUCCESS] Response data:", data);
        console.log("[SUCCESS] Data type:", typeof data);
        console.log("[SUCCESS] Data is null/undefined:", data === null || data === undefined);
        
        // Only show success if we actually got data from backend
        if (data === null || data === undefined) {
          console.error("[CRITICAL] onSuccess called but data is null/undefined - API call may not have executed!");
          toast.error("Submission may have failed. Please check your connection and try again.");
          return;
        }
        
        console.log("[SUCCESS] Navigating to dashboard...");
        toast.success("Contract sent successfully!");
        clearDraftData();
        // Refresh dashboard data
        queryClient.invalidateQueries({ queryKey: ["user-contracts", userId] });
        const newCount = completionCount + 1;
        setCompletionCount(newCount);
        sessionStorage.setItem(`${username}_contractCompletionCount`, newCount.toString());
        
        // Navigate to dashboard after successful submission
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      },
      onError: (error) => {
        console.error("[ERROR] FormFour onError callback triggered");
        console.error("[ERROR] Full error object:", error);
        console.error("[ERROR] Error type:", typeof error);
        console.error("[ERROR] Error message:", error?.message);
        console.error("[ERROR] Error response:", error?.response);
        console.error("[ERROR] Error response data:", error?.response?.data);
        console.error("[ERROR] Error response status:", error?.response?.status);
        console.error("[ERROR] Error stack:", error?.stack);
        toast.error("Failed to send contract. Please try again.");
      },
      onSettled: (data, error) => {
        console.log("[SETTLED] Mutation settled");
        console.log("[SETTLED] Data:", data);
        console.log("[SETTLED] Error:", error);
      }
    });
    
    console.log("[FORM] finalize() function called - mutation should be executing");
    console.log("[FORM] Mutation return value:", mutationPromise);
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

      {showSignatureForm && (
        <FormFive
          nextStep={() => setShowSignatureForm(false)}
          setSignatureFile={setSignatureFile}
        />
      )}

      {signatureFile && !showSignatureForm && (
        <div className="w-full flex items-center justify-center mt-6">
          <Button
            type="primary"
            onClick={(e) => {
              console.log("[BUTTON] Send Contract button clicked!");
              console.log("[BUTTON] Event:", e);
              console.log("[BUTTON] sendFinalForm function:", typeof sendFinalForm);
              e?.preventDefault?.();
              sendFinalForm();
            }}
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