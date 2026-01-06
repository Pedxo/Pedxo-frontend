import { useState, useEffect, useCallback } from 'react';
import './Stepper.css';
import FormOne from './stepperForms/FormOne';
import FormTwo from './stepperForms/FormTwo';
import FormThree from './stepperForms/FormThree';
import FormFour from './stepperForms/FormFour';
import FormFive from './stepperForms/FormFive';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobalContext } from '../Context';
import { FaArrowLeft } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const ContractForm = ({ subHead, endDate }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractType = searchParams.get('contractType');
  const { setFormStepperData, currentUser } = useGlobalContext();

  // Generate or retrieve username
  const username = sessionStorage.getItem('username') || generateTempUsername();
  function generateTempUsername() {
    const temp = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem('username', temp);
    return temp;
  }

  // Get userId from auth context or fallback
  const userId = currentUser?.id || sessionStorage.getItem('userId') || generateTempUserId();
  function generateTempUserId() {
    const id = `uid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem('userId', id);
    return id;
  }

  // Step management
  const savedStep = JSON.parse(sessionStorage.getItem(`${username}_currentStep`));
  const [currentStep, setCurrentStep] = useState(savedStep || 1);

  const getCompletionCount = () => {
    const count = sessionStorage.getItem(`${username}_contractCompletionCount`);
    return count ? parseInt(count) : 0;
  };
  const [completionCount, setCompletionCount] = useState(getCompletionCount());

  const handleOptionSelect = (option) => {
    setFormStepperData(option);
  };

  const steps = [
    'Personal Information',
    'Job Details',
    'Compensation Budget',
    'Review Contract',
  ];

  const initialValues = {
    clientName: '',
    email: '',
    country: '',
    state: '',
    companyName: '',
    roleTitle: '',
    seniorityLevel: '',
    scopeOfWork: '',
    description: '',
    startDate: '',
    endDate: '',
    paymentRate: '',
    paymentFrequency: '',
    signature: '',
  };

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      sessionStorage.setItem(`${username}_currentStep`, JSON.stringify(currentStep - 1));
    } else {
      navigate('/dashboard/add-developer');
    }
  }, [currentStep, navigate, username]);

  const validationSchema = Yup.object({
    scopeOfWork: Yup.string().required('Scope of work is required'),
    startDate: Yup.string().required('Start date is required'),
    description: Yup.string().required('Scope of work explanation is required'),
    paymentRate: Yup.number().required('Payment rate is required'),
    paymentFrequency: Yup.string().required('Payment frequency is required'),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      toast.success('Application sent Successfully');
    },
  });

  // Load saved form data dynamically based on current step
  const [savedState, setSavedState] = useState(null);
  useEffect(() => {
    const contract = localStorage.getItem(`${username}_personalInfo`);
    setSavedState(contract ? JSON.parse(contract) : null);
  }, [currentStep, username]);

  const nextStep = () => {
    const step = currentStep + 1;
    setCurrentStep(step);
    sessionStorage.setItem(`${username}_currentStep`, JSON.stringify(step));
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

  return (
    <section className="p-4 w-full flex flex-col gap-10 pt-10">
      <div className="flex items-center gap-1 text-sm font-medium leading-normal pr-text-clr xl:gap-3" onClick={handlePrevious}>
        <FaArrowLeft size={18} />
        <span className="cursor-pointer">Go back</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <h3 className="text-xl leading-normal font-bold xl:text-[29px]">Preparing a contract</h3>
          <p className="text-[12px] font-medium leading-normal xl:w-[428px] xl:text-[16px]" style={{ color: 'rgba(0, 0, 0, 0.60)' }}>
            Input the required details to customize your contract. Ensure all fields are complete for accuracy.
          </p>
        </div>

        <div className="flex-col flex md:flex-row gap-5 md:justify-between w-full">
          {/* Stepper */}
          <div className="flex overview-expense-bg border-[2px] border-[#E1E2DD] mb-3 md:mb-0 rounded-2xl h-fit md:p-8 px-8 p-2 flex-shrink-0 lg:w-96 gap-4 md:flex-col md:order-2 items-center">
            {steps.map((step, i) => (
              <div key={i} className="flex w-full items-center gap-4">
                <p className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full ${
                  currentStep >= i + 1 ? 'bg-[#008000] text-white' : 'text-[#E1E2DD] ring-1 ring-[#E1E2DD]'
                }`}>
                  {i + 1}
                </p>
                <p className="hidden md:block text-center text-sm lg:text-base truncate font-medium leading-normal">
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