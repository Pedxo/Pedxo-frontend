import { useState } from "react";
import FormInput from "../components/FormInput";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authFetch from "../api";

const AccountVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;

  const handleChange = (e) => {
    setVerificationCode(e.target.value.slice(0, 6));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const verificationData = {
      email: email,
      code: verificationCode,
    };

    try {
      await authFetch.post(
        "/auth/verify-email",
        JSON.stringify(verificationData)
      );
      toast.success("Account created successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      if (error.response.data.message[0] === "code should not be empty") {
        toast.error(error.response.data.message[0]);
      } else if (
        error.response.data.message ===
        "Your code has either expire or is Invalid"
      ) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async () => {
    const otpData = {
      email: email,
      type: "Email Verification",
    };

    try {
      const res = await authFetch.post(
        "/auth/request-otp",
        JSON.stringify(otpData)
      );
      if (res.data) {
        toast.success("Check mail for otp");
      }
      console.log(res);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <h1 className="mb-[59px] text-2xl font-semibold leading-normal 2xl:text-[30px] 2xl:mb-5">
          A verification OTP has been sent to:
          <p className="text-sm text-[#00000099]">{email}</p>
        </h1>
        <form onSubmit={handleFormSubmit}>
          <FormInput
            htmlFor="code"
            label="Enter OTP"
            type="number"
            name="code"
            id="code"
            placeholder="code"
            value={verificationCode}
            onChange={handleChange}
          />

          <button
            type="button"
            className="pr-text-clr mt-1"
            onClick={requestOtp}
          >
            Resend otp
          </button>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="outline-none py-4 font-medium pr-bg-clr text-white w-full mt-[6px] rounded-lg"
            >
              {isLoading ? <div className="loading"></div> : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default AccountVerification;
