import { useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PersonalInformationForm,
  JobDetailsForm,
  CompensationBudgetForm,
  ReviewFormData,
  SignContract,
} from "../ui/Forms";
import Button from "../ui/Button";

function Contract() {
  const [searchParams] = useSearchParams();
  const [hasSignature, setHasSignature] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const ct = searchParams.get("ct") || "";
  const totalSteps = 4;
  function handlePrevious() {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep(step - 1);
    }
  }

  const formTitles = [
    "Personal Information",
    "Job Details",
    "Compensation Budget",
    "Review Contract",
  ];

  const renderForms = () => {
    switch (step) {
      case 1:
        return <PersonalInformationForm />;
      case 2:
        return <JobDetailsForm ct={ct} />;
      case 3:
        return <CompensationBudgetForm />;
      case 4:
        return (
          <ReviewFormData
            setStep={setStep}
            hasSignature={hasSignature}
            setHasSignature={setHasSignature}
          />
        );
      case 5:
        return (
          <SignContract setStep={setStep} setHasSignature={setHasSignature} />
        );
    }
  };

  const renderStepsline = () => {
    switch (step) {
      case 1:
        return "lg:h-[0%] w-[0%] ";
      case 2:
        return "lg:h-[30%] w-[30%]";
      case 3:
        return "lg:h-[60%] w-[60%]";
      case 4:
        return "lg:h-[90%] w-[90%]";
    }
  };

  return (
    <section className="flex py-28 w-full flex-col gap-8">
      <h2
        role="button"
        onClick={handlePrevious}
        className="text-sm font-semibold top-10 flex absolute  items-center gap-3 cursor-pointer text-primary"
      >
        <FaLongArrowAltLeft /> <span>Go back</span>
      </h2>

      <div className="space-y-2">
        <h2 className="heading-2">Preparing a contract</h2>
        <p className="paragraph-1">
          Input the required details to customize your contract. <br />
          Ensure all fields are complete for accuracy.
        </p>
      </div>

      <section className="flex lg:flex-row lg:max-w-full max-w-[33em] lg:mx-0 mx-auto flex-col items-start gap-2 lg:gap-10 w-full">
        <div className="flex items-center flex-col w-full order-1 lg:order-2 gap-10 max-w-[33em] rounded-md justify-center p-5 md:p-10 bg-brandLightGrey">
          {renderForms()}
          {step < 4 && (
            <div className="w-full  flex justify-center">
              <Button
                onClick={() => setStep(step + 1)}
                size="medium"
                type="primary"
                disabled={step > 4}
              >
                Save and Continue
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center lg:order-2 w-full lg:w-80 gap-6 rounded-md justify-start p-5 lg:p-7  lg:bg-brandLightGrey">
          <div className="flex relative  lg:w-10 w-full items-center justify-between lg:flex-col  lg:gap-10">
            <span className="lg:h-full w-full h-[2px] z-10  flex  absolute lg:w-[2px] bg-black/40">
              <span
                className={`lg:w-[2px] h-[2px]  bg-brandGreen transition-all duration-300 ease-in  z-10 ${renderStepsline()}`}
              ></span>
            </span>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <p
                key={i}
                className={`w-12 lg:h-8 lg:w-8 z-20 h-12 flex items-center font-medium transition-colors duration-300 ease-in justify-center border rounded-full ${
                  step >= i + 1
                    ? "border-brandGreen bg-brandGreen text-white"
                    : "lg:bg-brandLightGrey bg-white text-black/40 border-black/40"
                }`}
              >
                {i + 1}
              </p>
            ))}
          </div>
          <div className="lg:flex hidden flex-col gap-10">
            {formTitles.map((el, i) => (
              <p
                key={el}
                className={` h-8 flex font-medium items-center   ${
                  step >= i + 1 ? "text-brandGreen" : "text-black/40"
                }`}
              >
                {el}
              </p>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

export default Contract;
