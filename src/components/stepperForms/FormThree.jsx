import "../stepperForms/forms.css";
import dropdownarrow from "../../assets/svg/dropdownarrow.svg";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import useCompensation from "../../features/contracts/useCompensation";
import CustomForm from "../../ui/CustomForm";
import Button from "../Button";

const FormThree = ({ nextStep, savedState, username, userId }) => {
  const { updatePayment, isUpdating } = useCompensation();
  const [hasChanges, setHasChanges] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // Load currency symbol for this user
  useEffect(() => {
    const storedCode = localStorage.getItem(`${username}_userCurrencyCode`);
    setCurrencySymbol(storedCode === "NGN" ? "₦" : "$");
  }, [username]);

  // Auto-fill from saved personal info
  useEffect(() => {
    const savedInfo = JSON.parse(localStorage.getItem(`${username}_personalInfo`));
    if (savedInfo) {
      formik.setValues((prev) => ({
        ...prev,
        ...savedInfo,
      }));
    }
  }, [username]);

  const validationSchema = Yup.object({
    paymentRate: Yup.number().required("Amount is required"),
    paymentFrequency: Yup.string().required("Payment frequency is required"),
  });

  const initialValues = {
    paymentFrequency: savedState?.paymentFrequency || "",
    paymentRate: savedState?.paymentRate || "",
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (!hasChanges) {
        nextStep();
        setSubmitting(false);
        return;
      }

      const payload = {
        ...values,
        userId, //  Include userId for backend filtering
      };

      updatePayment(payload, {
        onSuccess: () => {
          const updated = {
            ...JSON.parse(localStorage.getItem(`${username}_personalInfo`)),
            ...values,
          };
          localStorage.setItem(`${username}_personalInfo`, JSON.stringify(updated));
          nextStep();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  useEffect(() => {
    const changesDetected = Object.keys(initialValues).some(
      (key) => formik.values[key] !== initialValues[key]
    );
    setHasChanges(changesDetected);
  }, [formik.values, initialValues]);

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="text-lg font-semibold leading-normal">
        Compensation and Budget
      </div>

      <CustomForm onSubmit={formik.handleSubmit}>
        {/* Payment Rate */}
        <div className="flex flex-col w-full gap-2 relative">
          <div className="flex items-center gap-3">
            <label
              htmlFor="paymentRate"
              className="text-sm font-semibold leading-normal"
            >
              Payment Rate *
            </label>
            {formik.errors.paymentRate && (
              <p className="text-sm text-red-500">
                {formik.errors.paymentRate}
              </p>
            )}
          </div>
          <div className="relative flex items-center">
            <span className="ring-1 ring-black/50 rounded-s-lg font-bold bg-gray-400 px-6 p-3">
              {currencySymbol}
            </span>
            <input
              type="number"
              name="paymentRate"
              onBlur={formik.handleBlur}
              id="paymentRate"
              value={formik.values.paymentRate}
              onChange={formik.handleChange}
              className="w-full bg-transparent border ring-1 rounded-e-lg outline-none ring-gray-400 p-3 text-sm caret-black font-medium focus:ring-2 focus:ring-blue-500"
              style={{
                borderColor: "rgba(0, 0, 0, 0.20)",
              }}
            />
          </div>
          <p className="text-xs text-gray-500 italic mt-1">
            You can edit the payment amount directly here.
          </p>
        </div>

        {/* Payment Frequency */}
        <div className="relative flex flex-col w-full gap-2">
          <div className="flex items-center gap-3">
            <label
              htmlFor="paymentFrequency"
              className="text-sm font-semibold leading-normal"
            >
              Payment Frequency *
            </label>
            {formik.errors.paymentFrequency && (
              <p className="text-sm text-red-500">
                {formik.errors.paymentFrequency}
              </p>
            )}
          </div>
          <select
            name="paymentFrequency"
            id="paymentFrequency"
            value={formik.values.paymentFrequency}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className="w-full bg-transparent border outline-gray-400 rounded-lg p-3 text-sm appearance-none"
            style={{
              borderColor: "rgba(0, 0, 0, 0.20)",
            }}
          >
            <option value="Monthly">Monthly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Weekly">Weekly</option>
          </select>
          <div className="absolute top-[70%] right-4 transform -translate-y-1/2 pointer-events-none text-blue-600 text-2xl">
            <img src={dropdownarrow} alt="" />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            isLoading={formik.isSubmitting || isUpdating}
            type="primary"
            buttonType="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            size="large"
          >
            {hasChanges ? "Save and Continue" : "Continue"}
          </Button>
        </div>
      </CustomForm>
    </div>
  );
};

export default FormThree;