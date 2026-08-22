import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useState } from "react";
import { useGlobalContext } from "../Context";
import toast from "react-hot-toast";
import authFetch from "../api";
import Socials from "../components/Socials";
import Captcha from "../components/Captcha";

const SignUp = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ 
    loading: false, 
    provider: null 
  });
  const { setUserBio } = useGlobalContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /* ---------------- CAPTCHA STATE ---------------- */

  const [captchaData, setCaptchaData] = useState({
    captchaId: "",
    captchaAnswer: "",
    verified: false,
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+!])[A-Za-z\d@#$%^&*()_+!]{8,24}$/;
    if (!formData.firstName.trim()) {
      toast.error("first name is required.");
      return false;
    } else if (!formData.lastName.trim()) {
      toast.error("last name is required.");
      return false;
    } else if (!formData.email.trim()) {
      toast.error("email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("invalid email format.");
      return false;
    } else if (!formData.password.trim()) {
      toast.error("password should not be empty.");
      return false;
    } else if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    } else if (!confirmPassword.trim()) {
      toast.error("confirm password is required.");
      return false;
    } else if (formData.password !== confirmPassword) {
      toast.error("passwords do not match.");
      return false;
    }

    /* ---------------- CAPTCHA VALIDATION ---------------- */
    if (!captchaData.verified) {
      toast.error("Please complete the CAPTCHA verification.");
      return false;
    }

    if (!captchaData.captchaId) {
      toast.error("CAPTCHA verification is missing. Please try again.");
      return false;
    }

    if (!captchaData.captchaAnswer.trim()) {
      toast.error("Please enter the CAPTCHA.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- CAPTCHA CHANGE ---------------- */

  const handleCaptchaChange = (data) => {
    setCaptchaData(data);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (socialLoading.loading) return;

    setIsLoading(true);

    if (validateForm()) {
      try {

        /*
         * CAPTCHA values are added only when sending
         * the request to the backend.
         */
        const signupData = {
          ...formData,
          captchaId: captchaData.captchaId,
          captchaAnswer: captchaData.captchaAnswer,
        };

        const response = await authFetch.post(
          "/auth",
          JSON.stringify(signupData)
        );

        if (response.data === "success" || response.status === 201) {
          const userBio = response.data.result;
          setUserBio(userBio);
          toast.success("Check mail for otp");
          setTimeout(() => {
            navigate("/account-verification", {
              state: { email: formData.email },
            });
          }, 2000);
        }

        const tokenResp = response.data.result;
        const accessTokenExpiration = Date.now() + 1200000;
        const refreshTokenExpiration = Date.now() + 604800000;

        const tokenData = {
          accessToken: tokenResp.accessToken,
          refreshToken: tokenResp.refreshToken,
          accessTokenExpiration,
          refreshTokenExpiration,
        };

        localStorage.setItem("user", JSON.stringify(tokenData));

      } catch (error) {

        /*
         * CAPTCHA FAILED / EXPIRED
         */
        if (
          error.response?.status === 400 &&
          (
            error.response?.data?.message === "Invalid CAPTCHA" ||
            error.response?.data?.message === "CAPTCHA expired" ||
            error.response?.data?.message === "CAPTCHA verification failed"
          )
        ) {
          toast.error(error.response?.data?.message || "CAPTCHA verification failed. Please try again.");

          /*
           * Clear the old CAPTCHA so the user is
           * required to complete a fresh challenge.
           */
          setCaptchaData({
            captchaId: "",
            captchaAnswer: "",
            verified: false,
          });

          return false;
        }

        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "email already exist"
        ) {
          toast.error("email already exists.");
          return false;
        }

        toast.error(error.response?.data?.message || "Unable to create account. Please try again.");
        console.log(error);

      } finally {
        setIsLoading(false);
      }

    } else {
      setIsLoading(false);
    }
  };

  const handleSocialLoadingChange = ({ loading, provider }) => {
    setSocialLoading({ loading, provider });
  };

  // Function to capitalize first letter of provider name
  const capitalizeFirst = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-lg bg-white rounded-xl shadow-md p-6 relative ${socialLoading.loading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Loading Overlay */}
        {socialLoading.loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin h-8 w-8 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              <span className="text-sm font-medium">
                Redirecting to {capitalizeFirst(socialLoading.provider)}...
              </span>
            </div>
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create account with
        </h1>
        
        <Socials 
          isRegisterPage 
          onLoadingChange={handleSocialLoadingChange}
        />

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              htmlFor="firstName"
              label="First Name"
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full"
              disabled={socialLoading.loading}
            />

            <FormInput
              htmlFor="lastName"
              label="Last Name"
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full"
              disabled={socialLoading.loading}
            />
          </div>

          <FormInput
            htmlFor="email"
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={socialLoading.loading}
          />

          <div className="relative">
            <FormInput
              htmlFor="password"
              label="Password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              disabled={socialLoading.loading}
            />
          </div>

          <div className="relative">
            <FormInput
              htmlFor="confirmPassword"
              label="Confirm Password"
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={socialLoading.loading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || socialLoading.loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors overview-expense disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`text-blue-600 hover:text-blue-800 font-medium ${socialLoading.loading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Login
          </Link>
        </div>
        {/* ------------------------------
            SERVER-GENERATED CAPTCHA
        -------------------------------- */}

        <Captcha
          disabled={
            isLoading ||
            socialLoading.loading
          }
          onCaptchaChange={handleCaptchaChange}
        />
      </div>
    </section>
  );
};

export default SignUp;