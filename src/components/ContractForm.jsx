import { useState, useEffect, useCallback } from "react";
import "./Stepper.css";
import FormOne from "./stepperForms/FormOne";
import FormTwo from "./stepperForms/FormTwo";
import FormThree from "./stepperForms/FormThree";
import FormFour from "./stepperForms/FormFour";
import FormFive from "./stepperForms/FormFive";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGlobalContext } from "../Context";
import { FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import useContractById from "../features/contracts/useContractById";

const ContractForm = ({ subHead, endDate }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractType = searchParams.get("contractType");
  const { setFormStepperData, currentUser } = useGlobalContext();
  const contractId = searchParams.get("contractId");
  const { contract: existingContract, isLoading: isLoadingContract } =
    useContractById(contractId);

  // Generate or retrieve username
  const username = sessionStorage.getItem("username") || generateTempUsername();
  function generateTempUsername() {
    const temp = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem("username", temp);
    return temp;
  }

  // Get userId from auth context or fallback
  const userId =
    currentUser?.id || sessionStorage.getItem("userId") || generateTempUserId();
  function generateTempUserId() {
    const id = `uid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem("userId", id);
    return id;
  }

  // Step management
  // const savedStep = JSON.parse(
  //   sessionStorage.getItem(`${username}_currentStep`),
  // );
  const savedStep = contractId
  ? JSON.parse(
      sessionStorage.getItem(`${username}_currentStep`)
    )
  : 1;
  const [currentStep, setCurrentStep] = useState(savedStep || 1);
  const [savedState, setSavedState] = useState(null);

  // Helper function to determine which step the user left off at based on contract data
  const determineCurrentStepFromContract = (contract) => {
    if (!contract) return 1;
    
    // Check based on progress field from API
    if (contract.progress) {
      const stepMap = {
        "personal-info": 1,
        "job-details": 2,
        "compensation": 3,
        "review": 4
      };
      return stepMap[contract.progress] || 1;
    }
    
    // Fallback: check data availability
    if (!contract.clientName || !contract.email || !contract.country) return 1;
    if (!contract.roleTitle || !contract.startDate) return 2;
    if (!contract.paymentRate || !contract.paymentFrequency) return 3;
    return 4;
  };

  // Load contract data from API if contractId exists
  useEffect(() => {
    if (contractId && existingContract) {
      // Save the loaded contract data to localStorage
      localStorage.setItem(
        `${username}_personalInfo`,
        JSON.stringify(existingContract),
      );
      setSavedState(existingContract);

      // Set current step based on progress field
      const step = determineCurrentStepFromContract(existingContract);
      setCurrentStep(step);
      sessionStorage.setItem(`${username}_currentStep`, JSON.stringify(step));
    } else if (!contractId) {
      // Load from localStorage for new contract
      const contract = localStorage.getItem(`${username}_personalInfo`);
      setSavedState(contract ? JSON.parse(contract) : null);
    }
  }, [contractId, existingContract, username]);

  // Save current step to sessionStorage whenever it changes
  useEffect(() => {
    if (!isLoadingContract) {
      sessionStorage.setItem(
        `${username}_currentStep`,
        JSON.stringify(currentStep),
      );
    }
  }, [currentStep, username, isLoadingContract]);

  const getCompletionCount = () => {
    const count = sessionStorage.getItem(`${username}_contractCompletionCount`);
    return count ? parseInt(count) : 0;
  };
  const [completionCount, setCompletionCount] = useState(getCompletionCount());

  const handleOptionSelect = (option) => {
    setFormStepperData(option);
  };

  const steps = [
    "Personal Information",
    "Job Details",
    "Compensation Budget",
    "Review Contract",
  ];

  const initialValues = {
    clientName: "",
    email: "",
    country: "",
    state: "",
    companyName: "",
    roleTitle: "",
    seniorityLevel: "",
    scopeOfWork: "",
    description: "",
    startDate: "",
    endDate: "",
    paymentRate: "",
    paymentFrequency: "",
    signature: "",
  };

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard/add-developer");
    }
  }, [currentStep, navigate]);

  const validationSchema = Yup.object({
    scopeOfWork: Yup.string().notRequired(),
    startDate: Yup.string().required("Start date is required"),
    description: Yup.string().notRequired(),
    paymentRate: Yup.number().required("Payment rate is required"),
    paymentFrequency: Yup.string().required("Payment frequency is required"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      toast.success("Application sent Successfully");
    },
  });

  // Load saved form data dynamically based on current step
  useEffect(() => {
    const contract = localStorage.getItem(`${username}_personalInfo`);
    setSavedState(contract ? JSON.parse(contract) : null);
  }, [currentStep, username]);

  const nextStep = () => {
    const step = currentStep + 1;
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormOne
            nextStep={nextStep}
            savedState={savedState}
            contractType={contractType}
            username={username}
            userId={userId}
          />
        );
      case 2:
        return (
          <FormTwo
            nextStep={nextStep}
            contractType={contractType}
            savedState={savedState}
            username={username}
            userId={userId}
          />
        );
      case 3:
        return (
          <FormThree
            nextStep={nextStep}
            contractType={contractType}
            savedState={savedState}
            username={username}
            userId={userId}
          />
        );
      case 4:
        return (
          <FormFour
            nextStep={nextStep}
            setCurrentStep={setCurrentStep}
            savedState={savedState}
            heading="Review and Sign Contract"
            username={username}
            userId={userId}
          />
        );
      case 5:
        return (
          <FormFive
            nextStep={nextStep}
            savedState={savedState}
            username={username}
            userId={userId}
          />
        );
      case 6:
        return (
          <FormFour
            nextStep={nextStep}
            savedState={savedState}
            setCurrentStep={setCurrentStep}
            heading="Review and Sign Contract"
            signature={savedState?.signature}
            hasSignature={Boolean(savedState?.signature)}
            username={username}
            userId={userId}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state while fetching contract
  if (contractId && isLoadingContract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full gap-10 p-4 pt-10">
      <div
        className="flex items-center gap-1 text-sm font-medium leading-normal pr-text-clr xl:gap-3 cursor-pointer"
        onClick={handlePrevious}
      >
        <FaArrowLeft size={18} />
        <span>Go back</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <h3 className="text-xl leading-normal font-bold xl:text-[29px]">
            {contractId ? "Resume Contract" : "Preparing a contract"}
          </h3>
          <p
            className="text-[12px] font-medium leading-normal xl:w-[428px] xl:text-[16px]"
            style={{ color: "rgba(0, 0, 0, 0.60)" }}
          >
            {contractId 
              ? "Continue where you left off. Review and complete your contract details."
              : "Input the required details to customize your contract. Ensure all fields are complete for accuracy."
            }
          </p>
        </div>

        <div className="flex flex-col w-full gap-5 md:flex-row md:justify-between">
          {/* Stepper */}
          <div className="flex overview-expense-bg border-[2px] border-[#E1E2DD] mb-3 md:mb-0 rounded-2xl h-fit md:p-8 px-8 p-2 flex-shrink-0 lg:w-96 gap-4 md:flex-col md:order-2 items-center">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center w-full gap-4">
                <p
                  className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full ${
                    currentStep >= i + 1
                      ? "bg-[#008000] text-white"
                      : "text-[#E1E2DD] ring-1 ring-[#E1E2DD]"
                  }`}
                >
                  {i + 1}
                </p>
                <p className="hidden text-sm font-medium leading-normal text-center truncate md:block lg:text-base">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="overview-expense-bg border-[2px] border-[#E1E2DD] p-10 w-full rounded-3xl">
            <div>{renderStep()}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractForm;