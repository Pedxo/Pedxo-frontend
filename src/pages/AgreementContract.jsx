import { useState } from "react";
import leftarrorw from "../assets/svg/leftarrow.svg";
import edit from "../assets/svg/edit.svg";
import { Link } from "react-router-dom";
import document from "../assets/svg/document.svg";

import PrimaryBtn from "../components/PrimaryBtn";
import MobileTransactionHistory from "../components/agreements/MobileTransactionHistory";
import UpdateContract from "../components/agreements/UpdateContract";
import { BsArrowLeft } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";

const AgreementContract = () => {
  // const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [isPaymentDue, setIsPaymentDue] = useState(false);
  const [isTransactionHistoryVisible, setIsTransactionHistoryVisible] =
    useState(false);
  const [prevStep, setPrevStep] = useState(null);

  const handlePrevious = () => {
    if (isTransactionHistoryVisible) {
      setIsTransactionHistoryVisible(false);
      if (prevStep !== null) {
        setCurrentStep(prevStep);
        setPrevStep(null);
      }
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditDocumentClick = () => {
    setPrevStep(currentStep);
    setIsTransactionHistoryVisible(true);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  const renderStep = () => {
    if (isTransactionHistoryVisible) return null;

    switch (currentStep) {
      case 1:
        return (
          <div>
            <UpdateContract heading="Mike Santos Contract" />
          </div>
        );

      case 2:
        return (
          <div>
            <UpdateContract
              heading="Mike Santos Contract"
              currentStep={currentStep}
            />
          </div>
        );
    }
  };

  return (
    <section className="w-full px-10 pt-20">
      {/* <h1>Agreement ID: {id}</h1> */}
        <div className="flex justify-between  xl:mx-0">
          <div
            className="flex items-center  font-medium leading-normal pr-text-clr text-base gap-2"
            onClick={handlePrevious}
          >
            <FaArrowLeft />
            {isTransactionHistoryVisible === true ? (
              <span
                className="cursor-pointer"
                onClick={() => setIsTransactionHistoryVisible(false)}
              >
                Go back
              </span>
            ) : (
              <Link to="/dashboard/agreements" className="cursor-pointer">
                Go back
              </Link>
            )}
          </div>
          <div
            className={`cursor-pointer md:mr-24 xl:hidden ${
              currentStep === 2 || isTransactionHistoryVisible
                ? "hidden"
                : "block"
            } `}
            onClick={handleEditDocumentClick}
          >
            <img src={document} alt="document" />
          </div>
        </div>

        {isTransactionHistoryVisible ? (
          <MobileTransactionHistory />
        ) : (
          <div className="flex flex-col xl:flex-row xl:justify-center xl:gap-[48px] xl:mt-[75px]">
            <div
              className={`xl:order-1 ${currentStep === 2 ? "hidden" : "block"}`}
            >
              <div className="flex flex-col gap-[15px] px-5 py-[18px] user-bg-clr rounded-lg mx-[21px]  text-[0.75rem] font-medium xl:mx-0  xl:max-w-[454px] xl:gap-[21px] xl:pl-[50px] xl:pr-[38px] xl:py-[52px] xl:text-[1.125rem] ">
                <div className="text-base font-semibold xl:text-[2.3125rem] xl:leading-normal">
                  Total Amount Paid : $20,000
                </div>
                <div className="">
                  <span>Pay Schedule: </span>
                  <span className="font-semibold">BiWeekly</span>
                </div>
                <div className="">
                  <span> Pay Rate: </span>
                  <span className="font-semibold">$5,000</span>
                </div>
                <div className="">
                  <span>Pay Period: </span>
                  <span className="font-semibold">
                    Jul 16, 2024 - Jul 29, 2024
                  </span>
                </div>

                {isPaymentDue ? (
                  <div className="flex justify-between">
                    <span className="text-[#F00]">Your payment is Due</span>
                    <PrimaryBtn text="Pay now" />
                  </div>
                ) : (
                  <div className="">
                    <span>Due by </span>
                    <span className="font-semibold">
                      Aug 29, 2023 at 11:00pm
                    </span>
                  </div>
                )}
              </div>

              <div className="hidden text-xl font-semibold mt-[30px] mb-[20px] xl:block">
                Transaction History
              </div>

              <div className="hidden xl:flex flex-col gap-[15px] px-5 py-[18px] user-bg-clr rounded-lg text-[0.75rem] font-medium xl:max-w-[454px] xl:gap-[21px] xl:pl-[50px] xl:pr-[38px] xl:py-[52px] xl:text-[1.125rem] ">
                <div className="flex justify-between font-medium text-[#00000099]">
                  <div>Fixed Payment</div>
                  <div>
                    <span>07:10</span> <span>06/23</span>
                  </div>
                  <div>$5000</div>
                </div>
              </div>
            </div>

            <div className=" user-bg-clr lg:w-[32em] rounded-lg  p-10 xl:order-0 xl:mx-0">
              {/* <form onSubmit={handleSubmit}> */}
              <div>{renderStep()}</div>

              <div className="lg:flex lg:justify-center">
                <button
                  type="submit"
                  className={`pr-bg-clr mt-[18px] w-full rounded-lg text-white text-[0.75rem] py-[14px] lg:w-auto lg:mx-auto lg:px-[60px] lg:py-6 xl:text-base xl:mt-[36px] ${
                    currentStep === 3 ? "hidden" : "block"
                  } `}
                  onClick={() => {
                    currentStep === 2
                      ? setComplete(true)
                      : setCurrentStep((prev) => prev + 1);
                  }}
                >
                  {currentStep === 2 ? (
                    <div className="flex items-center justify-center">
                      Update Contract
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <img src={edit} alt="edit icon" /> Edit Contract
                    </div>
                  )}
                </button>
              </div>
              {/* </form> */}
            </div>
          </div>
        )}
    </section>
  );
};
export default AgreementContract;