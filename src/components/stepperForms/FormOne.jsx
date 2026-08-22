import dropdownarrow from "../../assets/svg/dropdownarrow.svg";
import { GiPadlock } from "react-icons/gi";
import { useFormik } from "formik";
import * as Yup from "yup";
import useGetCountries from "../../features/countriesandstates/useGetCountries";
import { useState, useEffect } from "react";
import useGetStates from "../../features/countriesandstates/useGetStates";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../Button";
import usePersonalInfoContract from "../../features/contracts/usePersonalInfoContract";
import CustomForm from "../../ui/CustomForm";
import CustomInput from "../../ui/CustomInput";

const FormOne = ({ nextStep, savedState, contractType, username, userId }) => {
  const { countries, isLoading } = useGetCountries();
  const [hasChanges, setHasChanges] = useState(false);
  const [isCountryLocked, setIsCountryLocked] = useState(false);
  const [isStateLocked, setIsStateLocked] = useState(false);

  const selectedIso = savedState
    ? countries?.find((el) => el.name === savedState?.country)?.iso2
    : null;
  const [selectedCountry, setSelectedCountry] = useState(selectedIso || "");
  const { states, isLoading: loadingStates } = useGetStates(selectedCountry);
  const queryClient = useQueryClient();
  const { postForm, isLoading: sendingForm } = usePersonalInfoContract();

  const validationSchema = Yup.object({
    clientName: Yup.string().required("Client name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().nullable(),
    companyName: Yup.string().required("Company name is required"),
  });

  const initialValues = {
    clientName: savedState?.clientName || "",
    email: savedState?.email || "",
    country: savedState?.country || "",
    state: savedState?.region || "",
    companyName: savedState?.companyName || "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (!hasChanges) {
        nextStep();
        setSubmitting(false);
        return;
      }

      const details = {
        clientName: values?.clientName,
        email: values?.email,
        country: values?.country,
        companyName: values.companyName,
        contractType,
        userId,
        ...(values.state && { region: values.state }),
      };

      const isNigerian = values?.country?.toLowerCase() === "nigeria";
      localStorage.setItem(
        `${username}_userCurrencyCode`,
        isNigerian ? "NGN" : "USD",
      );
      localStorage.setItem(`${username}_personalInfo`, JSON.stringify(details));
      localStorage.setItem(`${username}_countryLocked`, "true");
      localStorage.setItem(`${username}_stateLocked`, "true");

      postForm(details, {
        onSuccess: () => nextStep(),
        onSettled: () => setSubmitting(false),
      });
    },
  });

  useEffect(() => {
    const savedInfo = JSON.parse(
      localStorage.getItem(`${username}_personalInfo`),
    );
    const countryLocked =
      localStorage.getItem(`${username}_countryLocked`) === "true";
    const stateLocked =
      localStorage.getItem(`${username}_stateLocked`) === "true";

    if (savedInfo) {
      formik.setValues((prev) => ({
        ...prev,
        ...savedInfo,
      }));
    }

    if (countryLocked) setIsCountryLocked(true);
    if (stateLocked) setIsStateLocked(true);
  }, [username]);


  useEffect(() => {
    if (!countries?.length) return;
  
    const countryName = formik.values?.country;
  
    if (!countryName) return;
  
    const selected = countries.find(
      (country) => country.name === countryName
    );
  
    if (selected) {
      setSelectedCountry(selected.iso2);
    }
  }, [countries, formik.values?.country]);
  

  useEffect(() => {
    const changesDetected = Object.keys(initialValues).some(
      (key) => formik.values[key] !== initialValues[key],
    );
    setHasChanges(changesDetected);
  }, [formik.values, initialValues]);

  
  // change country
  const handleCountryChange = (e) => {
    const selectedIso = e.target.value;
    const selected = countries?.find((c) => c.iso2 === selectedIso);
  
    if (selected) {
      setSelectedCountry(selectedIso);
      formik.setFieldValue("country", selected.name);
  
      // Reset state because the country has changed
      formik.setFieldValue("state", "");
  
      // Keep state editable
      setIsStateLocked(false);
      localStorage.setItem(`${username}_stateLocked`, "false");
  
      queryClient.invalidateQueries(["states"]);
  
      const isNigerian = selected.name.toLowerCase() === "nigeria";
  
      localStorage.setItem(
        `${username}_userCurrencyCode`,
        isNigerian ? "NGN" : "USD",
      );
  
      // Keep the lock icon visible as an indicator.
      // It does NOT disable the select.
      setIsCountryLocked(true);
      localStorage.setItem(`${username}_countryLocked`, "true");
    }
  };

 // select country state
 const handleStateChange = (e) => {
    formik.setFieldValue("state", e.target.value);
  
    // Keep the lock icon visible, but DO NOT lock the field.
    setIsStateLocked(true);
    localStorage.setItem(`${username}_stateLocked`, "true");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-lg font-semibold leading-normal xl:text-2xl xl:mb-[18px]">
        <h2>Create your organization</h2> 
       <p className="mt-2 text-sm font-medium italic text-gray-600">Entering this correctly can help your agent make smarter decisions when recruiting</p>
      </div>

      <CustomForm onSubmit={formik.handleSubmit}>
        <CustomInput
          label="Client Name"
          type="text"
          name="clientName"
          id="clientName"
          placeholder="John Doe"
          disabled={formik.isSubmitting || sendingForm}
          error={Boolean(
            formik.errors?.clientName && formik.touched?.clientName,
          )}
          errorMessage={formik.errors?.clientName}
          onBlur={formik.handleBlur}
          value={formik.values?.clientName}
          onChange={formik.handleChange}
          required={true}
        />

        <CustomInput
          label="Email"
          type="email"
          name="email"
          disabled={formik.isSubmitting || sendingForm}
          id="email"
          placeholder="John@gmail.com"
          error={Boolean(formik.errors?.email && formik.touched?.email)}
          errorMessage={formik.errors?.email}
          onBlur={formik.handleBlur}
          value={formik.values?.email}
          onChange={formik.handleChange}
          required={true}
        />

        {/* Country Dropdown */}
        <div className="flex flex-col w-full gap-1 xl:gap-4">
          <div className="flex items-center gap-3">
            <label
              htmlFor="country"
              className="text-sm font-semibold leading-normal"
            >
              Country <span className="text-red-500">*</span>
            </label>
            {formik.errors.country && (
              <p className="text-sm italic text-red-500">
                {formik.errors.country}
              </p>
            )}
          </div>
          <div className="relative">
            <select
              name="country"
              id="country"
              disabled={
                isLoading ||
                formik.isSubmitting ||
                sendingForm 
                //isCountryLocked
              }
              onChange={handleCountryChange}
              value={
                countries?.find((c) => c.name === formik.values?.country)
                  ?.iso2 || ""
              }
              className="appearance-none w-full disabled:ring-gray-300  bg-transparent ring-1 ring-[#00000033] outline-none rounded-lg  p-3 text-sm"
            >
              <option value="">
                {isLoading ? "Loading Countries..." : "Select Country"}
              </option>
              {countries?.map((country) => (
                <option key={country.id} value={country.iso2}>
                  {country?.name}
                </option>
              ))}
            </select>
            <div className="absolute top-[50%] right-4 transform -translate-y-1/2 pointer-events-none text-gray-500">
              {isCountryLocked ? (
                <GiPadlock size={18} />
              ) : (
                <img src={dropdownarrow} alt="" />
              )}
            </div>
          </div>
          {isCountryLocked && (
            <p className="mt-1 text-xs italic text-gray-500">
              Country selection is locked after submission.
            </p>
          )}
        </div>

        {/* State Dropdown */}
        <div className="flex flex-col w-full gap-1 xl:gap-4">
          <label
            htmlFor="state"
            className="text-sm font-semibold leading-normal"
          >
            Region/Province/State
          </label>
          <div className="relative">
            <select
              name="state"
              disabled={
                loadingStates ||
                !formik.values.country ||
                formik.isSubmitting ||
                sendingForm ||
                !selectedCountry
              }
              id="state"
              // onChange={(e) => formik.setFieldValue("state", e.target.value)}
              onChange={handleStateChange}
              value={formik.values.state}

              className="appearance-none w-full disabled:ring-gray-300 border overview-expense-bgs bg-transparent ring-1 ring-[#00000033] outline-none rounded-lg  p-3 text-sm "
            >
              <option value="">
                {loadingStates
                  ? "Loading States..."
                  : states?.length === 0
                    ? "-"
                    : "Select State"}
              </option>
              {states?.map((state) => (
                <option key={state.id} value={state?.name}>
                  {state?.name}
                </option>
              ))}
            </select>
            <div className="absolute top-[50%] right-4 transform -translate-y-1/2 pointer-events-none text-gray-500">
              {isStateLocked ? (
                <GiPadlock size={18} />
              ) : (
                <img src={dropdownarrow} alt="dropdown_icon" />
              )}
            </div>
          </div>
          {isStateLocked && (
            <p className="mt-1 text-xs italic text-gray-500">
              State selection is locked after submission.
            </p>
          )}
        </div>
        {/* Fallback message when no states are available */}
        {states?.length === 0 && (
          <p className="mt-2 text-sm italic text-gray-500">
            No region/state required for your selected country.
          </p>
        )}

        {/* Company Name */}
        {formik.values.country && (
          <CustomInput
            label="Company Name"
            type="text"
            name="companyName"
            disabled={formik.isSubmitting || sendingForm}
            id="companyName"
            placeholder="Enter company name"
            value={formik.values?.companyName}
            onChange={formik.handleChange}
            required={true}
          />
        )}

        {/* Currency Note */}
        <p className="mt-2 text-xs italic text-gray-600">
          Register you and your company&apos;s information to help the agent map
          the right talent to you.
          <br />
          Ensure all fields are correct
        </p>

        {/* Submit Button */}
        <div className="mt-4">
          <Button
            isLoading={formik.isSubmitting || sendingForm}
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

export default FormOne;
